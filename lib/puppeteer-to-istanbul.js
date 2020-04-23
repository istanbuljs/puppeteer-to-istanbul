const path = require('path')
const fs = require('fs')
const OutputFiles = require('./output-files')
const mkdirp = require('mkdirp')
const PuppeteerToV8 = require('./puppeteer-to-v8')
const v8toIstanbul = require('v8-to-istanbul')
const _utils = require('./utils')

let jsonPart = {}

class PuppeteerToIstanbul {
  constructor (coverageInfo, options) {
    this.coverageInfo = coverageInfo
    this.puppeteerToConverter = OutputFiles(coverageInfo, options).getTransformedCoverage()
    this.puppeteerToV8Info = PuppeteerToV8(this.puppeteerToConverter).convertCoverage()
  }

  setCoverageInfo (coverageInfo) {
    this.coverageInfo = coverageInfo
  }

  writeIstanbulFormat (options) {
    // define output directory
    let outFileDir = (options && options.hasOwnProperty('output_dir')) ? options.output_dir : './.nyc_output'
    
    // fix directory
    outFileDir = _utils.fixDir(outFileDir)
    
    // define path
    let outFilePath = outFileDir+'/out.json'

    // resolve
    outFileDir = path.resolve(process.cwd(), outFileDir)
    outFilePath = path.resolve(process.cwd(), outFilePath)
    
    // create directory
    mkdirp.sync(outFileDir)

    fs.writeFileSync(outFilePath, '')

    const fd = fs.openSync(outFilePath, 'a')

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
    })

    fs.writeSync(fd, '{')
    Object.keys(jsonPart).forEach((url, index, keys) => {
      const data = jsonPart[url]
      const isLastIteration = index === (keys.length - 1)

      fs.writeSync(fd, `"${url}": ${JSON.stringify(data)}${(isLastIteration ? '' : ',')}`)
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
