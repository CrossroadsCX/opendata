import { __awaiter } from "tslib";
import { logger, createSlackLogger } from '../utils/logger';
import { copyGCSFile } from '../helpers/copyGCSFile';
const destBucketName = 'campaign-finance-snowpipe';
const directory = 'staging';
export const transactionsSnowpipe = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slackLogger = yield createSlackLogger();
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
            fileName: `${directory}/${originFilename}`,
        };
        logger.info("Bucket Information", { originBucketName, originFilename });
        yield copyGCSFile(sourceFileInfo, destFileInfo);
        slackLogger.info(`${originFilename} stream finished`);
        return;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
    return;
});
//# sourceMappingURL=transactionsSnowpipe.js.map