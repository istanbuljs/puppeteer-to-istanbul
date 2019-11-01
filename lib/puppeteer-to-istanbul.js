const fs = require('fs')
const OutputFiles = require('./output-files')
const mkdirp = require('mkdirp')
const PuppeteerToV8 = require('./puppeteer-to-v8')
const v8toIstanbul = require('v8-to-istanbul')

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
    mkdirp.sync('./.nyc_output')

    fs.unlinkSync('./.nyc_output/out.json')
    const ws = fs.createWriteStream('./.nyc_output/out.json', { flags: 'a', encoding: 'utf8' })
    ws.write('{')

    this.puppeteerToV8Info.forEach(jsFile => {
      const script = v8toIstanbul(jsFile.url)
      script.applyCoverage(jsFile.functions)

      let istanbulCoverage = script.toIstanbul()
      let keys = Object.keys(istanbulCoverage)

      let jsonPart = {}
      jsonPart[keys[0]] = istanbulCoverage[keys[0]]
      jsonPart[keys[0]].originalUrl = jsFile.originalUrl

      let jsonStr = JSON.stringify(jsonPart)
        .replace(/^{/, '')
        .replace(/}$/, '')
      ws.write(jsonStr)
    })

    ws.write('}')
    ws.end()
  }
}

module.exports = function (coverageInfo) {
  return new PuppeteerToIstanbul(coverageInfo)
}
