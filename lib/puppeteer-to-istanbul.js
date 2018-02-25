const fs = require('fs')
const v8toIstanbul = require('v8-to-istanbul')

class PuppeteerToIstanbul {

  constructor (coverageInfo, input, output) {
    this.coverageInfo = coverageInfo
    this.puppeteerToConverter = new OutputFiles(coverageInfo).output()
    this.puppeteerToV8Info = new PuppeteerToV8(this.puppeteerToConverter).convertCoverage()

    // Actually does the conversion step, is typically used by outside users
    convertIstanbul(this.puppeteerToV8Info, this.input, this.output)
  }

  setCoverageInfo (coverageInfo) {
    this.coverageInfo = coverageInfo
  }

  writeIstanbulFormat(coverageInfo, input, output) {
    // TODO: We should iterate through each file based on the coverage info, and then convert to Istanbul here

    const script = v8toIstanbul(coverageInfo)
    script.applyCoverage(v8Format[0].functions)
    fs.writeFileSync('./.nyc_output/out.json', JSON.stringify(script.toIstanbul()), 'utf8')
  }

}

module.exports = function (coverageInfo, input, output) {
  var pupToInst = new PuppeteerToIstanbul(coverageInfo);
  pupToInst.convertIstanbul(pupToInst.puppeteerToV8Info, input, output)
}
