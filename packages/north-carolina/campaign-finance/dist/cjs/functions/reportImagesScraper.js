"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportImagesScraper = void 0;
const tslib_1 = require("tslib");
const pubsub_1 = require("@google-cloud/pubsub");
const date_fns_1 = require("date-fns");
const puppeteer_1 = (0, tslib_1.__importDefault)(require("puppeteer"));
const snowflake_1 = require("..//utils/snowflake");
const logger_1 = require("../utils/logger");
const baseUrl = 'https://cf.ncsbe.gov';
const baseSearchUrl = 'https://cf.ncsbe.gov/CFDocLkup/DocumentResult/';
const topicName = 'report-image-requests';
const INSERT_QUERY = 'INSERT INTO SCRAPER_LOGS (MESSAGE_ID, IMAGE_URL, STATUS, COMMITTEE_NAME, REPORT_TYPE, AMENDED, REPORT_YEAR, UPDATED_AT, CREATED_AT) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
const getRowData = (row) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const committeeName = yield row.$eval('td[aria-describedby="gridDocumentResults_CommitteeName"]', (td) => td.innerText);
    const reportYear = yield row.$eval('td[aria-describedby="gridDocumentResults_ReportYear"]', (td) => td.innerText);
    const reportType = yield row.$eval('td[aria-describedby="gridDocumentResults_ReportType"]', (td) => td.innerText);
    const rowImage = yield row.$eval('td[aria-describedby="gridDocumentResults_ImageType"] a', (link) => {
        return {
            href: link.getAttribute('href'),
            text: link.innerText
        };
    });
    const rowData = yield row.$eval('td[aria-describedby="gridDocumentResults_DataType"] a', (link) => {
        return {
            href: link.getAttribute('href'),
            text: link.innerText,
        };
    });
    const rowAmended = yield row.$eval('td[aria-describedby="gridDocumentResults_IsAmendment"', (td) => td.innerText);
    const result = {
        committeeName,
        reportType,
        reportYear,
        rowAmended,
        rowImage,
        rowData,
    };
    return result;
});
const getRowsData = (rows) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    return yield Promise.all(rows.map((row) => getRowData(row)));
});
const reportImagesScraper = (message) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { attributes } = message;
    const { year, code } = attributes;
    logger_1.logger.info(`Pulling images for ${year} of type ${code}`);
    const browser = yield puppeteer_1.default.launch({ args: ['--no-sandbox'] });
    const page = yield browser.newPage();
    const documentsSearchUrl = `${baseSearchUrl}?year=${year}&reports='${code}'`;
    yield page.goto(documentsSearchUrl);
    const tableBody = yield page.$('#gridDocumentResults tbody');
    if (!tableBody) {
        throw new Error('Could not load table body');
    }
    const rows = yield tableBody.$$('tr');
    const rowData = yield getRowsData(rows);
    const rowsMissingData = rowData.filter((row) => {
        return !row.rowData.text;
    });
    yield browser.close();
    const results = rowsMissingData.map((rowInfo) => {
        return Object.assign(Object.assign({}, rowInfo), { imageLink: `${baseUrl}${rowInfo.rowImage.href}` });
    });
    const pubsub = new pubsub_1.PubSub();
    const batchPublisher = pubsub.topic(topicName, {
        batching: {
            maxMessages: 10,
            maxMilliseconds: 10000,
        }
    });
    const connection = yield (0, snowflake_1.getConnection)();
    const publishPromises = results.map((request) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
        const requestBuffer = Buffer.from(JSON.stringify(request));
        const messageId = yield batchPublisher.publish(requestBuffer);
        const queryArgs = [
            messageId,
            request.imageLink,
            'Pending',
            request.committeeName,
            request.reportType,
            request.rowAmended,
            request.reportYear,
            (0, date_fns_1.formatISO9075)(Date.now()),
            (0, date_fns_1.formatISO9075)(Date.now()),
        ];
        yield new Promise((resolve, reject) => {
            connection === null || connection === void 0 ? void 0 : connection.execute({
                sqlText: INSERT_QUERY,
                binds: queryArgs,
                complete: (err, stmt, rows) => {
                    if (err) {
                        logger_1.logger.error(err);
                        return reject(err);
                    }
                    logger_1.logger.info(`Message ${messageId} logged.`);
                    logger_1.logger.info(rows);
                    resolve(err);
                }
            });
        });
        logger_1.logger.info(`Message id ${messageId} published.`);
    }));
    yield Promise.all(publishPromises);
    yield (0, snowflake_1.closeConnection)();
    return results;
});
exports.reportImagesScraper = reportImagesScraper;
//# sourceMappingURL=reportImagesScraper.js.map