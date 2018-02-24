class PuppeteerToV8 {
  constructor (coverageInfo) {
    this.coverageInfo = coverageInfo
  }

  setCoverageInfo (coverageInfo) {
    this.coverageInfo = coverageInfo
  }

  convertCoverage () {
    // Iterate through coverage info and create IDs
    let id = 0

    return this.coverageInfo.map(coverageItem => {
      return {
        scriptId: id++,
        url: coverageItem.url,
        functions: { ranges: coverageItem.ranges }
      }
    })
  }
}

module.exports = () => new PuppeteerToV8()
