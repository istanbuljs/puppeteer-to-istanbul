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

    full_json = ''

    this.puppeteerToV8Info.forEach(js_file) => {
      const script = v8toIstanbul(js_file.url)
      script.applyCoverage(js_file.functions)
      full_json.concat(script.toIstanbul())
    }
    fs.writeFileSync('./.nyc_output/out.json', JSON.stringify(full_json), 'utf8')
  }
}

module.exports = function (coverageInfo) {
  return new PuppeteerToIstanbul(coverageInfo)
}
