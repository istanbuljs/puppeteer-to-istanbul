// output JavaScript bundled in puppeteer output to format
// that can be eaten by Istanbul.

// TODO: Put function interfaces on this file

const fs = require('fs')
const mkdirp = require('mkdirp')
const clone = require('clone')
const pathLib = require('path')
const url = require('url')
const _utils = require('./utils')

const storageDir = './.nyc_output'
let iterator = {}

class OutputFiles {
  constructor (coverageInfo, options) {
    // Clone coverageInfo to prevent mutating the passed in data
    this.coverageInfo = clone(coverageInfo)
    this._parseAndIsolate(options)
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

  rewritePath (path, options) {
    // generate a new path relative to ./coverage/js.
    // this would be around where you'd use mkdirp.

    let str = ``
    let parsedPath = this.parsePath(path)
    let isInline = false
    let optionsDir
    let fixPath

    // fix path
    optionsDir = (options && options.hasOwnProperty('output_dir')) ? options.output_dir : storageDir
    fixPath = _utils.fixDir(optionsDir)+'/js'

    // resolve path
    fixPath = pathLib.resolve(process.cwd(), fixPath)

    // Special case: when html present, strip and return specialized string
    if (pathLib.extname(parsedPath) === '.html') {
      isInline = true
      parsedPath = pathLib.resolve(fixPath, parsedPath + 'puppeteerTemp-inline')
    } else {
      parsedPath = pathLib.resolve(fixPath, pathLib.dirname(parsedPath), pathLib.basename(parsedPath, '.js'))
    }
    
    mkdirp.sync(fixPath)
    
    if (fs.existsSync(parsedPath + '.js') && isInline) {
      if (!Number.isInteger(iterator[parsedPath])) {
        iterator[parsedPath] = 1
      } else {
        iterator[parsedPath]++
      }
      str = `${parsedPath}-${iterator[parsedPath]}.js`
      
    } else {
      str = `${parsedPath}.js`
    }
    
    return str
  }

  _parseAndIsolate (options) {
    for (let i = 0; i < this.coverageInfo.length; i++) {
      let path = this.rewritePath(this.coverageInfo[i].url, options)

      this.coverageInfo[i].originalUrl = this.coverageInfo[i].url
      this.coverageInfo[i].url = path

      mkdirp.sync(pathLib.parse(path).dir)

      let optionsBackup = (options && options.hasOwnProperty('backup')) ? options.backup : false
      if(optionsBackup && fs.existsSync(path))
      {
          // get current time
          let now_str = _utils.now();

          // rename file
          let path_parse_obj = pathLib.parse(path);
          let path_bak_dir = path_parse_obj.dir+'/_bak'; 
          let path_bak = path_bak_dir+'/'+path_parse_obj.name+'.'+now_str+path_parse_obj.ext;

          // copy
          mkdirp.sync(path_bak_dir)
          fs.copyFileSync(path, path_bak)
      }

      fs.writeFileSync(path, this.coverageInfo[i].text)
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
