"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsScraper = void 0;
const tslib_1 = require("tslib");
const puppeteer_1 = (0, tslib_1.__importDefault)(require("puppeteer"));
const date_fns_1 = require("date-fns");
const streamFileToGCS_1 = require("./streamFileToGCS");
const logger_1 = require("./logger");
const ncsbeTransactionsSearchUrl = 'https://cf.ncsbe.gov/CFTxnLkup/';
const bucketName = 'raw-transactions';
const transactionTypes = ['rec', 'exp', 'all'];
const transactionsScraper = (message, context) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const slackLogger = yield (0, logger_1.createSlackLogger)();
    try {
        const { attributes } = message;
        const { to, from, type = 'all' } = attributes;
        slackLogger.info(`Starting scraper for transactions ${from} - ${to} for type ${type}`);
        if (!transactionTypes.includes(type)) {
            throw new Error(`Transaction type must be one of 'rec' | 'exp' | 'all'. Received ${type}`);
        }
        const browser = yield puppeteer_1.default.launch({ args: ['--no-sandbox'] });
        const page = yield browser.newPage();
        yield page.goto(ncsbeTransactionsSearchUrl);
        if (!(0, date_fns_1.isValid)(new Date(from)) || !(0, date_fns_1.isValid)(new Date(to))) {
            throw new Error('Invalid Date Parameters - Date Parameters must be from=mm/dd/yyyy and to=mm/dd/yyyy');
        }
        if (!(0, date_fns_1.isMatch)(from, 'mm/dd/yyyy') || !(0, date_fns_1.isMatch)(to, 'mm/dd/yyyy')) {
            throw new Error('Invalid Date - Date must be valid and format must be mm/dd/yyyy');
        }
        logger_1.logger.info(`Pulling transaction records for dates ${from} :: ${to} of type ${type}`);
        yield page.select('#TransType', type);
        yield page.type('#DateFrom', from);
        yield page.type('#DateTo', to);
        yield page.click('#btnSearch');
        yield page.waitForSelector('#btnExportResults', { visible: true, timeout: 0 });
        yield page.click('#btnExportResults');
        yield page.setRequestInterception(true);
        const csvRequest = yield new Promise((resolve, reject) => {
            page.on('request', (interceptedRequest) => {
                interceptedRequest.abort();
                return resolve(interceptedRequest);
            });
        });
        yield browser.close();
        const requestOptions = {
            encoding: null,
            method: csvRequest.method(),
            url: csvRequest.url(),
            data: csvRequest.postData(),
            headers: csvRequest.headers(),
        };
        const options = {
            contentType: 'text/csv',
        };
        const metadata = {
            prefix: type,
            tags: [type],
        };
        let filename = `nc-${type}-${from}-to-${to}.csv`;
        filename = filename.replace(/\//g, '');
        logger_1.logger.info(`Starting stream for file ${filename}`);
        slackLogger.info(`Starting stream for file ${filename}`);
        const result = yield (0, streamFileToGCS_1.streamFileToGCS)(requestOptions, bucketName, filename, options, metadata);
        logger_1.logger.info(result);
        slackLogger.info(`Stream ${filename} finished successfully.`);
        return;
    }
    catch (err) {
        logger_1.logger.error('TransactionsScraper Function Error', err);
        slackLogger.error('TransactionsScraper Function Error', err);
        throw err;
    }
    return;
});
exports.transactionsScraper = transactionsScraper;
//# sourceMappingURL=transactionsScraper.js.map