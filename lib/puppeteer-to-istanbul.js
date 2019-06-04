const fs = require('fs')
const OutputFiles = require('./output-files')
const mkdirp = require('mkdirp')
const PuppeteerToV8 = require('./puppeteer-to-v8')
const v8toIstanbul = require('v8-to-istanbul')

class PuppeteerToIstanbul {
  constructor (coverageInfo, outputDir) {
    this.coverageInfo = coverageInfo
    this.outputDir = outputDir || './.nyc_output';
    this.puppeteerToConverter = OutputFiles(coverageInfo).getTransformedCoverage()
    this.puppeteerToV8Info = PuppeteerToV8(this.puppeteerToConverter).convertCoverage()
  }

  setCoverageInfo (coverageInfo) {
    this.coverageInfo = coverageInfo
  }

  writeIstanbulFormat () {
    var fullJson = {}

    this.puppeteerToV8Info.forEach(jsFile => {
      const script = v8toIstanbul(jsFile.url)
      script.applyCoverage(jsFile.functions)

      let istanbulCoverage = script.toIstanbul()
      let keys = Object.keys(istanbulCoverage)

      fullJson[keys[0]] = istanbulCoverage[keys[0]]
    })

    mkdirp.sync(this.outputDir)
    fs.writeFileSync(`${this.outputDir}/out.json`, JSON.stringify(fullJson), 'utf8')
  }
}

module.exports = function (coverageInfo) {
  return new PuppeteerToIstanbul(coverageInfo)
}
