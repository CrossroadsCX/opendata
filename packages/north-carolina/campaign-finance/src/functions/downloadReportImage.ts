import { PubSub } from '@google-cloud/pubsub'
import { formatISO9075 } from 'date-fns'

import { streamFileToGCS } from '../helpers/streamFileToGCS'
import type { RowData as ReportImageData } from '../functions/reportImagesScraper'
import { logger } from '../utils/logger'

const destBucket = 'raw-report-images'
const loggingTopic = 'snowflake-logs'
const UPDATE_QUERY = 'INSERT INTO IMAGE_DOWNLOAD_LOGS (DID, RESULT_URL, UPDATED_AT) VALUES (?, ?, ?)'

type DownloadReportImageEvent = {
  data: string
}

interface DownloadReportImage {
  (event: DownloadReportImageEvent): Promise<void>
}

export const downloadReportImage: DownloadReportImage = async (event) => {
  const imageDataString = Buffer.from(event.data, 'base64').toString()
  const imageData: ReportImageData = JSON.parse(imageDataString)

  const { DID, committeeName, imageLink, reportYear, reportType, rowAmended } = imageData

  const requestOptions = {
    method: 'GET',
    url: imageLink,
  }

  const options = {
    contentType: 'application/pdf'
  }

  const filename = `${reportYear}/${reportType}/${DID}__${committeeName.replace('/', '-')}${rowAmended === 'Y' ? '__amended' : ''}.pdf`

  logger.info(`Streaming file from ${imageLink} to ${destBucket}`)

  const result = await streamFileToGCS(requestOptions, destBucket, filename, options)

  const queryArgs = [
    DID,
    `gs://${destBucket}/${filename}`,
    formatISO9075(Date.now())
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
