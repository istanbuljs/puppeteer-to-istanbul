const fs = require('fs')
const OutputFiles = require('./output-files')
const mkdirp = require('mkdirp')
const PuppeteerToV8 = require('./puppeteer-to-v8')
const v8toIstanbul = require('v8-to-istanbul')

class PuppeteerToIstanbul {
  constructor (coverageInfo) {
    this.setCoverageInfo(coverageInfo)
    this.puppeteerToConverter = OutputFiles(coverageInfo).getTransformedCoverage()
    this.puppeteerToV8Info = PuppeteerToV8(this.puppeteerToConverter).convertCoverage()
  }

  setCoverageInfo (coverageInfo) {
    this.coverageInfo = coverageInfo
  }

  writeIstanbulFormat ({ outputFile = './.nyc_output/out.json', filter = () => true } = {}) {
    var fullJson = {}

    this.puppeteerToV8Info.forEach(jsFile => {
      if (!filter(jsFile.url)) return

      const script = v8toIstanbul(jsFile.url)
      script.applyCoverage(jsFile.functions)

      let istanbulCoverage = script.toIstanbul()
      let keys = Object.keys(istanbulCoverage)

      fullJson[keys[0]] = istanbulCoverage[keys[0]]
    })

    const dirName = outputFile.split('/').splice(-1, 1).join('/')
    mkdirp.sync(dirName)
    fs.writeFileSync(outputFile, JSON.stringify(fullJson), 'utf8')

    return outputFile
  }
}

module.exports = function (coverageInfo) {
  return new PuppeteerToIstanbul(coverageInfo)
}
