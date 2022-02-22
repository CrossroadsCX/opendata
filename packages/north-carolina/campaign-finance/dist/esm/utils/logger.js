import { __awaiter } from "tslib";
import winston from 'winston';
import { LoggingWinston as GCPLogging } from '@google-cloud/logging-winston';
import SlackTransport from 'winston-slack-webhook-transport';
import { getSecret } from '../gcp/secrets';
const webhookUrl = getSecret('slack-webhook', 'open-campaign-finance');
const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new GCPLogging(),
    ]
});
const createSlackLogger = () => __awaiter(void 0, void 0, void 0, function* () {
    const slackLogger = winston.createLogger({
        format: winston.format.simple(),
        transports: [
            new SlackTransport({
                webhookUrl: yield getSecret('slack-webhook', 'open-campaign-finance')
            })
        ]
    });
    return slackLogger;
});
export { logger, createSlackLogger };
//# sourceMappingURL=logger.js.map