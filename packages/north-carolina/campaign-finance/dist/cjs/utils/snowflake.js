"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConnection = exports.getConnection = void 0;
const tslib_1 = require("tslib");
const snowflake_sdk_1 = (0, tslib_1.__importDefault)(require("snowflake-sdk"));
const secrets_1 = require("../gcp/secrets");
const logger_1 = require("./logger");
let connection = null;
const getConnection = () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    if (connection)
        return connection;
    const snowflakeEncoded = yield (0, secrets_1.getSecret)('snowflake-creds', 'open-campaign-finance');
    const snowflakeDecodedString = Buffer.from(snowflakeEncoded, 'base64').toString();
    const snowflakeCreds = JSON.parse(snowflakeDecodedString);
    const { account, database, schema, username, role, password, warehouse, region, } = snowflakeCreds;
    const connectionObject = snowflake_sdk_1.default.createConnection({
        account,
        username,
        role,
        password,
        database,
        schema,
        warehouse,
        region,
    });
    connection = yield new Promise((resolve, reject) => {
        connectionObject.connect((err, conn) => {
            if (err) {
                logger_1.logger.error(err);
                reject(err);
            }
            else {
                logger_1.logger.info('Connected to snowflake');
                resolve(conn);
            }
        });
    });
    return connection;
});
exports.getConnection = getConnection;
const closeConnection = () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    if (!connection)
        return;
    yield new Promise((resolve, reject) => {
        connection === null || connection === void 0 ? void 0 : connection.destroy((err, conn) => {
            if (err) {
                logger_1.logger.error(err);
                reject(err);
            }
            else {
                logger_1.logger.info('Closed snowflake connection');
                connection = null;
                resolve(conn);
            }
        });
    });
});
exports.closeConnection = closeConnection;
//# sourceMappingURL=snowflake.js.map