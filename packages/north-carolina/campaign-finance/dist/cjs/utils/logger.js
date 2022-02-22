"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlackLogger = exports.logger = void 0;
const tslib_1 = require("tslib");
const winston_1 = (0, tslib_1.__importDefault)(require("winston"));
const logging_winston_1 = require("@google-cloud/logging-winston");
const winston_slack_webhook_transport_1 = (0, tslib_1.__importDefault)(require("winston-slack-webhook-transport"));
const secrets_1 = require("../gcp/secrets");
const logger = winston_1.default.createLogger({
    format: winston_1.default.format.json(),
    transports: [
        new winston_1.default.transports.Console(),
        new logging_winston_1.LoggingWinston(),
    ]
});
exports.logger = logger;
const createSlackLogger = () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const slackLogger = winston_1.default.createLogger({
        format: winston_1.default.format.simple(),
        transports: [
            new winston_slack_webhook_transport_1.default({
                webhookUrl: yield (0, secrets_1.getSecret)('slack-webhook', 'open-campaign-finance')
            })
        ]
    });
    return slackLogger;
});
exports.createSlackLogger = createSlackLogger;
//# sourceMappingURL=logger.js.map