const fs = require('fs')
const OutputFiles = require('./output-files')
const mkdirp = require('mkdirp')
const PuppeteerToV8 = require('./puppeteer-to-v8')
const v8toIstanbul = require('v8-to-istanbul')

let jsonPart = {}

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

    const outFilePath = './.nyc_output/out.json'

    fs.writeFileSync(outFilePath, '')

    const fd = fs.openSync(outFilePath, 'a')
    fs.writeSync(fd, '{')

    this.puppeteerToV8Info.forEach((jsFile, index) => {
      const script = v8toIstanbul(jsFile.url)
      script.applyCoverage(jsFile.functions)

      let istanbulCoverage = script.toIstanbul()
      let keys = Object.keys(istanbulCoverage)

      if (jsonPart[keys[0]]) {
        // Merge coverage records
        mergeCoverageData(jsonPart[keys[0]].s, istanbulCoverage[keys[0]].s)
      } else {
        jsonPart[keys[0]] = istanbulCoverage[keys[0]]
      }
      jsonPart[keys[0]].originalUrl = jsFile.originalUrl

      let jsonStr = JSON.stringify(jsonPart)
        .replace(/^{/, '')
        .replace(/}$/, '')

      const isLastIteration = index === (this.puppeteerToV8Info.length - 1)
      fs.writeSync(fd, jsonStr + (isLastIteration ? '' : ','))
    })

    fs.writeSync(fd, '}')
    fs.closeSync(fd)
  }
}

function mergeCoverageData (obja, objb) {
  Object.keys(obja).forEach(key => {
    obja[key] = (obja[key] || objb[key]) ? 1 : 0
  })
}

module.exports = function (coverageInfo) {
  return new PuppeteerToIstanbul(coverageInfo)
}
