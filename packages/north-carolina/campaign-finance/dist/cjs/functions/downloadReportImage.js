"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadReportImage = void 0;
const tslib_1 = require("tslib");
const pubsub_1 = require("@google-cloud/pubsub");
const date_fns_1 = require("date-fns");
const streamFileToGCS_1 = require("../helpers/streamFileToGCS");
const logger_1 = require("../utils/logger");
const destBucket = 'raw-report-images';
const loggingTopic = 'snowflake-logs';
const UPDATE_QUERY = 'INSERT INTO IMAGE_DOWNLOAD_LOGS (DID, RESULT_URL, UPDATED_AT) VALUES (?, ?, ?)';
const downloadReportImage = (event) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
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
    logger_1.logger.info(`Streaming file from ${imageLink} to ${destBucket}`);
    const result = yield (0, streamFileToGCS_1.streamFileToGCS)(requestOptions, destBucket, filename, options);
    const queryArgs = [
        DID,
        `gs://${destBucket}/${filename}`,
        (0, date_fns_1.formatISO9075)(Date.now())
    ];
    const pubsub = new pubsub_1.PubSub();
    const topic = pubsub.topic(loggingTopic);
    const snowflakeArgs = {
        sqlText: UPDATE_QUERY,
        binds: queryArgs,
    };
    const snowflakeArgsBuffer = Buffer.from(JSON.stringify(snowflakeArgs));
    yield topic.publish(snowflakeArgsBuffer);
});
exports.downloadReportImage = downloadReportImage;
//# sourceMappingURL=downloadReportImage.js.map