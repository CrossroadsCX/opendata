"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsScraper = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("./logger");
const createArrayString_1 = require("./createArrayString");
const streamFileToGCS_1 = require("./streamFileToGCS");
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
const reportsScraper = (message) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const slackLogger = yield (0, logger_1.createSlackLogger)();
    try {
        const { attributes } = message;
        const { year } = attributes;
        logger_1.logger.info('Starting reports scraper', { year, reportCodes });
        slackLogger.info('Starting reports scraper');
        const reportsString = (0, createArrayString_1.createArrayString)(reportCodes);
        const requestUrl = `${ncsbeReportsSearchUrl}?year=${year}&reports=${reportsString}`;
        logger_1.logger.info('Request Url', requestUrl);
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
        const result = yield (0, streamFileToGCS_1.streamFileToGCS)(requestOptions, bucket, filename, options);
        logger_1.logger.info('Reports scraper finished successfully');
        slackLogger.info('Reports scraper finished successfully');
    }
    catch (err) {
        logger_1.logger.error('Reports Scraper Function Error', err);
        slackLogger.info('Reports Scraper Function Error', err);
        throw err;
    }
    return;
});
exports.reportsScraper = reportsScraper;
//# sourceMappingURL=reportsScraper.js.map