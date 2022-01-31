"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerTransactionsScraper = void 0;
const tslib_1 = require("tslib");
const pubsub_1 = require("@google-cloud/pubsub");
const logger_1 = require("./logger");
const topicName = 'scrape-transactions';
const requests = [
    {
        from: '01/01/2021',
        to: '01/31/2021',
        type: 'rec'
    },
    {
        from: '01/01/2021',
        to: '01/30/2021',
        type: 'exp'
    },
    {
        from: '02/01/2021',
        to: '02/28/2021',
        type: 'rec'
    },
    {
        from: '02/01/2021',
        to: '02/28/2021',
        type: 'exp'
    },
];
const triggerTransactionsScraper = () => {
    try {
        const pubsub = new pubsub_1.PubSub();
        const batchPublisher = pubsub.topic(topicName, {
            batching: {
                maxMessages: 10,
                maxMilliseconds: 10000,
            }
        });
        requests.forEach((request) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
            const messageId = yield batchPublisher.publish(Buffer.from(''), request);
            logger_1.logger.info(`Message id ${messageId} published.`);
        }));
    }
    catch (err) {
        logger_1.logger.error(err);
        throw err;
    }
};
exports.triggerTransactionsScraper = triggerTransactionsScraper;
//# sourceMappingURL=triggerTransactionsScraper.js.map