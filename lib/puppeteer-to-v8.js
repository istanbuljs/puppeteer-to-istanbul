class PuppeteerToV8 {
  constructor (coverageInfo) {
    this.coverageInfo = coverageInfo
  }

  convertCoverage () {
    return this.coverageInfo
  }
}

module.exports = () => new PuppeteerToV8()
