import request from 'request';
import path from 'path';
import moment from 'moment';

import { Storage } from '@google-cloud/storage';

import { logger } from '../utils';

export default async function streamFileToGCS (pubSubMessage, _context) {
  const decodedData = Buffer.from(pubSubMessage.data, 'base64').toString();
  const parsedData = JSON.parse(decodedData)

  const { url, bucketName } = parsedData;
  const fileName = moment().format('YYYY-MM-DD') + "-" + path.basename(url);
  const options = {}; 
  
  const storage = new Storage()
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(fileName)

  const fileWriteStream = file.createWriteStream(options)

  try {
    const result = await new Promise((resolve, reject) => {
      request(url)
        .on('response', (res) => {
          logger.info('Download started.', res.statusCode, res.headers['content-type'])
        })
        .pipe(fileWriteStream)
        .on('finish', () => {
          logger.info('Finished reading file')
          return resolve(file)
        })
        .on('error', (err) => reject(err))
    })

    return result
  } catch (err) {
    let message = 'Download Error:\n'
    message += err.message
    logger.error(message)

    return fileWriteStream.fileName
  }
};
