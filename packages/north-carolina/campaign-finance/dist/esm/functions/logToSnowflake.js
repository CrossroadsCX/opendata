import { __awaiter } from "tslib";
import { closeConnection, getConnection } from '../utils/snowflake';
import { logger } from '../utils/logger';
export const logToSnowflake = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const inputString = Buffer.from(message.data, 'base64').toString();
    const { sqlText, binds } = JSON.parse(inputString);
    const connection = yield getConnection();
    const rows = yield new Promise((resolve, reject) => {
        connection === null || connection === void 0 ? void 0 : connection.execute({
            sqlText,
            binds,
            complete: (err, stmt, rows) => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                }
                resolve(rows);
            }
        });
    });
    yield closeConnection();
    return rows;
});
//# sourceMappingURL=logToSnowflake.js.map