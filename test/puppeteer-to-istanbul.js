/* globals describe, it */

const should = require('chai').should()
const fs = require('fs')
const OutputFiles = require('../lib/output-files')

var PuppeteerToIstanbul = require('../lib/puppeteer-to-istanbul')

describe('puppeteer-to-istanbul', () => {
  it('outputs a valid out.json file, to the default location', async () => {
    const fixture = require('./fixtures/two-inline.json')
    const pti = PuppeteerToIstanbul(fixture)
    await pti.writeIstanbulFormat()
    const content = fs.readFileSync('.nyc_output/out.json', 'utf8')
    const jsonObject = JSON.parse(content)
    should.exist(jsonObject)
    fs.unlinkSync('.nyc_output/out.json')
  })

  it('outputs a valid out.json file, in the custom location', async () => {
    const fixture = require('./fixtures/two-inline.json')
    const pti = PuppeteerToIstanbul(fixture, { storagePath: '.nyc_output/custom' })
    await pti.writeIstanbulFormat()
    const content = fs.readFileSync('.nyc_output/custom/out.json', 'utf8')
    const jsonObject = JSON.parse(content)
    should.exist(jsonObject)
    fs.unlinkSync('.nyc_output/custom/out.json')
  })

  it('correctly sets coverage info', () => {
    const fixture = require('./fixtures/two-inline.json')
    const pti = PuppeteerToIstanbul(fixture)
    pti.setCoverageInfo(fixture)
    pti.coverageInfo.should.eql(fixture)
  })

  it('merge non-inline script coverage records', async () => {
    OutputFiles.resetIterator()
    PuppeteerToIstanbul.resetJSONPart()

    const fixtureNonInlineScriptA = require('./fixtures/merge-coverage/non-inline-script-a.json')
    const fixtureNonInlineScriptB = require('./fixtures/merge-coverage/non-inline-script-b.json')
    const ptiA = PuppeteerToIstanbul(fixtureNonInlineScriptA)
    await ptiA.writeIstanbulFormat()
    const jsonPartA = PuppeteerToIstanbul.getJSONPart()
    PuppeteerToIstanbul.resetJSONPart()
    const ptiB = PuppeteerToIstanbul(fixtureNonInlineScriptB)
    await ptiB.writeIstanbulFormat()
    const jsonPartB = PuppeteerToIstanbul.getJSONPart()
    PuppeteerToIstanbul.resetJSONPart()
    OutputFiles.resetIterator()
    PuppeteerToIstanbul.resetJSONPart()
    const pti = PuppeteerToIstanbul(fixtureNonInlineScriptA.concat(fixtureNonInlineScriptB))
    await pti.writeIstanbulFormat()
    const jsonPart = PuppeteerToIstanbul.getJSONPart()
    const keys = Object.keys(jsonPart)

    // Non-inline script data should be merged.
    jsonPart[keys[0]].s.should.deep.equal(PuppeteerToIstanbul.mergeCoverageData(jsonPartA[keys[0]].s, jsonPartB[keys[0]].s))
    // Inline script data should not be merged. So, there would be two inline files. Just likes:
    // [
    //   "/Users/puppeteer-to-istanbul/.nyc_output/js/localhost_9000/js/index.js"
    //   "/Users/puppeteer-to-istanbul/.nyc_output/js/tmp/puppeteerTemp.htmlpuppeteerTemp-inline-1.js"
    //   "/Users/puppeteer-to-istanbul/.nyc_output/js/tmp/puppeteerTemp.htmlpuppeteerTemp-inline-2.js"
    // ]
    Object.keys(jsonPart).should.deep.equal(Array.from(new Set(Object.keys(jsonPartA).concat(Object.keys(jsonPartB)))))
  })
})
