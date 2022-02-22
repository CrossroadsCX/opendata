const { getConnection, closeConnection } = require('../dist/cjs/utils/snowflake')

const main = async () => {
  const connection = await getConnection()

  const result = await new Promise((resolve, reject) => {
    connection.execute({
      sqlText: 'SELECT * from INGESTED_TRANSACTIONS LIMIT 10',
      complete: (err, stmt, rows) => {
        if (err) reject(err)

        resolve ({ stmt, rows })
      }
    })
  })

  await closeConnection()
  return result
}

main()
  .then((result) => {
    console.log(result)
    process.exit(0)
  }).catch((err) => {
    console.error(err)
    process.exit(1)
  })
