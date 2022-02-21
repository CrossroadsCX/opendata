const { reportImagesScraper } = require('../index')

const main = async () => {
  return reportImagesScraper({ attributes: { year: 2021, code: 'RPQTR1' }})
}

main()
  .then((result) => {
    console.log('Scraper finished')
    console.log(result)
    process.exit(0)
  }).catch((err) => {
    console.error(err)
    process.exit(1)
  })
