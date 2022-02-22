import { Context } from '@google-cloud/functions-framework'
import { streamFileToGCS } from '../helpers/streamFileToGCS'
import type { RowData as ReportImageData } from '../functions/reportImagesScraper'
import { logger } from '../utils/logger'

const destBucket = 'raw-report-images'

type DownloadReportImageEvent = {
  data: string
}

interface DownloadReportImage {
  (event: DownloadReportImageEvent, context: Context): Promise<void>
}

export const downloadReportImage: DownloadReportImage = async (event, context) => {
  logger.info(event)
  logger.info(context)
  const imageDataString = Buffer.from(event.data, 'base64').toString()
  const imageData: ReportImageData = JSON.parse(imageDataString)

  const { imageLink } = imageData
  logger.info(imageLink)
}
