import winston from 'winston';
declare const logger: winston.Logger;
declare const createSlackLogger: () => Promise<winston.Logger>;
export { logger, createSlackLogger };
