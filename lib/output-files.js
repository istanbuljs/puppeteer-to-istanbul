// output JavaScript bundled in puppeteer output to format
// that can be eaten by Istanbul.

// TODO: Put function interfaces on this file

const fs = require('fs')
const mkdirp = require('mkdirp')
const clone = require('clone')
const pathLib = require('path')
const url = require('url')

const storagePath = './.nyc_output/js'

class OutputFiles {
  constructor (coverageInfo) {
    // Clone coverageInfo to prevent mutating the passed in data
    this.coverageInfo = clone(coverageInfo)
    this.iterator = 0
    this._parseAndIsolate()
  }

  rewritePath (path) {
    // generate a new path relative to ./coverage/js.
    // this would be around where you'd use mkdirp.

    var str = ``

    var postProtocolPath
    var httpProtocol = false
    try {
      var urlPath = new url.URL(path)
      if (urlPath.protocol === 'http:' || urlPath.protocol === 'https:') {
        httpProtocol = true
        postProtocolPath = urlPath.pathname.substring(1)
      } else {
        // fallback for other protocols (ie.: 'file://')
        postProtocolPath = path
      }
    } catch (TypeError) {
      // fallback if it can't parse the path as url (ie.: './test.js')
      postProtocolPath = path
    }

    var truncatedPath
    if (httpProtocol) {
      truncatedPath = postProtocolPath
    } else {
      truncatedPath = pathLib.basename(postProtocolPath)
    }

    // Special case: when html present, strip and return specialized string
    if (truncatedPath.includes('.html')) {
      truncatedPath = pathLib.resolve(storagePath, truncatedPath) + 'puppeteerTemp-inline'
    } else {
      truncatedPath = truncatedPath.split('.js')[0]
      truncatedPath = pathLib.resolve(storagePath, truncatedPath)
    }
    mkdirp.sync(storagePath)
    if (fs.existsSync(truncatedPath + '.js')) {
      this.iterator++
      str = `${truncatedPath}-${this.iterator}.js`
      return str
    } else {
      str = `${truncatedPath}.js`
      return str
    }
  }

  _parseAndIsolate () {
    for (var i = 0; i < this.coverageInfo.length; i++) {
      var path = this.rewritePath(this.coverageInfo[i].url)
      this.coverageInfo[i].url = path

      // create new dir structure for modules
      if (!fs.existsSync(pathLib.parse(path).dir)) {
        mkdirp.sync(pathLib.parse(path).dir)
      }

      fs.writeFileSync(path, this.coverageInfo[i].text)
    }
  }

  getTransformedCoverage () {
    return this.coverageInfo
  }
}

module.exports = function (coverageInfo) {
  return new OutputFiles(coverageInfo)
}
