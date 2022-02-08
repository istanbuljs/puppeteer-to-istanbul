const fs = require('fs')
const mkdirp = require('mkdirp')

class PuppeteerToC8 {
  constructor (coverageInfo, options = {}) {
    this.storagePath = options.storagePath || process.env.NODE_V8_COVERAGE
    this.includeHostname = options.hasOwnProperty('includeHostname') ? options.includeHostname : true

    if (!(coverageInfo[0]?.rawScriptCoverage)) {
      throw new Error('rawScriptCoverage property not found in coverage info. Make sure you have set "includeRawScriptCoverage" to true when calling startJSCoverage().');
    }

    this.coverageInfo = coverageInfo
    this.options = options
  }

  setCoverageInfo (coverageInfo) {
    this.coverageInfo = coverageInfo
  }

  writeC8Format () {
    mkdirp.sync(this.storagePath)

    const outFilePath = `${this.storagePath}/out.json`

    fs.writeFileSync(outFilePath, JSON.stringify({result: this.coverageInfo.map(ci => ci.rawScriptCoverage)}))
  }
}

function genPuppeteerToC8 (coverageInfo, options) {
  return new PuppeteerToC8(coverageInfo, options)
}

module.exports = genPuppeteerToC8
