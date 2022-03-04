import { Context } from '@google-cloud/functions-framework'
import { PubSub } from '@google-cloud/pubsub'
import { formatISO9075 } from 'date-fns'

import { streamFileToGCS } from '../helpers/streamFileToGCS'
import type { RowData as ReportImageData } from '../functions/reportImagesScraper'
import { logger } from '../utils/logger'

const destBucket = 'raw-report-images'
const loggingTopic = 'snowflake-logs'
const UPDATE_QUERY = 'UPDATE SCRAPER_LOGS SET STATUS = ?, RESULT_URL = ?, UPDATED_AT = ? WHERE MESSAGE_ID = ?'

type DownloadReportImageEvent = {
  data: string
}

interface DownloadReportImage {
  (event: DownloadReportImageEvent, context: Context): Promise<void>
}

export const downloadReportImage: DownloadReportImage = async (event, context) => {
  logger.info(event)
  logger.info(context)
  const { eventId } = context
  logger.info(eventId)
  const imageDataString = Buffer.from(event.data, 'base64').toString()
  const imageData: ReportImageData = JSON.parse(imageDataString)

  const { committeeName, imageLink, reportYear, reportType, rowAmended } = imageData

  const requestOptions = {
    method: 'GET',
    url: imageLink,
  }

  const options = {
    contentType: 'application/pdf'
  }

  const filename = `${reportYear}/${reportType}/${committeeName}${rowAmended === 'Y' ? '__amended' : ''}.pdf`

  logger.info(`Streaming file from ${imageLink} to ${destBucket}`)

  const result = await streamFileToGCS(requestOptions, destBucket, filename, options)
  logger.info(result)

  const queryArgs = [
    'Downloaded',
    `gs://${destBucket}/${filename}`,
    formatISO9075(Date.now()),
    eventId as string,
  ]

  const pubsub = new PubSub()
  const topic = pubsub.topic(loggingTopic)
  const snowflakeArgs = {
    sqlText: UPDATE_QUERY,
    binds: queryArgs,
  }
  const snowflakeArgsBuffer = Buffer.from(JSON.stringify(snowflakeArgs))
  await topic.publish(snowflakeArgsBuffer)
}
