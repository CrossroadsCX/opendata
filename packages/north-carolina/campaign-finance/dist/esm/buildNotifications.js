import { __awaiter } from "tslib";
import { logger, createSlackLogger } from './logger';
export const buildNotifications = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    const slackLogger = yield createSlackLogger();
    try {
        const { data } = event;
        const dataString = Buffer.from(data, 'base64').toString();
        const dataObject = JSON.parse(dataString);
        const { status, substitutions: { _GOOGLE_FUNCTION_TARGET } } = dataObject;
        slackLogger.info(`Cloud function built: ${_GOOGLE_FUNCTION_TARGET} :: ${status}`);
    }
    catch (err) {
        logger.error(err);
        slackLogger.error(err);
        throw err;
    }
    return;
});
//# sourceMappingURL=buildNotifications.js.map