import { __awaiter } from "tslib";
import { logger, createSlackLogger } from '../utils/logger';
import { createArrayString } from '../utils/createArrayString';
import { streamFileToGCS } from '../helpers/streamFileToGCS';
const ncsbeReportsSearchUrl = 'https://cf.ncsbe.gov/CFDocLkup/ExportSearchResults/';
const bucket = 'raw-reports';
const reportCodes = [
    'CIAUL', 'COAUL', 'COCMRP', 'CTCDCF', 'CTINST', 'CTIPC',
    'CTRAST', 'CTTHLD', 'CTTREA', 'CTCLSC', 'CTCBAS', 'CICRUU',
    'CTDOI', 'CODN', 'CIDAL', 'CODAL', 'CIEMAL', 'COEMAL',
    'CTFLS', 'CTIXPC', 'CTLPS', 'COMEMO', 'CIMISC', 'COMISC',
    'CINCL', 'CONCL', 'CINOC', 'CINTAS', 'CONTAS', 'CONCRS',
    'OT', 'CIPPAF', 'CIPA', 'COPAD', 'COPA30', 'COPA60',
    'COPARC', 'CIPAL', 'COPAL', 'CIPRAE', 'COPRAP', 'CIPWL',
    'COPWL', 'CIPWR', 'CTPESP', 'CORESL', 'CISPWA', 'SO',
    'IRECR', 'IR48H', 'RPANN', 'RPCSC', 'RPECRD', 'RPMDYR',
    'RPYRND', 'RPFIN', 'RPQTR1', 'RPQTR4', 'IRIEX', 'IRCIX',
    'RPIER', 'RPINTM', 'IRJQY', 'RPMYSA', 'RPMNTH', 'IRMVEQ',
    'IRNPC', 'RPORG', 'RPPGEN', 'RPPPRI', 'RPPREE', 'RPPREP',
    'RPPRER', 'RPPREO', 'RPQTR2', 'RPSPC', 'RPSFIN', 'RP10D',
    'RPQTR3', 'RP30D', 'RP35D', 'RP12D', 'IRVEQ', 'RPWK',
    'RPYESA'
];
export const reportsScraper = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const slackLogger = yield createSlackLogger();
    try {
        const { attributes } = message;
        const { year } = attributes;
        logger.info('Starting reports scraper', { year, reportCodes });
        slackLogger.info('Starting reports scraper');
        const reportsString = createArrayString(reportCodes);
        const requestUrl = `${ncsbeReportsSearchUrl}?year=${year}&reports=${reportsString}`;
        logger.info('Request Url', requestUrl);
        const requestOptions = {
            encoding: null,
            method: 'GET',
            url: requestUrl,
            headers: {
                contentType: 'text/csv'
            }
        };
        const options = {
            contentType: 'text/csv'
        };
        const filename = `nc-reports-${year}.csv`;
        const result = yield streamFileToGCS(requestOptions, bucket, filename, options);
        logger.info('Reports scraper finished successfully');
        slackLogger.info('Reports scraper finished successfully');
    }
    catch (err) {
        logger.error('Reports Scraper Function Error', err);
        slackLogger.info('Reports Scraper Function Error', err);
        throw err;
    }
    return;
});
//# sourceMappingURL=reportsScraper.js.map