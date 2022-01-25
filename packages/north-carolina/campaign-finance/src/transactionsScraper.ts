import puppeteer, { HTTPRequest } from 'puppeteer'
import { isValid, isMatch } from 'date-fns'
import { Request } from 'express'
import type { Data, HttpFunction, EventFunction, CloudFunctionsContext, Context } from '@google-cloud/functions-framework/build/src/functions'
import { LegacyEvent } from '@google-cloud/functions-framework/build/src/functions'
import { streamFileToGCS } from './streamFileToGCS'
import { logger } from './logger'
import { assert } from 'console'

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
    const { attributes } = message
    const { to, from, type = 'all' } = attributes

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

    const csvRequest: HTTPRequest = await new Promise((resolve) => {
      page.on('request', (interceptedRequest) => {
        interceptedRequest.abort()
        resolve(interceptedRequest)
      })
    })

    // Close the browser
    await browser.close()

    logger.info('Received CSV file information')

    //streamFileToGCS parameters
    const requestOptions = {
      encoding: null,
      method: csvRequest.method(),
      url: csvRequest.url(),
      data: csvRequest.postData(),
      headers: csvRequest.headers(),
    }

    const options = {
      contentType: 'text/csv',
      metadata: {
        prefix: 'ncreceipt',
        tags: ['ncreceipt', 'ncfinance'],
      },
    }

    logger.info(requestOptions)

    let filename = `nc-receipts-${from}-to-${to}.csv`
    filename = filename.replace(/\//g, '')

    logger.info(`Starting stream for file ${filename}`)

    const bucket = 'dummy-bucket-finance'

    //CSVRequest to Bucket Storage
    const result = await streamFileToGCS(requestOptions, bucket, filename, options)
    logger.info(result)
  } catch (err) {
    logger.error(err)
    throw err
  }

  return
}
