const { absenteeScraper } = require('./dist/cjs/functions/absenteeScraper.js')

const main = async () => {
  const result = await absenteeScraper()
  console.log(result)
}

main()
  .then(() => {
    console.log('finished')
  }).catch((err) => {
    console.error(err)
  })
