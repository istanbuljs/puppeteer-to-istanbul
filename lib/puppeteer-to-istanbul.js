const fs = require('fs')
const OutputFiles = require('./output-files')
const mkdirp = require('mkdirp')
const pathLib = require('path')
const PuppeteerToV8 = require('./puppeteer-to-v8')
const v8toIstanbul = require('v8-to-istanbul')

let jsonPart = {}

class PuppeteerToIstanbul {
  constructor (coverageInfo, options = {}) {
    this.storagePath = options.storagePath || './.nyc_output'
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

      istanbulCoverage[jsFile.realPath] = istanbulCoverage[keys[0]]
      delete istanbulCoverage[keys[0]]
      keys[0] = jsFile.realPath
      istanbulCoverage[jsFile.realPath].path = jsFile.realPath

      // for some reason there are invalid column values in the
      // statement and branch maps that lead to errors in the
      // source-map package. end values cannot have column=0,
      // so we remove them.
      Object.entries(istanbulCoverage[jsFile.realPath].statementMap).forEach(entry => {
        if (entry[1].end.column <= 0) {
          delete istanbulCoverage[jsFile.realPath].statementMap[entry[0]]
        }
      })
      Object.entries(istanbulCoverage[jsFile.realPath].branchMap).forEach(entry => {
        if (entry[1].loc.end.column <= 0) {
          delete istanbulCoverage[jsFile.realPath].branchMap[entry[0]]
        }
      })

      if (jsonPart[keys[0]]) {
        // Merge coverage records
        mergeCoverageData(jsonPart[keys[0]].s, istanbulCoverage[keys[0]].s)
      } else {
        jsonPart[keys[0]] = istanbulCoverage[keys[0]]
      }
      jsonPart[keys[0]].originalUrl = jsFile.originalUrl
      jsonPart[keys[0]].inputSourceMap = jsFile.sourceMapping
    })

    for (const foo in jsonPart) {
      if (!fs.existsSync(foo)) {
        delete jsonPart[foo]
      }
    }

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
