"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logToSnowflake = void 0;
const tslib_1 = require("tslib");
const snowflake_1 = require("../utils/snowflake");
const logger_1 = require("../utils/logger");
const logToSnowflake = (message) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const inputString = Buffer.from(message.data, 'base64').toString();
    const { sqlText, binds } = JSON.parse(inputString);
    const connection = yield (0, snowflake_1.getConnection)();
    const rows = yield new Promise((resolve, reject) => {
        connection === null || connection === void 0 ? void 0 : connection.execute({
            sqlText,
            binds,
            complete: (err, stmt, rows) => {
                if (err) {
                    logger_1.logger.error(err);
                    return reject(err);
                }
                resolve(rows);
            }
        });
    });
    yield (0, snowflake_1.closeConnection)();
    return rows;
});
exports.logToSnowflake = logToSnowflake;
//# sourceMappingURL=logToSnowflake.js.map