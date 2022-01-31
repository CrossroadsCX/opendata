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
    'RPQTR1',
    'RPQTR2',
    'RPWTR3',
    'RPQTR4',
    'RPANN',
    'RPMYSA',
    'RPYESA',
];
const year = '2021';
const reportsScraper = () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const slackLogger = yield (0, logger_1.createSlackLogger)();
    try {
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
        const filename = `nc-reports-${year}-${reportsString}.csv`;
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