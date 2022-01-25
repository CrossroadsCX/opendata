import { __awaiter } from "tslib";
import axios from 'axios';
import { types } from 'util';
import { logger } from './logger';
import { storage } from './storage';
const { isNativeError } = types;
export const streamFileToGCS = (requestOptions, bucketName, filename, options, metadata = {}) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(filename);
        logger.info('Inside streamFileToGCS');
        const fileWriteStream = file.createWriteStream(options);
        const result = yield axios(Object.assign({ responseType: 'stream' }, requestOptions))
            .then((response) => {
            return new Promise((resolve, reject) => {
                response.data.pipe(fileWriteStream);
                let error = null;
                logger.info('Piping data results from stream function.');
                fileWriteStream.on('error', (err) => {
                    error = err;
                    logger.error('Error in file write stream', error);
                    fileWriteStream.end();
                    reject(err);
                });
                fileWriteStream.on('finish', () => {
                    logger.info('File stream finished.');
                    fileWriteStream.end();
                    return resolve(true);
                });
            });
        });
        logger.info("Result", result);
    }
    catch (err) {
        if (isNativeError(err)) {
            logger.error('Download Error', err);
        }
        else {
            logger.error('Unknown Error', err);
        }
        throw err;
        return;
    }
    logger.info('End of stream function reached.');
    return;
});
//# sourceMappingURL=streamFileToGCS.js.map