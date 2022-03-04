import axios from 'axios'
import { types } from 'util'

import { logger } from '../utils/logger'
import { storage } from '../gcp/storage'

const { isNativeError } = types

type FileOptions = {
  contentType: string;
}

export const streamFileToGCS = async (
  requestOptions: Record<string, unknown>,
  bucketName: string,
  filename: string,
  options: FileOptions,
  metadata: Record<string, unknown> = {}
) => {
  try {
    const bucket = storage.bucket(bucketName)
    const file = bucket.file(filename)
    // file.setMetadata({ metadata })
    // logger.info('Inside streamFileToGCS')
    const fileWriteStream = file.createWriteStream(options)

    const result = await axios( {  responseType: 'stream', ...requestOptions })
      .then((response) => {
        return new Promise((resolve, reject) => {
          response.data.pipe(fileWriteStream)
          let error: Error | null = null
          // logger.info('Piping data results from stream function.')

          fileWriteStream.on('error', (err) => {
            error = err
            logger.error('Error in file write stream', error)
            fileWriteStream.end()
            reject(err)
          })

          fileWriteStream.on('finish', () => {
            logger.info('File stream finished.')
            fileWriteStream.end()
            return resolve(true)
          })
        })
      })

    // logger.info("Result", result)
  } catch (err: unknown) {
    if (isNativeError(err)) {
      logger.error('Download Error:', err.message)
      logger.error(err.stack)
    } else {
      logger.error('Unknown Error', err)
    }

    throw err
  }

  // logger.info('End of stream function reached.')
  return
}
