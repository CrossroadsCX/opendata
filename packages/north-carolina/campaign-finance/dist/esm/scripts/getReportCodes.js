import { __awaiter } from "tslib";
import puppeteer from 'puppeteer';
const ncsbeReportsSearchUrl = 'https://cf.ncsbe.gov/CFDocLkup/';
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer.launch({ args: ['--no-sandbox'] });
    const page = yield browser.newPage();
    yield page.goto(ncsbeReportsSearchUrl);
    const tableElement = yield page.$('#tblDocument');
    if (tableElement) {
        const elements = yield tableElement.$$('input');
        const elementValues = elements.map((el) => __awaiter(void 0, void 0, void 0, function* () {
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