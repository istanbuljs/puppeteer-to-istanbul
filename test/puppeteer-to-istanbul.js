/* globals describe, it */

const fs = require('fs')

const PuppeteerToIstanbul = require('../lib/puppeteer-to-istanbul')

require('chai').should()

describe('puppeteer-to-istanbul', () => {
  const fixture = require('./fixtures/multiple-files.json')

  it('writes coverage to default filePath', () => {
    const filePath = new PuppeteerToIstanbul(fixture).writeIstanbulFormat()

    filePath.should.eq('./.nyc_output/out.json')
    fs.existsSync(filePath).should.eq(true)

    fs.unlinkSync(filePath)
  })

  it('writes coverage to given filePath', () => {
    const filePath = new PuppeteerToIstanbul(fixture).writeIstanbulFormat({ outputFile: './.nyc_output/custom.json' })

    filePath.should.eq('./.nyc_output/custom.json')
    fs.existsSync(filePath).should.eq(true)

    fs.unlinkSync(filePath)
  })

  it("doesn't filter any files by default", () => {
    const filePath = new PuppeteerToIstanbul(fixture).writeIstanbulFormat()
    const savedJson = JSON.parse(fs.readFileSync(filePath))

    Object.keys(savedJson).length.should.eq(4)

    fs.unlinkSync(filePath)
  })

  it('applies filter when given', () => {
    const filePath = new PuppeteerToIstanbul(fixture).writeIstanbulFormat({
      filter: (jsFile) => jsFile.indexOf('record') === -1
    })
    const savedJson = JSON.parse(fs.readFileSync(filePath))

    Object.keys(savedJson).length.should.eq(2)

    fs.unlinkSync(filePath)
  })
})
