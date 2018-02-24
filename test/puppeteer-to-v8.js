/* globals describe, it */

var PuppeteerToV8 = require('../lib/puppeteer-to-v8')()

require('chai').should()

describe('puppeteer-to-v8', () => {
  it('translates ranges into v8 format', () => {
    const fixture = require('./fixtures/function-coverage-missing')

    PuppeteerToV8.setCoverageInfo(fixture)

    let v8Coverage = PuppeteerToV8.convertCoverage()

    // V8 coverage has ranges on a functions object, so check for that
    v8Coverage[0].functions.ranges.should.eql(fixture[0].ranges)
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
