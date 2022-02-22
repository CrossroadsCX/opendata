"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyGCSFile = void 0;
const tslib_1 = require("tslib");
const storage_1 = require("../gcp/storage");
const copyGCSFile = (sourceFileInfo, destFileInfo) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const sourceBucket = storage_1.storage.bucket(sourceFileInfo.bucketName);
    const sourceFile = sourceBucket.file(sourceFileInfo.fileName);
    const destBucket = storage_1.storage.bucket(destFileInfo.bucketName);
    const destFile = destBucket.file(destFileInfo.fileName);
    return new Promise((resolve, reject) => {
        sourceFile.createReadStream()
            .on('error', (err) => reject(err))
            .on('finish', () => resolve())
            .pipe(destFile.createWriteStream());
    });
});
exports.copyGCSFile = copyGCSFile;
//# sourceMappingURL=copyGCSFile.js.map