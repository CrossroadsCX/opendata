import snowflake from 'snowflake-sdk'
import { getSecret } from "../gcp/secrets"
import { logger } from './logger'

type SnowflakeCreds = {
  account: string;
  database: string;
  schema: string;
  username: string;
  role: string;
  password: string;
  warehouse: string;
  region: string;
}

let connection: snowflake.Connection | null = null

export const getConnection = async () => {
  if (connection) return connection

  const snowflakeEncoded = await getSecret('snowflake-creds', 'open-campaign-finance')

  const snowflakeDecodedString = Buffer.from(snowflakeEncoded, 'base64').toString()
  const snowflakeCreds: SnowflakeCreds = JSON.parse(snowflakeDecodedString)

  const {
    account,
    database,
    schema,
    username,
    role,
    password,
    warehouse,
    region,
  } = snowflakeCreds

  const connectionObject =  snowflake.createConnection({
    account,
    username,
    role,
    password,
    database,
    schema,
    warehouse,
    region,
  })

  connection = await new Promise((resolve, reject) => {
    connectionObject.connect((err, conn) => {
      if (err) {
        logger.error(err)
        reject(err)
      } else {
        logger.info('Connected to snowflake')
        resolve(conn)
      }
    })
  })

  return connection
}

export const closeConnection = async () => {
  if (!connection) return
  await new Promise((resolve, reject) => {
    connection?.destroy((err, conn) => {
      if (err) {
        logger.error(err)
        reject(err)
      } else {
        logger.info('Closed snowflake connection')
        connection = null
        resolve(conn)
      }
    })
  })
}
