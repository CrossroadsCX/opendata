import winston, { format } from 'winston'

export const someFunction = () => {
  const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
      format.errors(),
      format.metadata(),
      format.json(),
    ),
    defaultMeta: { function: 'example-function' },
    transports: [
      new winston.transports.Console(),
    ]
  })
  logger.info('some function logging')
}
