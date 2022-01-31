"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerTransactionsScraper = void 0;
const tslib_1 = require("tslib");
const pubsub_1 = require("@google-cloud/pubsub");
const date_fns_1 = require("date-fns");
const logger_1 = require("./logger");
const topicName = 'scrape-transactions';
const triggerTransactionsScraper = ({ attributes: { year } }) => {
    try {
        const pubsub = new pubsub_1.PubSub();
        logger_1.logger.info(year);
        const Jan1 = (0, date_fns_1.parse)(`01/01/${year}`, 'MM/dd/yyyy', new Date());
        const Q1Start = (0, date_fns_1.startOfQuarter)(Jan1);
        const Q1End = (0, date_fns_1.endOfQuarter)(Jan1);
        const Q2Reference = (0, date_fns_1.addDays)(Q1End, 1);
        const Q2Start = (0, date_fns_1.startOfQuarter)(Q2Reference);
        const Q2End = (0, date_fns_1.endOfQuarter)(Q2Reference);
        const Q3Reference = (0, date_fns_1.addDays)(Q2End, 1);
        const Q3Start = (0, date_fns_1.startOfQuarter)(Q3Reference);
        const Q3End = (0, date_fns_1.endOfQuarter)(Q3Reference);
        const Q4Reference = (0, date_fns_1.addDays)(Q3End, 1);
        const Q4Start = (0, date_fns_1.startOfQuarter)(Q4Reference);
        const Q4End = (0, date_fns_1.endOfQuarter)(Q4Reference);
        const requests = [
            {
                from: (0, date_fns_1.format)(Q1Start, 'MM/dd/yyyy'),
                to: (0, date_fns_1.format)(Q1End, 'MM/dd/yyyy'),
                type: 'rec',
            },
            {
                from: (0, date_fns_1.format)(Q1Start, 'MM/dd/yyyy'),
                to: (0, date_fns_1.format)(Q1End, 'MM/dd/yyyy'),
                type: 'exp',
            },
            {
                from: (0, date_fns_1.format)(Q2Start, 'MM/dd/yyyy'),
                to: (0, date_fns_1.format)(Q2End, 'MM/dd/yyyy'),
                type: 'rec',
            },
            {
                from: (0, date_fns_1.format)(Q2Start, 'MM/dd/yyyy'),
                to: (0, date_fns_1.format)(Q2End, 'MM/dd/yyyy'),
                type: 'exp',
            },
            {
                from: (0, date_fns_1.format)(Q3Start, 'MM/dd/yyyy'),
                to: (0, date_fns_1.format)(Q3End, 'MM/dd/yyyy'),
                type: 'rec',
            },
            {
                from: (0, date_fns_1.format)(Q3Start, 'MM/dd/yyyy'),
                to: (0, date_fns_1.format)(Q3End, 'MM/dd/yyyy'),
                type: 'exp',
            },
            {
                from: (0, date_fns_1.format)(Q4Start, 'MM/dd/yyyy'),
                to: (0, date_fns_1.format)(Q4End, 'MM/dd/yyyy'),
                type: 'rec',
            },
            {
                from: (0, date_fns_1.format)(Q4Start, 'MM/dd/yyyy'),
                to: (0, date_fns_1.format)(Q4End, 'MM/dd/yyyy'),
                type: 'exp',
            },
        ];
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