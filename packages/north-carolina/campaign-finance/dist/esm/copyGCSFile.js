import { __awaiter } from "tslib";
import { storage } from './storage';
export const copyGCSFile = (sourceFileInfo, destFileInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const sourceBucket = storage.bucket(sourceFileInfo.bucketName);
    const sourceFile = sourceBucket.file(sourceFileInfo.fileName);
    const destBucket = storage.bucket(destFileInfo.bucketName);
    const destFile = destBucket.file(destFileInfo.fileName);
    return new Promise((resolve, reject) => {
        sourceFile.createReadStream()
            .on('error', (err) => reject(err))
            .on('finish', () => resolve())
            .pipe(destFile.createWriteStream());
    });
});
//# sourceMappingURL=copyGCSFile.js.map