"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadReportImage = void 0;
const tslib_1 = require("tslib");
const streamFileToGCS_1 = require("../helpers/streamFileToGCS");
const logger_1 = require("../utils/logger");
const destBucket = 'raw-report-images';
const downloadReportImage = (event, context) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    logger_1.logger.info(event);
    logger_1.logger.info(context);
    const { eventId } = context;
    logger_1.logger.info(eventId);
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
    logger_1.logger.info(`Streaming file from ${imageLink} to ${destBucket}`);
    const result = yield (0, streamFileToGCS_1.streamFileToGCS)(requestOptions, destBucket, filename, options);
    logger_1.logger.info(result);
});
exports.downloadReportImage = downloadReportImage;
//# sourceMappingURL=downloadReportImage.js.map