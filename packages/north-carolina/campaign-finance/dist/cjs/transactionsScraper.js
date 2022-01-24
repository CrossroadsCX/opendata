"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsScraper = void 0;
const tslib_1 = require("tslib");
const puppeteer_1 = (0, tslib_1.__importDefault)(require("puppeteer"));
const date_fns_1 = require("date-fns");
const streamFileToGCS_1 = require("./streamFileToGCS");
const logger_1 = require("./logger");
const ncsbeTransactionsSearchUrl = 'https://cf.ncsbe.gov/CFTxnLkup/';
const transactionTypes = ['rec', 'exp', 'all'];
const transactionsScraper = ({ message }, context) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(message, context);
        const { attributes } = message;
        const { to, from, type = 'all' } = attributes;
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
        logger_1.logger.info(`Pulling transaction records for dates ${from} :: ${to}`);
        yield page.select('#TransType', type);
        yield page.type('#DateFrom', from);
        yield page.type('#DateTo', to);
        yield page.click('#btnSearch');
        yield page.waitForSelector('#btnExportResults', { visible: true, timeout: 0 });
        yield page.click('#btnExportResults');
        yield page.setRequestInterception(true);
        const csvRequest = yield new Promise((resolve) => {
            page.on('request', (interceptedRequest) => {
                interceptedRequest.abort();
                resolve(interceptedRequest);
            });
        });
        yield browser.close();
        logger_1.logger.info('Received CSV file information');
        const requestOptions = {
            encoding: null,
            method: csvRequest.method(),
            url: csvRequest.url(),
            data: csvRequest.postData(),
            headers: csvRequest.headers(),
        };
        const options = {
            contentType: 'text/csv',
            metadata: {
                prefix: 'ncreceipt',
                tags: ['ncreceipt', 'ncfinance'],
            },
        };
        logger_1.logger.info(requestOptions);
        let filename = `nc-receipts-${from}-to-${to}.csv`;
        filename = filename.replace(/\//g, '');
        logger_1.logger.info(`Starting stream for file ${filename}`);
        const bucket = 'dummy-bucket-finance';
        const result = yield (0, streamFileToGCS_1.streamFileToGCS)(requestOptions, bucket, filename, options);
        logger_1.logger.info(result);
    }
    catch (err) {
        logger_1.logger.error(err);
        throw err;
    }
    return;
});
exports.transactionsScraper = transactionsScraper;
//# sourceMappingURL=transactionsScraper.js.map