import { __awaiter } from "tslib";
import { PubSub } from '@google-cloud/pubsub';
import { formatISO9075 } from 'date-fns';
import { streamFileToGCS } from '../helpers/streamFileToGCS';
import { logger } from '../utils/logger';
const destBucket = 'raw-report-images';
const loggingTopic = 'snowflake-logs';
const UPDATE_QUERY = 'UPDATE SCRAPER_LOGS SET STATUS = ?, RESULT_URL = ?, UPDATED_AT = ? WHERE MESSAGE_ID = ?';
export const downloadReportImage = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info(event);
    logger.info(context);
    const { eventId } = context;
    logger.info(eventId);
    const imageDataString = Buffer.from(event.data, 'base64').toString();
    const imageData = JSON.parse(imageDataString);
    const { committeeName, imageLink, reportYear, reportType, rowAmended } = imageData;
    const requestOptions = {
        method: 'GET',
        url: imageLink,
    };
    const options = {
        contentType: 'application/pdf'
    };
    const filename = `${reportYear}/${reportType}/${committeeName}${rowAmended === 'Y' ? '__amended' : ''}.pdf`;
    logger.info(`Streaming file from ${imageLink} to ${destBucket}`);
    const result = yield streamFileToGCS(requestOptions, destBucket, filename, options);
    logger.info(result);
    const queryArgs = [
        'Downloaded',
        `gs://${destBucket}/${filename}`,
        formatISO9075(Date.now()),
        eventId,
    ];
    const pubsub = new PubSub();
    const topic = pubsub.topic(loggingTopic);
    const snowflakeArgs = {
        sqlText: UPDATE_QUERY,
        binds: queryArgs,
    };
    const snowflakeArgsBuffer = Buffer.from(JSON.stringify(snowflakeArgs));
    yield topic.publish(snowflakeArgsBuffer);
});
//# sourceMappingURL=downloadReportImage.js.map