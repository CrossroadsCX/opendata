import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new LoggingWinston(),
  ],
});

export default logger;