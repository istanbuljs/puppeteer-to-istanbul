/* globals describe, it */

const should = require('chai').should()
const fs = require('fs')

var PuppeteerToC8 = require('../lib/puppeteer-to-c8')

describe('puppeteer-to-c8', () => {
  it('outputs a valid out.json file, to the default location', () => {
    const fixture = require('./fixtures/two-inline.json')
    const pti = PuppeteerToC8(fixture)
    pti.writeC8Format()
    const content = fs.readFileSync(`${process.env.NODE_V8_COVERAGE}/out.json`, 'utf8')
    const jsonObject = JSON.parse(content)
    should.exist(jsonObject)
    fs.unlinkSync(`${process.env.NODE_V8_COVERAGE}/out.json`)
  })

  it('outputs a valid out.json file, in the custom location', () => {
    const fixture = require('./fixtures/two-inline.json')
    const pti = PuppeteerToC8(fixture, { storagePath: '.nyc_output/custom' })
    pti.writeC8Format()
    const content = fs.readFileSync('.nyc_output/custom/out.json', 'utf8')
    const jsonObject = JSON.parse(content)
    should.exist(jsonObject)
    fs.unlinkSync('.nyc_output/custom/out.json')
  })

  it('correctly sets coverage info', () => {
    const fixture = require('./fixtures/two-inline.json')
    const pti = PuppeteerToC8(fixture)
    pti.setCoverageInfo(fixture)
    pti.coverageInfo.should.eql(fixture)
  })

  it('ensures rawScriptCoverage is present', () => {
    const fixture = require('./fixtures/http-es6-modules.json')
    should.Throw(() => PuppeteerToC8(fixture), 'rawScriptCoverage property not found in coverage info. Make sure you have set "includeRawScriptCoverage" to true when calling startJSCoverage().')
  })
})
