import request from 'request';
import path from 'path';
import logger from '../utils';

import { Storage } from '@google-cloud/storage';

export default async function streamFileToGCS (
  url, // : any,
  bucketName, //: string,
  fileName = '', //: string,
  options = {}, //: any = {},
) {
  if (fileName == '') {
    fileName = path.basename(url);
  }
  
  const storage = new Storage()
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(fileName)

  const fileWriteStream = file.createWriteStream(options)

  try {
    const result = await new Promise((resolve, reject) => {
      request(url)
        .on('response', (res) => {
          logger.log('Download started.', res.statusCode, res.headers['content-type'])
        })
        .pipe(fileWriteStream)
        .on('finish', () => {
          logger.log('Finished reading file')
          return resolve(file)
        })
        .on('error', (err) => reject(err))
    })

    return result
  } catch (err) {
    let message = 'Download Error:\n'
    message += err.message
    logger.error(message)

    return message
  }
};
