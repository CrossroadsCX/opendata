import type { Context, LegacyEvent } from '@google-cloud/functions-framework'
import { logger, createSlackLogger } from './logger'

export const buildNotifications = async (event: LegacyEvent, context: Context) => {
  const slackLogger = await createSlackLogger()
  logger.info('Event: ', event)
  logger.info('Context: ', context)

  slackLogger.info(`Cloud Function Deployed.`)

  return
}
