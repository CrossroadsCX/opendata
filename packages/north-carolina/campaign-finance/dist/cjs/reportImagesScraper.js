"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportImagesScraper = void 0;
const tslib_1 = require("tslib");
const puppeteer_1 = (0, tslib_1.__importDefault)(require("puppeteer"));
const logger_1 = require("./logger");
const baseUrl = 'https://cf.ncsbe.gov';
const baseSearchUrl = 'https://cf.ncsbe.gov/CFDocLkup/DocumentResult/';
const bucketName = 'raw-report-images';
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
    const result = {
        committeeName,
        reportType,
        reportYear,
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
    return results;
});
exports.reportImagesScraper = reportImagesScraper;
//# sourceMappingURL=reportImagesScraper.js.map