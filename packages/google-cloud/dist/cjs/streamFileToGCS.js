"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamFileToGCS = void 0;
const axios_1 = require("axios");
const storage_1 = require("./storage");
const utils_1 = require("@crossroadscx/utils");
const streamFileToGCS = (url, bucketName, filename, options) => __awaiter(void 0, void 0, void 0, function* () {
    const bucket = storage_1.storage.bucket(bucketName);
    const file = bucket.file(filename);
    const fileWriteStream = file.createWriteStream(options);
    try {
        const result = yield (0, axios_1.default)(url, { responseType: 'stream' })
            .then((response) => {
            return new Promise((resolve, reject) => {
                response.data.pipe(fileWriteStream);
                let error = null;
                fileWriteStream.on('error', (err) => {
                    error = err;
                    fileWriteStream.end();
                    reject(err);
                });
                fileWriteStream.on('close', () => {
                    if (!error) {
                        resolve(true);
                    }
                });
            });
        });
    }
    catch (err) {
        let message = 'Download Error: \n';
        message += err.message;
        utils_1.logger.error(message);
        return;
    }
});
exports.streamFileToGCS = streamFileToGCS;
