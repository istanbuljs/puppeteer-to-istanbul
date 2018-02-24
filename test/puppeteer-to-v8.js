/* globals describe, it */

const puppeteerToV8 = require('../lib/puppeteer-to-v8')()

require('chai').should()

describe('puppeteer-to-v8', () => {
  it('translates ranges into v8 format', () => {
    console.info(puppeteerToV8)
  })

  // use mkdirp:
  // mkdirp.sync('./coverage/js')
  it('rewrites filename to be relative to ./coverage/js', () => {
    // const fixture = require('./fixtures/block-else-not-covered')
  })

  // look at the uuid library:
  // uuid.v4()
  it('generates scriptID', () => {

  })

  // for this test case, make sure we cover what happens
  // if there are multiple script tags in the same HTML file.
  it('handles coverage output for inline JavaScript', () => {

  })
})
