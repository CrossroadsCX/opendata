import { __awaiter } from "tslib";
import { logger } from './logger';
import { storage } from './storage';
const destBucketName = 'staged-transactions';
export const transactionsStaging = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = event;
        const stringDecoded = Buffer.from(data, 'base64').toString();
        const eventData = JSON.parse(stringDecoded);
        const { bucket: originBucketName, name: originFilename } = eventData;
        logger.info("Bucket Information", { originBucketName, originFilename });
        const sourceBucket = storage.bucket(originBucketName);
        const sourceFile = sourceBucket.file(originFilename);
        logger.info("Source file metadata", sourceFile.metadata);
        const destBucket = storage.bucket(destBucketName);
        const destFile = destBucket.file(originFilename);
        destFile.setMetadata(sourceFile.metadata);
        const streamPromise = new Promise((resolve, reject) => {
            sourceFile.createReadStream()
                .on('error', (err) => reject(err))
                .on('finish', () => resolve())
                .pipe(destFile.createWriteStream());
        });
        yield streamPromise;
        return;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
    return;
});
//# sourceMappingURL=transactionsStaging.js.map