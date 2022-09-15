import { __awaiter } from "tslib";
import { parse } from 'csv-parse/sync';
import axios from 'axios';
const absenteeLink = 'https://s3.amazonaws.com/dl.ncsbe.gov/ENRS/2022_11_08/absentee_20221108.csv';
export const absenteeScraper = () => __awaiter(void 0, void 0, void 0, function* () {
    const csvFile = yield axios.get(absenteeLink);
    const records = parse(csvFile.data, {
        columns: true,
        skip_empty_lines: true,
    });
    return records;
});
//# sourceMappingURL=absenteeScraper.js.map