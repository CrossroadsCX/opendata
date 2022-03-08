import { __awaiter } from "tslib";
import { PubSub } from '@google-cloud/pubsub';
import { formatISO9075 } from 'date-fns';
import puppeteer from 'puppeteer';
import { getUrlParam } from '../utils/getUrlParam';
import { logger } from '../utils/logger';
const { NODE_ENV } = process.env;
const baseUrl = 'https://cf.ncsbe.gov';
const baseSearchUrl = 'https://cf.ncsbe.gov/CFDocLkup/DocumentResult/';
const topicName = 'report-image-requests';
const logTopicName = 'snowflake-logs';
const INSERT_QUERY = 'INSERT INTO IMAGE_DOWNLOAD_REQUESTS (DID, IMAGE_URL, COMMITTEE_NAME, REPORT_TYPE, AMENDED, REPORT_YEAR, UPDATED_AT, CREATED_AT) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
const getRowData = (row) => __awaiter(void 0, void 0, void 0, function* () {
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
const getRowsData = (rows) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Promise.all(rows.map((row) => getRowData(row)));
});
export const reportImagesScraper = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const { attributes } = message;
    const { year, code } = attributes;
    logger.info(`Pulling images for ${year} of type ${code}`);
    const browser = yield puppeteer.launch({ args: ['--no-sandbox'] });
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
    logger.info(`Starting downloads for ${rowsMissingData.length} images.`);
    const results = rowsMissingData.map((rowInfo) => {
        const imageLink = `${baseUrl}${rowInfo.rowImage.href}`;
        const DID = getUrlParam(imageLink, 'DID');
        if (!DID)
            throw new Error(`Could not get DID for ${imageLink}`);
        return Object.assign(Object.assign({}, rowInfo), { imageLink,
            DID });
    });
    const pubsub = new PubSub();
    const downloadTopic = pubsub.topic(topicName);
    const loggingTopic = pubsub.topic(logTopicName);
    const publishPromises = results.map((request) => __awaiter(void 0, void 0, void 0, function* () {
        const requestBuffer = Buffer.from(JSON.stringify(request));
        yield downloadTopic.publish(requestBuffer);
        const queryArgs = [
            request.DID,
            request.imageLink,
            request.committeeName,
            request.reportType,
            request.rowAmended,
            request.reportYear,
            formatISO9075(Date.now()),
            formatISO9075(Date.now()),
        ];
        const snowflakeArgs = {
            sqlText: INSERT_QUERY,
            binds: queryArgs,
        };
        const snowflakeArgsBuffer = Buffer.from(JSON.stringify(snowflakeArgs));
        yield loggingTopic.publish(snowflakeArgsBuffer);
        return;
    }));
    yield Promise.all(publishPromises);
    logger.info(`Successfully published messages for ${publishPromises.length} download requests.`);
    return;
});
//# sourceMappingURL=reportImagesScraper.js.map