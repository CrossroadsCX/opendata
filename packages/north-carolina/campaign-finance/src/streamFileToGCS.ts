import axios from 'axios'
import { types } from 'util'

import { logger } from './logger'
import { storage } from './storage'

const { isNativeError } = types

export const streamFileToGCS = async (
  requestOptions: Record<string, unknown>,
  bucketName: string,
  filename: string,
  options: Record<string, unknown>,
) => {
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(filename)
  const fileWriteStream = file.createWriteStream(options)

  let result

  try {
    result = await axios( {  responseType: 'stream', ...requestOptions })
      .then((response) => {
        return new Promise((resolve, reject) => {
          response.data.pipe(fileWriteStream)
          let error: Error | null = null
          logger.info('Piping data results from stream function.')

          fileWriteStream.on('error', (err) => {
            error = err
            logger.error(error)
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
  } catch (err: unknown) {
    let message = 'Download Error: \n'
    if (isNativeError(err)) {
      message += err.message
      logger.error(message)
    } else {
      message += 'Received unknown error... \n'
      logger.error(message)
      logger.error(err)
    }

    return
  }

  logger.info('End of stream function reached.')
  return result
}
