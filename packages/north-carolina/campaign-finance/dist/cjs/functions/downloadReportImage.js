"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadReportImage = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../utils/logger");
const destBucket = 'raw-report-images';
const downloadReportImage = (event, context) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    logger_1.logger.info(event);
    logger_1.logger.info(context);
    const imageDataString = Buffer.from(event.data, 'base64').toString();
    const imageData = JSON.parse(imageDataString);
    const { imageLink } = imageData;
    logger_1.logger.info(imageLink);
});
exports.downloadReportImage = downloadReportImage;
//# sourceMappingURL=downloadReportImage.js.map