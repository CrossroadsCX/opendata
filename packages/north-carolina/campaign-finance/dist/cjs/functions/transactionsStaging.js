"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsStaging = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../utils/logger");
const copyGCSFile_1 = require("../helpers/copyGCSFile");
const destBucketName = 'public-transactions';
const transactionsStaging = (event) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    try {
        const slackLogger = yield (0, logger_1.createSlackLogger)();
        const { data } = event;
        const stringDecoded = Buffer.from(data, 'base64').toString();
        const eventData = JSON.parse(stringDecoded);
        const { bucket: originBucketName, name: originFilename } = eventData;
        slackLogger.info(`Streaming ${originFilename} from ${originBucketName} to ${destBucketName}`);
        const sourceFileInfo = {
            bucketName: originBucketName,
            fileName: originFilename,
        };
        const destFileInfo = {
            bucketName: destBucketName,
            fileName: `${originFilename}`,
        };
        logger_1.logger.info("Bucket Information", { originBucketName, originFilename });
        yield (0, copyGCSFile_1.copyGCSFile)(sourceFileInfo, destFileInfo);
        slackLogger.info(`${originFilename} stream finished`);
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