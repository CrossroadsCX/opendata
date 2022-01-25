import winston from 'winston'
import { LoggingWinston as GCPLogging } from '@google-cloud/logging-winston'

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new GCPLogging(),
  ]
})

export { logger }
