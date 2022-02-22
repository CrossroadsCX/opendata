import { __awaiter } from "tslib";
import snowflake from 'snowflake-sdk';
import { getSecret } from "../gcp/secrets";
import { logger } from './logger';
let connection = null;
export const getConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (connection)
        return connection;
    const snowflakeEncoded = yield getSecret('snowflake-creds', 'open-campaign-finance');
    const snowflakeDecodedString = Buffer.from(snowflakeEncoded, 'base64').toString();
    const snowflakeCreds = JSON.parse(snowflakeDecodedString);
    const { account, database, schema, username, role, password, warehouse, region, } = snowflakeCreds;
    const connectionObject = snowflake.createConnection({
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
                logger.error(err);
                reject(err);
            }
            else {
                logger.info('Connected to snowflake');
                resolve(conn);
            }
        });
    });
    return connection;
});
export const closeConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!connection)
        return;
    yield new Promise((resolve, reject) => {
        connection === null || connection === void 0 ? void 0 : connection.destroy((err, conn) => {
            if (err) {
                logger.error(err);
                reject(err);
            }
            else {
                logger.info('Closed snowflake connection');
                connection = null;
                resolve(conn);
            }
        });
    });
});
//# sourceMappingURL=snowflake.js.map