import winston from 'winston'
import { LoggingWinston as GCPLogging } from '@google-cloud/logging-winston'
import SlackTransport from 'winston-slack-webhook-transport'

import { getSecret } from '../gcp/secrets'

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new GCPLogging(),
  ]
})

const createSlackLogger = async () => {
  const slackLogger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
      new SlackTransport({
        webhookUrl: await getSecret('slack-webhook', 'open-campaign-finance')
      })
    ]
  })

  return slackLogger
}

export { logger, createSlackLogger }
