import puppeteer, { HTTPRequest } from 'puppeteer'
import { logger, createSlackLogger } from './logger'
import { createArrayString } from './createArrayString'
import { streamFileToGCS } from './streamFileToGCS'

const ncsbeReportsSearchUrl = 'https://cf.ncsbe.gov/CFDocLkup/ExportSearchResults/'
const bucket = 'raw-reports'

const reportCodes = [
  'RPQTR1',
  'RPQTR2',
  'RPWTR3',
  'RPQTR4',
  'RPANN',
  'RPMYSA',
  'RPYESA',
]

const year = '2021'

export const reportsScraper = async () => {
  const slackLogger = await createSlackLogger()

  try {
    logger.info('Starting reports scraper', { year, reportCodes })
    slackLogger.info('Starting reports scraper')

    const reportsString = createArrayString(reportCodes)

    const requestUrl = `${ncsbeReportsSearchUrl}?year=${year}&reports=${reportsString}`

    logger.info('Request Url', requestUrl)

    const requestOptions = {
      encoding: null,
      method: 'GET',
      url: requestUrl,
      headers: {
        contentType: 'text/csv'
      }
    }

    const options = {
      contentType: 'text/csv'
    }

    const filename = `nc-reports-${year}-${reportsString}.csv`

    const result = await streamFileToGCS(requestOptions, bucket, filename, options)
    logger.info('Reports scraper finished successfully')
    slackLogger.info('Reports scraper finished successfully')
  } catch (err) {
    logger.error('Reports Scraper Function Error', err)
    slackLogger.info('Reports Scraper Function Error', err)
    throw err
  }

  return
}
