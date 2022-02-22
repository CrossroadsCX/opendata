"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const puppeteer_1 = (0, tslib_1.__importDefault)(require("puppeteer"));
const ncsbeReportsSearchUrl = 'https://cf.ncsbe.gov/CFDocLkup/';
const main = () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({ args: ['--no-sandbox'] });
    const page = yield browser.newPage();
    yield page.goto(ncsbeReportsSearchUrl);
    const tableElement = yield page.$('#tblDocument');
    if (tableElement) {
        const elements = yield tableElement.$$('input');
        const elementValues = elements.map((el) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            return (yield el.getProperty('value')).jsonValue();
        }));
        const values = yield Promise.all(elementValues);
        console.log(values);
    }
});
main()
    .then(() => {
    console.log('Finished.');
    process.exit(0);
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=getReportCodes.js.map