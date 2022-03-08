import { __awaiter } from "tslib";
import { PubSub } from '@google-cloud/pubsub';
import { formatISO9075 } from 'date-fns';
import { streamFileToGCS } from '../helpers/streamFileToGCS';
import { logger } from '../utils/logger';
const destBucket = 'raw-report-images';
const loggingTopic = 'snowflake-logs';
const UPDATE_QUERY = 'INSERT INTO IMAGE_DOWNLOAD_LOGS (DID, RESULT_URL, UPDATED_AT) VALUES (?, ?, ?)';
export const downloadReportImage = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const imageDataString = Buffer.from(event.data, 'base64').toString();
    const imageData = JSON.parse(imageDataString);
    const { DID, committeeName, imageLink, reportYear, reportType, rowAmended } = imageData;
    const requestOptions = {
        method: 'GET',
        url: imageLink,
    };
    const options = {
        contentType: 'application/pdf'
    };
    const filename = `${reportYear}/${reportType}/${DID}__${committeeName.replace('/', '-')}${rowAmended === 'Y' ? '__amended' : ''}.pdf`;
    logger.info(`Streaming file from ${imageLink} to ${destBucket}`);
    const result = yield streamFileToGCS(requestOptions, destBucket, filename, options);
    const queryArgs = [
        DID,
        `gs://${destBucket}/${filename}`,
        formatISO9075(Date.now())
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