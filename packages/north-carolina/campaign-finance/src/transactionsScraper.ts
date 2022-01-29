import puppeteer, { HTTPRequest } from 'puppeteer'
import { isValid, isMatch } from 'date-fns'
import type { CloudFunctionsContext } from '@google-cloud/functions-framework/build/src/functions'

import { streamFileToGCS } from './streamFileToGCS'
import { logger, createSlackLogger } from './logger'

const ncsbeTransactionsSearchUrl = 'https://cf.ncsbe.gov/CFTxnLkup/'

const transactionTypes = ['rec', 'exp', 'all']

type ScraperAttributes = {
  to: string;
  from: string;
  type: 'rec' | 'exp' | 'all'
}

type ScraperInput = {
  attributes: ScraperAttributes;
  message: {
    attributes: ScraperAttributes;
    data: string;
  }
}

interface ScraperEventFunction {
  (data: ScraperInput, context: CloudFunctionsContext): Promise<void>
}

export const transactionsScraper: ScraperEventFunction = async (message, context) => {
  try {

    const slackLogger = await createSlackLogger()

    logger.info('Message', message)
    logger.info('Context', context)

    const { attributes } = message
    const { to, from, type = 'all' } = attributes

    slackLogger.info(`Starting scraper for transactions ${from} - ${to} for type ${type}`)

    if (!transactionTypes.includes(type)) {
      throw new Error(`Transaction type must be one of 'rec' | 'exp' | 'all'. Received ${type}`)
    }

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.goto(ncsbeTransactionsSearchUrl);

    if (!isValid(new Date(from)) || !isValid(new Date(to))) {
      throw new Error('Invalid Date Parameters - Date Parameters must be from=mm/dd/yyyy and to=mm/dd/yyyy')
    }

    if (!isMatch(from, 'mm/dd/yyyy') || !isMatch(to, 'mm/dd/yyyy')) {
      throw new Error('Invalid Date - Date must be valid and format must be mm/dd/yyyy')
    }

    logger.info(`Pulling transaction records for dates ${from} :: ${to}`)

    // Select transaction type
    await page.select('#TransType', type)

    // Fill out date fields
    await page.type('#DateFrom', from)
    await page.type('#DateTo', to)

    // Start search
    await page.click('#btnSearch')

    // Wait and click Export csv button
    await page.waitForSelector('#btnExportResults', { visible: true, timeout: 0 })
    await page.click('#btnExportResults')

    // Intercept the generated file
    await page.setRequestInterception(true)

    const csvRequest: HTTPRequest = await new Promise((resolve, reject) => {
      page.on('request', (interceptedRequest) => {
        interceptedRequest.abort()
        return resolve(interceptedRequest)
      })
    })

    // Close the browser
    await browser.close()

    logger.info('Received CSV file information')
    slackLogger.info('Received CSV file information successfully')

    //streamFileToGCS parameters
    const requestOptions = {
      encoding: null,
      method: csvRequest.method(),
      url: csvRequest.url(),
      data: csvRequest.postData(),
      headers: csvRequest.headers(),
    }

    logger.info("Request Options", requestOptions)

    const options = {
      contentType: 'text/csv',
    }

    const metadata = {
      prefix: type,
      tags: [type],
    }

    logger.info("Metadata", metadata)

    let filename = `nc-${type}-${from}-to-${to}.csv`
    filename = filename.replace(/\//g, '')

    logger.info(`Starting stream for file ${filename}`)
    slackLogger.info(`Starting stream for file ${filename}`)

    const bucket = 'dummy-bucket-finance'

    //CSVRequest to Bucket Storage
    const result = await streamFileToGCS(requestOptions, bucket, filename, options, metadata)
    logger.info(result)
    slackLogger.info('Stream finished successfully.')
  } catch (err) {
    logger.error('TransactionsScraper Function Error', err)
    throw err
  }



  return
}
