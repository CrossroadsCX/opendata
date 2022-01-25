import type { Context } from '@google-cloud/functions-framework';
import { logger } from './logger';
import { streamFileToGCS } from './streamFileToGCS';

export type PubSubAttributes = {
  bucketId: string,
  eventTime: string,
  eventType: string,
  notificationConfig: string,
  objectGeneration: string,
  objectId: string,
  payloadFormat: string
}
export type PubSubMessage = {
  data: string,
  attributes: PubSubAttributes,
  messageId: string,
  publishTime: string,
  orderingKey: string
}

export interface PubSubEventFunction {
  (data: PubSubMessage, context: Context): any
}

export const transactionsStaging: PubSubEventFunction = async (event, context) => {
  logger.info({ event, context })
  const { projectId } = process.env
  const massageAttributes = event.attributes;
  const originBucketName = massageAttributes.bucketId;
  const fileName = massageAttributes.objectId;
  const destBucketName = "staged-transactions";
  const options = { start: 'w'}
  logger.info('bucketName ' + originBucketName);
  logger.info('fileName ' + fileName);

  if(originBucketName && fileName){
    logger.info('Copying file to staged-transactions bucket');
    const url = 'https://console.cloud.google.com/storage/browser/_details/' + originBucketName + '/' +
      fileName + ';tab=live_object?project=' + projectId;
    try {
      await streamFileToGCS({ url }, destBucketName, fileName, options)
    } catch (err) {
      logger.error(err)
      throw err
    }

    logger.info('File copied successfully');
  } else {
    logger.error('Could not find bucket name or filename')
  }

  return
};
