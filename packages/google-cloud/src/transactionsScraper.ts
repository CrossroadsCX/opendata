import * as puppeteer from 'puppeteer'
import { isValid, isMatch } from 'date-fns'
import type { HttpFunction } from '@google-cloud/functions-framework/build/src/functions'
import { streamFileToGCS } from './streamFileToGCS'

export const scrapTransaction: HttpFunction = (req: Record<string, unknown>, res) => {
  (async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://cf.ncsbe.gov/CFTxnLkup/');

    // Validate params
    const params: { from?: string, to?: string } = req.query

    if (!isValid(new Date(params.from)) || !isValid(new Date(params.to))) {
      throw new Error('Invalid Date Parameters - Date Parameters must be from=mm/dd/yyyy and to=mm/dd/yyyy')
    }

    if (!isMatch(params.from, 'mm/dd/yyyy') || !isMatch(params.to, 'mm/dd/yyyy')) {
      throw new Error('Invalid Date - Date must be valid and format must be mm/dd/yyyy')
    }

    // Fill out date fields
    await page.type('#DateFrom', params.from)
    await page.type('#DateTo', params.to)
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

    // Close the browser
    await browser.close()
    
    //streamFileToGCS parameters
    const requestOptions = {
      encoding: null,
      method: csvRequest._method,
      url: csvRequest._url,
      data: csvRequest._postData,
      headers: csvRequest._headers,
    }

    const options = {
      contentType: 'text/csv',
      metadata: {
        prefix: 'ncreceipt',
        tags: ['ncreceipt', 'ncfinance'],
      },
    }

    let filename = `nc-receipts-${params.to}-to-${params.to}.csv`
    filename = filename.replace(/\//g, '')

    const bucket = 'dummy-bucket-finance'

    //CSVRequest to Bucket Storage
    await streamFileToGCS(requestOptions, bucket, filename, options)
    res.send('finish')
  })()
}
