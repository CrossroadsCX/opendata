import puppeteer from 'puppeteer'

const ncsbeReportsSearchUrl = 'https://cf.ncsbe.gov/CFDocLkup/'

const main = async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.goto(ncsbeReportsSearchUrl)

  const tableElement = await page.$('#tblDocument')

  if (tableElement) {
    // @ts-ignore
    const elements = await tableElement.$$('input')

    const elementValues = elements.map(async (el) => {

      return (await el.getProperty('value')).jsonValue()
    })

    const values = await Promise.all(elementValues)
    console.log(values)
  }

  // const reportCodes = await reportElements.

}

main()
  .then(() => {
    console.log('Finished.')
    process.exit(0)
  }).catch((err) => {
    console.error(err)
    process.exit(1)
  })
