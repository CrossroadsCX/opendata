"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsStaging = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("./logger");
const storage_1 = require("./storage");
const destBucketName = 'staged-transactions';
const transactionsStaging = (event) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    try {
        const { data } = event;
        const stringDecoded = Buffer.from(data, 'base64').toString();
        const eventData = JSON.parse(stringDecoded);
        const { bucket: originBucketName, name: originFilename } = eventData;
        logger_1.logger.info("Bucket Information", { originBucketName, originFilename });
        const sourceBucket = storage_1.storage.bucket(originBucketName);
        const sourceFile = sourceBucket.file(originFilename);
        logger_1.logger.info("Source file metadata", sourceFile.metadata);
        const destBucket = storage_1.storage.bucket(destBucketName);
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
        logger_1.logger.error(err);
        throw err;
    }
    return;
});
exports.transactionsStaging = transactionsStaging;
//# sourceMappingURL=transactionsStaging.js.map