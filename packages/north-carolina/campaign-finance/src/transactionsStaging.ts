import type { Context } from '@google-cloud/functions-framework';
import { logger } from './logger';
import { streamFileToGCS } from '@crossroadscx/google-cloud';

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
  const { projectId } = process.env
  const massageAttributes = event.attributes;
  const originBucketName = massageAttributes.bucketId;
  const fileName = massageAttributes.objectId;
  const destBucketName = "staged-transactions";
  const options = { start: 'w'}
  logger.log('bucketName ' + originBucketName);
  logger.log('fileName ' + fileName);

  if(originBucketName && fileName){
    logger.log('Coping file to staged-transactions bucket');
    const url = 'https://console.cloud.google.com/storage/browser/_details/' + originBucketName + '/' +
      fileName + ';tab=live_object?project=' + projectId;
    try {
      await streamFileToGCS(url, destBucketName, fileName, options)
    } catch (err) {
      logger.error(err)
    }

    logger.log('File copied successfully');
  }
};
