import { logger } from './logger'
import { storage } from './storage'

export type GCSFileInfo = {
  bucketName: string;
  fileName: string;
}

export const copyGCSFile = async (sourceFileInfo: GCSFileInfo, destFileInfo: GCSFileInfo) => {
  const sourceBucket = storage.bucket(sourceFileInfo.bucketName)
  const sourceFile = sourceBucket.file(sourceFileInfo.fileName)

  const destBucket = storage.bucket(destFileInfo.bucketName)
  const destFile = destBucket.file(destFileInfo.fileName)

  return new Promise<void>((resolve, reject) => {
    sourceFile.createReadStream()
        .on('error', (err) => reject(err))
        .on('finish', () => resolve())
        .pipe(destFile.createWriteStream())
  })
}
