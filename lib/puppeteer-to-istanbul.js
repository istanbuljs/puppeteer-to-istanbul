class PuppeteerToIstanbul {
  constructor (coverageInfo) {
    this.coverageInfo = coverageInfo
  }

  setCoverageInfo (coverageInfo) {
    this.coverageInfo = coverageInfo
  }

}

module.exports = (coverageInfo) => new PuppeteerToIstanbul(coverageInfo)
