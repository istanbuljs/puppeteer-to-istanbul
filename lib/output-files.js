// output JavaScript bundled in puppeteer output to format
// that can be eaten by Istanbul.
class OutputFiles {
  constructor (coverageInfo) {
    this.coverageInfo = coverageInfo
  }
  rewritePath (path) {
    // generate a new path relative to ./coverage/js.
    // this would be around where you'd use mkdirp.
    return `${path}-hey!`
  }
  output () {

  }
}

module.exports = function (converageInfo) {
  return new OutputFiles(converageInfo)
}
