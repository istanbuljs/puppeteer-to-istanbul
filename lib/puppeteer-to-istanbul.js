const fs = require('fs')
const OutputFiles = require('./output-files')
const mkdirp = require('mkdirp')
const PuppeteerToV8 = require('./puppeteer-to-v8')
const v8toIstanbul = require('v8-to-istanbul')

let jsonPart = {}

class PuppeteerToIstanbul {
  constructor (coverageInfo, options = {}) {
    this.storagePath = options.storagePath || './.nyc_output'
    this.filePathTransformer = options.transformPath || ((filePath) => filePath)
    this.includeHostname = options.hasOwnProperty('includeHostname') ? options.includeHostname : true

    this.coverageInfo = coverageInfo
    this.options = options
    this.puppeteerToConverter = OutputFiles(coverageInfo, options).getTransformedCoverage()
    this.puppeteerToV8Info = PuppeteerToV8(this.puppeteerToConverter).convertCoverage()
  }

  setCoverageInfo (coverageInfo) {
    this.coverageInfo = coverageInfo
  }

  writeIstanbulFormat () {
    mkdirp.sync(this.storagePath)

    const outFilePath = `${this.storagePath}/out.json`

    fs.writeFileSync(outFilePath, '')

    const fd = fs.openSync(outFilePath, 'a')

    this.puppeteerToV8Info.forEach((jsFile, index) => {
      const script = v8toIstanbul(jsFile.url)
      script.applyCoverage(jsFile.functions)

      let istanbulCoverage = script.toIstanbul()
      let keys = Object.keys(istanbulCoverage)

      const istanbulKey = keys[0]
      const filePath = this.filePathTransformer(istanbulKey)

      if (jsonPart[filePath]) {
        // Merge coverage records
        mergeCoverageData(jsonPart[filePath].s, istanbulCoverage[istanbulKey].s)
      } else {
        jsonPart[filePath] = istanbulCoverage[istanbulKey]
      }
      jsonPart[filePath].originalUrl = jsFile.originalUrl
      jsonPart[filePath].path = filePath
    })

    fs.writeSync(fd, '{')
    Object.keys(jsonPart).forEach((url, index, keys) => {
      const data = jsonPart[url]
      const isLastIteration = index === (keys.length - 1)

      fs.writeSync(fd, `${JSON.stringify(url)}: ${JSON.stringify(data)}${(isLastIteration ? '' : ',')}`)
    })
    fs.writeSync(fd, '}')
    fs.closeSync(fd)
  }
}

function mergeCoverageData (obja, objb) {
  Object.keys(obja).forEach(key => {
    obja[key] = (obja[key] || objb[key]) ? 1 : 0
  })
  return obja
}

function genPuppeteerToIstanbul (coverageInfo, options) {
  return new PuppeteerToIstanbul(coverageInfo, options)
}

genPuppeteerToIstanbul.resetJSONPart = function () {
  jsonPart = {}
}

genPuppeteerToIstanbul.getJSONPart = function () {
  return JSON.parse(JSON.stringify(jsonPart))
}

genPuppeteerToIstanbul.mergeCoverageData = mergeCoverageData

module.exports = genPuppeteerToIstanbul
