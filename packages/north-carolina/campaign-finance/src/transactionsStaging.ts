import type { CloudFunctionsContext, LegacyEvent, Context } from '@google-cloud/functions-framework';
import { logger } from './logger';
import { streamFileToGCS } from './streamFileToGCS';
import { storage } from './storage'

export type PubSubAttributes = {
  bucketId: string;
  eventTime: string;
  eventType: string;
  notificationConfig: string;
  objectGeneration: string;
  objectId: string;
  payloadFormat: string;
}

export type StorageBackgroundEventData = {
  kind: string;
  id: string;
  selfLink: string;
  name: string;
  bucket: string;
  generation: string;
  metageneration: string;
  contentType: string;
  timeCreated: string;
  updated: string;
  storageClass: string;
  timeStorageClassUpdated: string;
  size: string;
  md5Hash: string;
  mediaLink: string;
  crc32c: string;
  etag: string;
}

export type PubSubMessage = {
  data: string;
  attributes: PubSubAttributes;
  messageId: string;
  publishTime: string;
  orderingKey: string;
}

export interface PubSubEventFunction {
  (event: PubSubMessage, context: Context): any
}

const destBucketName = 'staged-transactions'

export const transactionsStaging: PubSubEventFunction = async (event /*, context */) => {
  try {
    const { data } = event
    const stringDecoded = Buffer.from(data, 'base64').toString()
    const eventData: StorageBackgroundEventData = JSON.parse(stringDecoded)

    const {
      bucket: originBucketName,
      name: originFilename
    } = eventData

    logger.info("Bucket Information", { originBucketName, originFilename })

    const sourceBucket = storage.bucket(originBucketName)
    const sourceFile = sourceBucket.file(originFilename)

    logger.info("Source file metadata", sourceFile.metadata)

    const destBucket = storage.bucket(destBucketName)
    const destFile = destBucket.file(originFilename)
    destFile.setMetadata(sourceFile.metadata)

    const streamPromise = new Promise<void>((resolve, reject) => {
      sourceFile.createReadStream()
        .on('error', (err) => reject(err))
        .on('finish', () => resolve())
        .pipe(destFile.createWriteStream())
    })

    await streamPromise
    // await sourceFile.delete()

    return
  } catch (err) {
    logger.error(err)
    throw err
  }

  return
};
