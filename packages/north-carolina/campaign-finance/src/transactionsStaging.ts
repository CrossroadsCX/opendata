import type { CloudFunctionsContext, LegacyEvent, Context } from '@google-cloud/functions-framework';
import { logger, createSlackLogger } from './logger';
import { streamFileToGCS } from './streamFileToGCS';
import { storage } from './storage'
import { copyGCSFile } from './copyGCSFile'

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

const destBucketName = 'campaign-finance-snowpipe'
const directory = 'staging'

export const transactionsStaging: PubSubEventFunction = async (event /*, context */) => {
  try {
    const slackLogger = await createSlackLogger()
    const { data } = event
    const stringDecoded = Buffer.from(data, 'base64').toString()
    const eventData: StorageBackgroundEventData = JSON.parse(stringDecoded)

    const {
      bucket: originBucketName,
      name: originFilename
    } = eventData

    slackLogger.info(`Streaming ${originFilename} from ${originBucketName} to ${destBucketName}`);

    const sourceFileInfo = {
      bucketName: originBucketName,
      fileName: originFilename,
    }

    const destFileInfo = {
      bucketName: destBucketName,
      fileName: `${directory}/${originFilename}`,
    }

    logger.info("Bucket Information", { originBucketName, originFilename })

    await copyGCSFile(sourceFileInfo, destFileInfo)

    slackLogger.info(`${originFilename} stream finished`)

    return
  } catch (err) {
    logger.error(err)
    throw err
  }

  return
};
