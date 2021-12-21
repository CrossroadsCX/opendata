import { HttpFunction } from '@google-cloud/functions-framework'
import { logger } from '@crossroadscx/utils'

export const someFunction: HttpFunction = () => {
  // const logger = winston.createLogger({
  //   level: 'info',
  //   format: format.combine(
  //     format.errors(),
  //     format.metadata(),
  //     format.json(),
  //   ),
  //   defaultMeta: { function: 'example-function' },
  //   transports: [
  //     new winston.transports.Console(),
  //   ],
  // })
  logger.log('some function logging')
}
