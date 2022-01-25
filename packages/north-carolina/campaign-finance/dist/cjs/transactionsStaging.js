"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsStaging = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("./logger");
const streamFileToGCS_1 = require("./streamFileToGCS");
const transactionsStaging = (event, context) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    logger_1.logger.info({ event, context });
    const { projectId } = process.env;
    const massageAttributes = event.attributes;
    const originBucketName = massageAttributes.bucketId;
    const fileName = massageAttributes.objectId;
    const destBucketName = "staged-transactions";
    const options = { start: 'w' };
    logger_1.logger.info('bucketName ' + originBucketName);
    logger_1.logger.info('fileName ' + fileName);
    if (originBucketName && fileName) {
        logger_1.logger.info('Copying file to staged-transactions bucket');
        const url = 'https://console.cloud.google.com/storage/browser/_details/' + originBucketName + '/' +
            fileName + ';tab=live_object?project=' + projectId;
        try {
            yield (0, streamFileToGCS_1.streamFileToGCS)({ url }, destBucketName, fileName, options);
        }
        catch (err) {
            logger_1.logger.error(err);
            throw err;
        }
        logger_1.logger.info('File copied successfully');
    }
    else {
        logger_1.logger.error('Could not find bucket name or filename');
    }
    return;
});
exports.transactionsStaging = transactionsStaging;
//# sourceMappingURL=transactionsStaging.js.map