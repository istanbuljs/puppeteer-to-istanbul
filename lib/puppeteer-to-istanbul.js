const fs = require('fs')
const v8toIstanbul = require('v8-to-istanbul')
const OutputFiles = require('./output-files')
const PuppeteerToV8 = require('./puppeteer-to-v8')

class PuppeteerToIstanbul {
  constructor (coverageInfo) {
    this.coverageInfo = coverageInfo
    this.puppeteerToConverter = OutputFiles(coverageInfo).getTransformedCoverage()
    this.puppeteerToV8Info = PuppeteerToV8(this.puppeteerToConverter).convertCoverage()
  }

  setCoverageInfo (coverageInfo) {
    this.coverageInfo = coverageInfo
  }

  writeIstanbulFormat () {
    // TODO: We should iterate through each file based on the coverage info, and then convert to Istanbul here
    // console.log(this.puppeteerToV8Info)
    const script = v8toIstanbul(this.puppeteerToV8Info[0].url)
    script.applyCoverage(this.puppeteerToV8Info[0].functions)
    fs.writeFileSync('./.nyc_output/out.json', JSON.stringify(script.toIstanbul()), 'utf8')
  }
}

module.exports = function (coverageInfo) {
  return new PuppeteerToIstanbul(coverageInfo)
}
