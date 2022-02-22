import { PubSub } from '@google-cloud/pubsub'
import puppeteer, { ElementHandle } from 'puppeteer'
import { logger, createSlackLogger } from '../utils/logger'

const baseUrl = 'https://cf.ncsbe.gov'
const baseSearchUrl = 'https://cf.ncsbe.gov/CFDocLkup/DocumentResult/'
const topicName = 'report-image-requests'

type RowData = {
  committeeName: string;
  reportType: string;
  reportYear: string;
  rowImage: {
    href: string;
    text: string;
  },
  rowData: {
    href: string;
    text: string;
  }
}

type ScraperInput = {
  attributes: {
    year: string;
    code: string;
  },
  message: {
    data: string;
  }
}

interface ReportImagesScraper {
  ( data: ScraperInput ): Promise<RowData[]>
}

/**
 * Gets the image and data links for a given table row
 *  It must pull the links separately and grab the inner text / href attributes for each link
 *  We cannot simply pull the href attributes because the table elements build broken hrefs for unavailable items
 *    These items must be checked by their link text to determine if they're real links or not :(
 *
 * @param row
 * @returns Promise<RowData>
 */
const getRowData = async (row: ElementHandle): Promise<RowData> => {
  const committeeName = await row.$eval('td[aria-describedby="gridDocumentResults_CommitteeName"]', (td) => td.innerText)
  const reportYear = await row.$eval('td[aria-describedby="gridDocumentResults_ReportYear"]', (td) => td.innerText)
  const reportType = await row.$eval('td[aria-describedby="gridDocumentResults_ReportType"]', (td) => td.innerText)

  const rowImage = await row.$eval('td[aria-describedby="gridDocumentResults_ImageType"] a',
    (link) => {
      return {
        href: link.getAttribute('href'),
        text: link.innerText
      }
    }
  )

  const rowData = await row.$eval('td[aria-describedby="gridDocumentResults_DataType"] a',
    (link) => {
      return {
        href: link.getAttribute('href'),
        text: link.innerText,
      }
    }
  )

  const result = {
    committeeName,
    reportType,
    reportYear,
    rowImage,
    rowData,
  }

  return result as unknown as RowData
}

/**
 * Maps all row elements to the result of getRowData
 *  Helpful for just passing an array of rows and handling awaiting all promises
 *
 * @param rows
 * @returns Promise<RowData[]>
 */
const getRowsData = async (rows: ElementHandle[]) => {
  return await Promise.all(rows.map((row) => getRowData(row)))
}

export const reportImagesScraper: ReportImagesScraper = async (message) => {
  const { attributes } = message
  const { year, code } = attributes

  logger.info(`Pulling images for ${year} of type ${code}`)

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()

  const documentsSearchUrl = `${baseSearchUrl}?year=${year}&reports='${code}'`

  await page.goto(documentsSearchUrl)

  const tableBody = await page.$('#gridDocumentResults tbody')

  if (!tableBody) {
    throw new Error('Could not load table body')
  }

  const rows = await tableBody.$$('tr')

  const rowData = await getRowsData(rows)

  const rowsMissingData = rowData.filter((row) => {
    return !(row as unknown as RowData).rowData.text
  })

  await browser.close()

  const results = rowsMissingData.map((rowInfo) => {
    return {
      ...rowInfo,
      imageLink: `${baseUrl}${rowInfo.rowImage.href}`,
    }
  })

  const pubsub = new PubSub()

  const batchPublisher = pubsub.topic(topicName, {
    batching: {
      maxMessages: 10,
      maxMilliseconds: 10000,
    }
  })

  results.forEach(async (request) => {
    const requestBuffer = Buffer.from(JSON.stringify(request))
    const messageId = await batchPublisher.publish(requestBuffer)
    logger.info(`Message id ${messageId} published.`)
  })

  return results
}
