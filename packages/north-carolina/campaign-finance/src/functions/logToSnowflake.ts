import { Binds } from 'snowflake-sdk'
import { closeConnection, getConnection } from '../utils/snowflake'
import { logger } from '../utils/logger'

export type ConnectionArgs = {
  sqlText: string;
  binds: Binds;
}

export type LogToSnowflakeEvent = {
  data: string;
}

interface LogToSnowflake {
  (input: LogToSnowflakeEvent): Promise<unknown>;
}

export const logToSnowflake: LogToSnowflake = async (message) => {
  const inputString = Buffer.from(message.data, 'base64').toString()
  const { sqlText, binds}: ConnectionArgs = JSON.parse(inputString)
  const connection = await getConnection()

  const rows = await new Promise((resolve, reject) => {
    connection?.execute({
      sqlText,
      binds,
      complete: (err, stmt, rows) => {
        if (err) {
          logger.error(err)
          return reject(err)
        }

        resolve(rows)
      }
    })
  })
  await closeConnection()

  return rows
}
