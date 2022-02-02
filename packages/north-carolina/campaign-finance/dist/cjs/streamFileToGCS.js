"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamFileToGCS = void 0;
const tslib_1 = require("tslib");
const axios_1 = (0, tslib_1.__importDefault)(require("axios"));
const util_1 = require("util");
const logger_1 = require("./logger");
const storage_1 = require("./storage");
const { isNativeError } = util_1.types;
const streamFileToGCS = (requestOptions, bucketName, filename, options, metadata = {}) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    try {
        const bucket = storage_1.storage.bucket(bucketName);
        const file = bucket.file(filename);
        const fileWriteStream = file.createWriteStream(options);
        const result = yield (0, axios_1.default)(Object.assign({ responseType: 'stream' }, requestOptions))
            .then((response) => {
            return new Promise((resolve, reject) => {
                response.data.pipe(fileWriteStream);
                let error = null;
                fileWriteStream.on('error', (err) => {
                    error = err;
                    logger_1.logger.error('Error in file write stream', error);
                    fileWriteStream.end();
                    reject(err);
                });
                fileWriteStream.on('finish', () => {
                    logger_1.logger.info('File stream finished.');
                    fileWriteStream.end();
                    return resolve(true);
                });
            });
        });
    }
    catch (err) {
        if (isNativeError(err)) {
            logger_1.logger.error('Download Error', err);
        }
        else {
            logger_1.logger.error('Unknown Error', err);
        }
        throw err;
        return;
    }
    return;
});
exports.streamFileToGCS = streamFileToGCS;
//# sourceMappingURL=streamFileToGCS.js.map