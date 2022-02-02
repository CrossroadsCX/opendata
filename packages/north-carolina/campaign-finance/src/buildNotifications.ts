import type { Context, LegacyEvent } from '@google-cloud/functions-framework'
import { logger, createSlackLogger } from './logger'

type BuildEvent = {
  attributes: Record<string, unknown>
  data: string;
}

type BuildEventData = {
  status: string;
  substitutions: {
    _GOOGLE_FUNCTION_TARGET: string;
  }
  // More attributes https://cloud.google.com/build/docs/api/reference/rest/v1/projects.builds
}

export const buildNotifications = async (event: BuildEvent, context: Context) => {
  const slackLogger = await createSlackLogger()
  try {
    const { data  } = event
    const dataString = Buffer.from(data, 'base64').toString()
    const dataObject: BuildEventData = JSON.parse(dataString)

    const { status, substitutions: { _GOOGLE_FUNCTION_TARGET }} = dataObject

    slackLogger.info(`Cloud function built: ${_GOOGLE_FUNCTION_TARGET} :: ${status}`)
  } catch (err) {
    logger.error(err)
    slackLogger.error(err)
    throw err
  }

  return
}
