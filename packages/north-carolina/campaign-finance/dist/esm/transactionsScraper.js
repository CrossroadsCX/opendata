import { __awaiter } from "tslib";
import puppeteer from 'puppeteer';
import { isValid, isMatch } from 'date-fns';
import { streamFileToGCS } from './streamFileToGCS';
import { logger, createSlackLogger } from './logger';
const ncsbeTransactionsSearchUrl = 'https://cf.ncsbe.gov/CFTxnLkup/';
const transactionTypes = ['rec', 'exp', 'all'];
export const transactionsScraper = (message, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slackLogger = yield createSlackLogger();
        logger.info('Message', message);
        logger.info('Context', context);
        const { attributes } = message;
        const { to, from, type = 'all' } = attributes;
        slackLogger.info(`Starting scraper for transactions ${from} - ${to} for type ${type}`);
        if (!transactionTypes.includes(type)) {
            throw new Error(`Transaction type must be one of 'rec' | 'exp' | 'all'. Received ${type}`);
        }
        const browser = yield puppeteer.launch({ args: ['--no-sandbox'] });
        const page = yield browser.newPage();
        yield page.goto(ncsbeTransactionsSearchUrl);
        if (!isValid(new Date(from)) || !isValid(new Date(to))) {
            throw new Error('Invalid Date Parameters - Date Parameters must be from=mm/dd/yyyy and to=mm/dd/yyyy');
        }
        if (!isMatch(from, 'mm/dd/yyyy') || !isMatch(to, 'mm/dd/yyyy')) {
            throw new Error('Invalid Date - Date must be valid and format must be mm/dd/yyyy');
        }
        logger.info(`Pulling transaction records for dates ${from} :: ${to}`);
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
        logger.info('Received CSV file information');
        slackLogger.info('Received CSV file information successfully');
        const requestOptions = {
            encoding: null,
            method: csvRequest.method(),
            url: csvRequest.url(),
            data: csvRequest.postData(),
            headers: csvRequest.headers(),
        };
        logger.info("Request Options", requestOptions);
        const options = {
            contentType: 'text/csv',
        };
        const metadata = {
            prefix: type,
            tags: [type],
        };
        logger.info("Metadata", metadata);
        let filename = `nc-${type}-${from}-to-${to}.csv`;
        filename = filename.replace(/\//g, '');
        logger.info(`Starting stream for file ${filename}`);
        slackLogger.info(`Starting stream for file ${filename}`);
        const bucket = 'dummy-bucket-finance';
        const result = yield streamFileToGCS(requestOptions, bucket, filename, options, metadata);
        logger.info(result);
        slackLogger.info('Stream finished successfully.');
    }
    catch (err) {
        logger.error('TransactionsScraper Function Error', err);
        throw err;
    }
    return;
});
//# sourceMappingURL=transactionsScraper.js.map