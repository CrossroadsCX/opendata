import { __awaiter } from "tslib";
import { logger } from './logger';
import { streamFileToGCS } from './streamFileToGCS';
export const transactionsStaging = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = process.env;
    const massageAttributes = event.attributes;
    const originBucketName = massageAttributes.bucketId;
    const fileName = massageAttributes.objectId;
    const destBucketName = "staged-transactions";
    const options = { start: 'w' };
    logger.log('bucketName ' + originBucketName);
    logger.log('fileName ' + fileName);
    if (originBucketName && fileName) {
        logger.log('Copying file to staged-transactions bucket');
        const url = 'https://console.cloud.google.com/storage/browser/_details/' + originBucketName + '/' +
            fileName + ';tab=live_object?project=' + projectId;
        try {
            yield streamFileToGCS({ url }, destBucketName, fileName, options);
        }
        catch (err) {
            logger.error(err);
        }
        logger.log('File copied successfully');
    }
});
//# sourceMappingURL=transactionsStaging.js.map