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

  try {
    const result = await axios( {  responseType: 'stream', ...requestOptions })
      .then((response) => {
        return new Promise((resolve, reject) => {
          response.data.pipe(fileWriteStream)
          let error: Error | null = null

          fileWriteStream.on('error', (err) => {
            error = err
            fileWriteStream.end()
            reject(err)
          })

          fileWriteStream.on('close', () => {
            if (!error) {
              resolve(true)
            }
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
}
