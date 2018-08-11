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

  parsePath (path) {
    let urlPath

    try {
      urlPath = new url.URL(path)
    } catch (error) {
      path = 'file://' + path
      urlPath = new url.URL(path)
    }

    let postProtocolPath = urlPath.pathname.substring(1)

    if (urlPath.hostname) {
      let hostnameAndPort = urlPath.hostname
      if (urlPath.port) {
        hostnameAndPort = hostnameAndPort + '_' + urlPath.port
      }

      postProtocolPath = hostnameAndPort + '/' + postProtocolPath
    }

    return postProtocolPath
  }

  rewritePath (path) {
    // generate a new path relative to ./coverage/js.
    // this would be around where you'd use mkdirp.

    let str = ``
    let parsedPath = this.parsePath(path)

    // Special case: when html present, strip and return specialized string
    if (parsedPath.includes('.html')) {
      parsedPath = pathLib.resolve(storagePath, parsedPath) + 'puppeteerTemp-inline'
    } else {
      parsedPath = parsedPath.split('.js')[0]
      parsedPath = pathLib.resolve(storagePath, parsedPath)
    }
    mkdirp.sync(storagePath)
    if (fs.existsSync(parsedPath + '.js')) {
      this.iterator++
      str = `${parsedPath}-${this.iterator}.js`
      return str
    } else {
      str = `${parsedPath}.js`
      return str
    }
  }

  _parseAndIsolate () {
    for (var i = 0; i < this.coverageInfo.length; i++) {
      var path = this.rewritePath(this.coverageInfo[i].url)
      this.coverageInfo[i].url = path

      mkdirp.sync(pathLib.parse(path).dir)

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
