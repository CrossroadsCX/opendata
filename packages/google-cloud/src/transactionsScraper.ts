import * as puppeteer from 'puppeteer'
import { streamFileToGCS } from './streamFileToGCS'

export const scrapTransaction = () => {
  (async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://cf.ncsbe.gov/CFTxnLkup/');
    // Fill out date fields
    await page.type('#DateFrom', '01/01/2020')
    await page.type('#DateTo', '01/01/2020')
    // Start search
    await page.click('#btnSearch')
    // Wait and click Export csv button
    await page.waitForSelector('#btnExportResults', { visible: true, timeout: 0 })
    await page.click('#btnExportResults')
    // Intercept the generated file
    await page.setRequestInterception(true)

    const csvRequest: any = await new Promise((resolve) => {
      page.on('request', (interceptedRequest) => {
        interceptedRequest.abort()
        resolve(interceptedRequest)
      })
    })

    console.log(csvRequest)

    // Close the browser
    await browser.close()
    
    const requestOptions = {
      encoding: null,
      method: csvRequest._method,
      uri: csvRequest._url,
      body: csvRequest._postData,
      headers: csvRequest._headers,
    }

    const options = {
      contentType: 'text/csv',
      metadata: {
        prefix: 'ncreceipt',
        tags: ['ncreceipt', 'ncfinance'],
      },
    }

    let filename = `nc-receipts-01-to-01.csv`
    filename = filename.replace(/\//g, '')

    const bucket = 'dummy-bucket-finance'

    //CSVRequest to Bucket Storage
    console.log(await streamFileToGCS(requestOptions.uri, bucket, filename, options))
    console.log('finish')
  })()
}
