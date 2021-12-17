import { logger } from '@crossroadscx/utils';
import { streamFileToGCS } from './streamFileToGCS'

export const transactionsStaging = (event, context) => {
  const { projectId } = process.env
  const massageAttributes = event.attributes;
  const originBucketName = massageAttributes.bucketId;
  const fileName = massageAttributes.objectId;
  const destBucketName = "staged-transactions";
  console.log('bucketName ' + originBucketName);
  logger.log('fileName ' + fileName);

  if(originBucketName && fileName){
    logger.log('Coping file to staged-transactions bucket');
    // storage.bucket(originBucketName).file(fileName).copy(storage.bucket('staged-transactions'));
    const url = 'https://console.cloud.google.com/storage/browser/_details/' + originBucketName + '/' + 
      fileName + ';tab=live_object?project=' + projectId;
    streamFileToGCS(url, destBucketName, fileName, null)
    logger.log('File copied successfully');
  }
  
};