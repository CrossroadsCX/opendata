import { logger } from '@crossroadscx/utils';
import { streamFileToGCS } from '@crossroadscx/google-cloud/src/streamFileToGCS'
import { CloudEventFunction, CloudEventsContext } from '@google-cloud/functions-framework';

export const transactionsStaging = (event: CloudEventFunction, context: CloudEventsContext) => {
  const { projectId } = process.env
  const massageAttributes = event.arguments.attributes;
  const originBucketName = massageAttributes.bucketId;
  const fileName = massageAttributes.objectId;
  const destBucketName = "staged-transactions";
  const options = { start: 'w'}
  console.log('bucketName ' + originBucketName);
  logger.log('fileName ' + fileName);

  if(originBucketName && fileName){
    logger.log('Coping file to staged-transactions bucket');
    const url = 'https://console.cloud.google.com/storage/browser/_details/' + originBucketName + '/' + 
      fileName + ';tab=live_object?project=' + projectId;
    streamFileToGCS(url, destBucketName, fileName, options)
    logger.log('File copied successfully');
  }
  
};