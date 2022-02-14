import puppeteer, { HTTPRequest } from 'puppeteer'
import { logger, createSlackLogger } from './logger'
import { createArrayString } from './createArrayString'
import { streamFileToGCS } from './streamFileToGCS'

const ncsbeReportsSearchUrl = 'https://cf.ncsbe.gov/CFDocLkup/ExportSearchResults/'
const bucket = 'raw-reports'

type ScraperInput = {
  attributes: {
    year: string;
  };
  message: {
    data: string;
  }
}

interface ScraperEventFunction {
  (data: ScraperInput): Promise<void>
}

const reportCodes = [
  'CIAUL',  'COAUL',  'COCMRP', 'CTCDCF', 'CTINST', 'CTIPC',
  'CTRAST', 'CTTHLD', 'CTTREA', 'CTCLSC', 'CTCBAS', 'CICRUU',
  'CTDOI',  'CODN',   'CIDAL',  'CODAL',  'CIEMAL', 'COEMAL',
  'CTFLS',  'CTIXPC', 'CTLPS',  'COMEMO', 'CIMISC', 'COMISC',
  'CINCL',  'CONCL',  'CINOC',  'CINTAS', 'CONTAS', 'CONCRS',
  'OT',     'CIPPAF', 'CIPA',   'COPAD',  'COPA30', 'COPA60',
  'COPARC', 'CIPAL',  'COPAL',  'CIPRAE', 'COPRAP', 'CIPWL',
  'COPWL',  'CIPWR',  'CTPESP', 'CORESL', 'CISPWA', 'SO',
  'IRECR',  'IR48H',  'RPANN',  'RPCSC',  'RPECRD', 'RPMDYR',
  'RPYRND', 'RPFIN',  'RPQTR1', 'RPQTR4', 'IRIEX',  'IRCIX',
  'RPIER',  'RPINTM', 'IRJQY',  'RPMYSA', 'RPMNTH', 'IRMVEQ',
  'IRNPC',  'RPORG',  'RPPGEN', 'RPPPRI', 'RPPREE', 'RPPREP',
  'RPPRER', 'RPPREO', 'RPQTR2', 'RPSPC',  'RPSFIN', 'RP10D',
  'RPQTR3', 'RP30D',  'RP35D',  'RP12D',  'IRVEQ',  'RPWK',
  'RPYESA'
]

// const year = '2019'

export const reportsScraper: ScraperEventFunction = async (message) => {
  const slackLogger = await createSlackLogger()

  try {
    const { attributes } = message
    const { year } = attributes

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

    const filename = `nc-reports-${year}.csv`

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
