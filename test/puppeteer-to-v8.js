/* globals describe, it */

const puppeteerToV8 = require('../lib/puppeteer-to-v8')()

require('chai').should()

describe('puppeteer-to-v8', () => {
  it('translates range data appropriately', () => {
    console.info(puppeteerToV8)
  })
})
