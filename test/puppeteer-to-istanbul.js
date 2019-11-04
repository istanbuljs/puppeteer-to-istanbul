/* globals describe, it */

const should = require('chai').should()
const fs = require('fs')

var PuppeteerToIstanbul = require('../lib/puppeteer-to-istanbul')

describe('puppeteer-to-istanbul', () => {
  it('outputs a valid out.json file', () => {
    const fixture = require('./fixtures/two-inline.json')
    const pti = PuppeteerToIstanbul(fixture)
    pti.writeIstanbulFormat()
    const content = fs.readFileSync('.nyc_output/out.json', 'utf8')
    const jsonObject = JSON.parse(content)
    should.exist(jsonObject)
    fs.unlinkSync('.nyc_output/out.json')
  })

  it('correctly sets coverage info', () => {
    const fixture = require('./fixtures/two-inline.json')
    const pti = PuppeteerToIstanbul(fixture)
    pti.setCoverageInfo(fixture)
    pti.coverageInfo.should.eql(fixture)
  })
})
