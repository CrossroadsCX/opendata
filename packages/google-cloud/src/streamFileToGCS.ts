import axios from 'axios'
import { storage } from './storage'

import { logger } from '@crossroadscx/utils'

export const streamFileToGCS = async (
  url: string,
  bucketName: string,
  filename: string,
  options: Record<string, unknown>,
) => {
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(filename)
  const fileWriteStream = file.createWriteStream(options)

  try {
    const result = await axios.
  } catch (err) {
    let message = 'Download Error: \n'
    message += err.message

    logger.error(message)

    return
  }
}
