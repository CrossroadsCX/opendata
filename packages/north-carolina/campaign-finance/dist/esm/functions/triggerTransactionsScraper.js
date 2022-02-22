import { __awaiter } from "tslib";
import { PubSub } from '@google-cloud/pubsub';
import { addDays, endOfQuarter, format, parse, startOfQuarter } from 'date-fns';
import { logger } from '../utils/logger';
const topicName = 'scrape-transactions';
export const triggerTransactionsScraper = ({ attributes: { year } }) => {
    try {
        const pubsub = new PubSub();
        logger.info(year);
        const Jan1 = parse(`01/01/${year}`, 'MM/dd/yyyy', new Date());
        const Q1Start = startOfQuarter(Jan1);
        const Q1End = endOfQuarter(Jan1);
        const Q2Reference = addDays(Q1End, 1);
        const Q2Start = startOfQuarter(Q2Reference);
        const Q2End = endOfQuarter(Q2Reference);
        const Q3Reference = addDays(Q2End, 1);
        const Q3Start = startOfQuarter(Q3Reference);
        const Q3End = endOfQuarter(Q3Reference);
        const Q4Reference = addDays(Q3End, 1);
        const Q4Start = startOfQuarter(Q4Reference);
        const Q4End = endOfQuarter(Q4Reference);
        const requests = [
            {
                from: format(Q1Start, 'MM/dd/yyyy'),
                to: format(Q1End, 'MM/dd/yyyy'),
                type: 'rec',
            },
            {
                from: format(Q1Start, 'MM/dd/yyyy'),
                to: format(Q1End, 'MM/dd/yyyy'),
                type: 'exp',
            },
            {
                from: format(Q2Start, 'MM/dd/yyyy'),
                to: format(Q2End, 'MM/dd/yyyy'),
                type: 'rec',
            },
            {
                from: format(Q2Start, 'MM/dd/yyyy'),
                to: format(Q2End, 'MM/dd/yyyy'),
                type: 'exp',
            },
            {
                from: format(Q3Start, 'MM/dd/yyyy'),
                to: format(Q3End, 'MM/dd/yyyy'),
                type: 'rec',
            },
            {
                from: format(Q3Start, 'MM/dd/yyyy'),
                to: format(Q3End, 'MM/dd/yyyy'),
                type: 'exp',
            },
            {
                from: format(Q4Start, 'MM/dd/yyyy'),
                to: format(Q4End, 'MM/dd/yyyy'),
                type: 'rec',
            },
            {
                from: format(Q4Start, 'MM/dd/yyyy'),
                to: format(Q4End, 'MM/dd/yyyy'),
                type: 'exp',
            },
        ];
        const batchPublisher = pubsub.topic(topicName, {
            batching: {
                maxMessages: 10,
                maxMilliseconds: 10000,
            }
        });
        requests.forEach((request) => __awaiter(void 0, void 0, void 0, function* () {
            const messageId = yield batchPublisher.publish(Buffer.from(''), request);
            logger.info(`Message id ${messageId} published.`);
        }));
        return `Running batches for ${requests.length} requests`;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
};
//# sourceMappingURL=triggerTransactionsScraper.js.map