import puppeteer, { HTTPRequest } from 'puppeteer'
import { isValid, isMatch } from 'date-fns'
import type { CloudFunctionsContext } from '@google-cloud/functions-framework/build/src/functions'

import { streamFileToGCS } from '../helpers/streamFileToGCS'
import { logger, createSlackLogger } from '../utils/logger'

const ncsbeTransactionsSearchUrl = 'https://cf.ncsbe.gov/CFTxnLkup/'
const bucketName = 'raw-transactions'

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

// const params = {
//   "ReceiptType": "'GEN ','OTLN','IND ','PPTY','CPCM','LOAN','RFND','INT ','NFPC','OUTS','GNS ','FRLN','CNRE','LEFO','EPPS','DEBT','DON ','BFND'",
//   "ExpenditureType": "'BFND','CCPC','CPE ','DEBT','IEXP','INTR','LNRP','NMG ','OPER','RFND'",
//   "CommitteeType": "",
//   "PartyType": "",
//   "OfficeType": "",
//   "CommitteeIDs": null,
//   "CommitteeName": "",
//   "Cities": "",
//   "Counties": "",
//   "State": "",
//   "ZipCodes": "",
//   "DateFrom": "01/01/2021",
//   "DateTo": "01/10/2021",
//   "OrganizationName": "",
//   "FirstName": "",
//   "LastName": "",
//   "NameSoundsLike": false,
//   "NameIsOrg": false,
//   "Purpose": "",
//   "AmountFrom": "",
//   "AmountTo": "",
//   "JobProfession": "",
//   "JobProfSoundsLike": false,
//   "Employer": "",
//   "EmployerSoundsLike": false,
//   "PaymentType": "",
//   "Page": 0,
//   "Debug": false
// }

export const transactionsScraper: ScraperEventFunction = async (message, context) => {
  const slackLogger = await createSlackLogger()
  try {
    // logger.info('Message', message)
    // logger.info('Context', context)

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

    logger.info(`Pulling transaction records for dates ${from} :: ${to} of type ${type}`)

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

    // logger.info('Received CSV file information')
    // slackLogger.info('Received CSV file information successfully')

    //streamFileToGCS parameters
    const requestOptions = {
      encoding: null,
      method: csvRequest.method(),
      url: csvRequest.url(),
      data: csvRequest.postData(),
      headers: csvRequest.headers(),
    }

    // logger.info("Request Options", requestOptions)

    const options = {
      contentType: 'text/csv',
    }

    const metadata = {
      prefix: type,
      tags: [type],
    }

    // logger.info("Metadata", metadata)

    let filename = `nc-${type}-${from}-to-${to}.csv`
    filename = filename.replace(/\//g, '')

    logger.info(`Starting stream for file ${filename}`)
    slackLogger.info(`Starting stream for file ${filename}`)

    //CSVRequest to Bucket Storage
    const result = await streamFileToGCS(requestOptions, bucketName, filename, options, metadata)
    logger.info(result)
    slackLogger.info(`Stream ${filename} finished successfully.`)
    return
  } catch (err) {
    logger.error('TransactionsScraper Function Error', err)
    slackLogger.error('TransactionsScraper Function Error', err)
    throw err
  }

  return
}
