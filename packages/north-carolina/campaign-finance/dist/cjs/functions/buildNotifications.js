"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNotifications = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../utils/logger");
const buildNotifications = (event, context) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const slackLogger = yield (0, logger_1.createSlackLogger)();
    try {
        const { data } = event;
        const dataString = Buffer.from(data, 'base64').toString();
        const dataObject = JSON.parse(dataString);
        const { status, substitutions: { _GOOGLE_FUNCTION_TARGET } } = dataObject;
        slackLogger.info(`Cloud function built: ${_GOOGLE_FUNCTION_TARGET} :: ${status}`);
    }
    catch (err) {
        logger_1.logger.error(err);
        slackLogger.error(err);
        throw err;
    }
    return;
});
exports.buildNotifications = buildNotifications;
//# sourceMappingURL=buildNotifications.js.map