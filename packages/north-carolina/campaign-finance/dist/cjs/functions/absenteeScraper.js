"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.absenteeScraper = void 0;
const tslib_1 = require("tslib");
const sync_1 = require("csv-parse/sync");
const axios_1 = (0, tslib_1.__importDefault)(require("axios"));
const absenteeLink = 'https://s3.amazonaws.com/dl.ncsbe.gov/ENRS/2022_11_08/absentee_20221108.csv';
const absenteeScraper = () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const csvFile = yield axios_1.default.get(absenteeLink);
    const records = (0, sync_1.parse)(csvFile.data, {
        columns: true,
        skip_empty_lines: true,
    });
    return records;
});
exports.absenteeScraper = absenteeScraper;
//# sourceMappingURL=absenteeScraper.js.map