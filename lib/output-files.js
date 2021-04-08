// output JavaScript bundled in puppeteer output to format
// that can be eaten by Istanbul.

// TODO: Put function interfaces on this file

const fs = require('fs')
const mkdirp = require('mkdirp')
const clone = require('clone')
const pathLib = require('path')
const url = require('url')

let iterator = {}

class OutputFiles {
  constructor (coverageInfo, options = {}) {
    this.storagePath = pathLib.resolve(options.storagePath, 'js')
    this.includeHostname = options.hasOwnProperty('includeHostname') ? options.includeHostname : true

    // Clone coverageInfo to prevent mutating the passed in data
    this.coverageInfo = clone(coverageInfo)
    this._parseAndIsolate()
  }

  parsePath (path) {
    let urlPath

    try {
      urlPath = new url.parse(path)
    } catch (error) {
      path = 'file://' + path
      urlPath = new url.parse(path)
    }

    let postProtocolPath = urlPath.pathname.substring(1)

    if (urlPath.hostname && this.includeHostname) {
      let hostnameAndPort = urlPath.hostname
      if (urlPath.port) {
        hostnameAndPort = hostnameAndPort + '_' + urlPath.port
      }

      postProtocolPath = hostnameAndPort + '/' + postProtocolPath
    }

    return postProtocolPath
  }

  rewritePath (parsedPath) {
    // generate a new path relative to ./coverage/js.
    // this would be around where you'd use mkdirp.

    let str = ``
    let isInline = false
    // Special case: when html present, strip and return specialized string
    if (pathLib.extname(parsedPath) === '.html') {
      isInline = true
      parsedPath = pathLib.resolve(this.storagePath, parsedPath + 'puppeteerTemp-inline')
    } else {
      parsedPath = pathLib.resolve(this.storagePath, pathLib.dirname(parsedPath), pathLib.basename(parsedPath, '.js'))
    }
    mkdirp.sync(this.storagePath)
    if (fs.existsSync(parsedPath + '.js') && isInline) {
      if (!Number.isInteger(iterator[parsedPath])) {
        iterator[parsedPath] = 1
      } else {
        iterator[parsedPath]++
      }
      str = `${parsedPath}-${iterator[parsedPath]}.js`
      return str
    } else {
      str = `${parsedPath}.js`
      return str
    }
  }

  _parseAndIsolate () {
    for (let i = 0; i < this.coverageInfo.length; i++) {
      const parsedPath = this.parsePath(this.coverageInfo[i].url)
      const rewrittenPath = this.rewritePath(parsedPath)
      const sourceMappingUrlMatch = this.coverageInfo[i].text.match(/^\/\/# sourceMappingURL=data:application\/json;charset=utf-8;base64,(.*)$/m)
      const sourceMapping = sourceMappingUrlMatch !== null
        ? JSON.parse(Buffer.from(sourceMappingUrlMatch[1], 'base64').toString('utf-8'))
        : {}
        
      this.coverageInfo[i].realPath = pathLib.resolve(sourceMapping.sourceRoot || '.', parsedPath)

      if (Object.keys(sourceMapping).length > 0) {
        this.coverageInfo[i].sourceMapping = {
          ...sourceMapping,
          file: this.coverageInfo[i].realPath,
          sources: sourceMapping.sources.map(source => this.parsePath(source)),
          sourceRoot: sourceMapping.sourceRoot || process.cwd(),
        }
      }

      this.coverageInfo[i].originalUrl = this.coverageInfo[i].url
      this.coverageInfo[i].url = rewrittenPath

      mkdirp.sync(pathLib.parse(rewrittenPath).dir)

      fs.writeFileSync(rewrittenPath, this.coverageInfo[i].text)
    }
  }

  getTransformedCoverage () {
    return this.coverageInfo
  }
}

function genOutputFiles (coverageInfo, options) {
  return new OutputFiles(coverageInfo, options)
}

genOutputFiles.resetIterator = function () {
  iterator = {}
}

module.exports = genOutputFiles
