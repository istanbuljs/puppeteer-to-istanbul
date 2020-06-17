/* globals describe, it */

const should = require('chai').should()
const fs = require('fs')
const OutputFiles = require('../lib/output-files')

var PuppeteerToIstanbul = require('../lib/puppeteer-to-istanbul')

describe('puppeteer-to-istanbul', () => {
  it('outputs a valid out.json file, to the default location', () => {
    const fixture = require('./fixtures/two-inline.json')
    const pti = PuppeteerToIstanbul(fixture)
    pti.writeIstanbulFormat()
    const content = fs.readFileSync('.nyc_output/out.json', 'utf8')
    const jsonObject = JSON.parse(content)
    should.exist(jsonObject)
    fs.unlinkSync('.nyc_output/out.json')
  })

  it('outputs a valid out.json file, in the custom location', () => {
    const fixture = require('./fixtures/two-inline.json')
    const pti = PuppeteerToIstanbul(fixture, { storagePath: '.nyc_output/custom' })
    pti.writeIstanbulFormat()
    const content = fs.readFileSync('.nyc_output/custom/out.json', 'utf8')
    const jsonObject = JSON.parse(content)
    should.exist(jsonObject)
    fs.unlinkSync('.nyc_output/custom/out.json')
  })

  it('outputs a valid out.json file, with a custom path name', async () => {
    const fixture = require('./fixtures/two-inline.json')

    const ptiA = PuppeteerToIstanbul(fixture)
    ptiA.writeIstanbulFormat()
    const contentA = fs.readFileSync('.nyc_output/out.json', 'utf8')
    const jsonObjectA = JSON.parse(contentA)
    should.exist(jsonObjectA)
    const keysA = Object.keys(jsonObjectA)
    let firstKeyA = keysA[0]
    if (firstKeyA.includes('\\')) firstKeyA = firstKeyA.replace(/\\/g, '/')
    firstKeyA.should.include('.nyc_output/js/tmp/puppeteerTemp.htmlpuppeteerTemp-inline.js')
    keysA[0].should.equal(jsonObjectA[keysA[0]].path)
    fs.unlinkSync('.nyc_output/out.json')

    PuppeteerToIstanbul.resetJSONPart()
    OutputFiles.resetIterator()

    const ptiB = PuppeteerToIstanbul(fixture, { transformPath: (path) => path.replace('.nyc_output', '.nyc_input') })
    ptiB.writeIstanbulFormat()
    const contentB = fs.readFileSync('.nyc_output/out.json', 'utf8')
    const jsonObjectB = JSON.parse(contentB)
    should.exist(jsonObjectB)
    const keysB = Object.keys(jsonObjectB)
    let firstKeyB = keysB[0]
    if (firstKeyB.includes('\\')) firstKeyB = firstKeyB.replace(/\\/g, '/')
    firstKeyB.should.include('.nyc_input/js/tmp/puppeteerTemp.htmlpuppeteerTemp-inline-1.js')
    keysB[0].should.equal(jsonObjectB[keysB[0]].path)
    fs.unlinkSync('.nyc_output/out.json')
  })

  it('correctly sets coverage info', () => {
    const fixture = require('./fixtures/two-inline.json')
    const pti = PuppeteerToIstanbul(fixture)
    pti.setCoverageInfo(fixture)
    pti.coverageInfo.should.eql(fixture)
  })

  it('merge non-inline script coverage records', () => {
    OutputFiles.resetIterator()
    PuppeteerToIstanbul.resetJSONPart()

    const fixtureNonInlineScriptA = require('./fixtures/merge-coverage/non-inline-script-a.json')
    const fixtureNonInlineScriptB = require('./fixtures/merge-coverage/non-inline-script-b.json')
    const ptiA = PuppeteerToIstanbul(fixtureNonInlineScriptA)
    ptiA.writeIstanbulFormat()
    const jsonPartA = PuppeteerToIstanbul.getJSONPart()
    PuppeteerToIstanbul.resetJSONPart()
    const ptiB = PuppeteerToIstanbul(fixtureNonInlineScriptB)
    ptiB.writeIstanbulFormat()
    const jsonPartB = PuppeteerToIstanbul.getJSONPart()
    PuppeteerToIstanbul.resetJSONPart()
    OutputFiles.resetIterator()
    PuppeteerToIstanbul.resetJSONPart()
    const pti = PuppeteerToIstanbul(fixtureNonInlineScriptA.concat(fixtureNonInlineScriptB))
    pti.writeIstanbulFormat()
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
