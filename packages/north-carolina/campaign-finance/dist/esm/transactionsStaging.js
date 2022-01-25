import { __awaiter } from "tslib";
import { logger } from './logger';
import { streamFileToGCS } from './streamFileToGCS';
export const transactionsStaging = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info({ event, context });
    const { projectId } = process.env;
    const massageAttributes = event.attributes;
    const originBucketName = massageAttributes.bucketId;
    const fileName = massageAttributes.objectId;
    const destBucketName = "staged-transactions";
    const options = { start: 'w' };
    logger.info('bucketName ' + originBucketName);
    logger.info('fileName ' + fileName);
    if (originBucketName && fileName) {
        logger.info('Copying file to staged-transactions bucket');
        const url = 'https://console.cloud.google.com/storage/browser/_details/' + originBucketName + '/' +
            fileName + ';tab=live_object?project=' + projectId;
        try {
            yield streamFileToGCS({ url }, destBucketName, fileName, options);
        }
        catch (err) {
            logger.error(err);
            throw err;
        }
        logger.info('File copied successfully');
    }
    else {
        logger.error('Could not find bucket name or filename');
    }
    return;
});
//# sourceMappingURL=transactionsStaging.js.map