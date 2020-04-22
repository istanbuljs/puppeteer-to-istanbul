// output JavaScript bundled in puppeteer output to format
// that can be eaten by Istanbul.

// TODO: Put function interfaces on this file

const fs = require('fs')
const mkdirp = require('mkdirp')
const clone = require('clone')
const pathLib = require('path')
const _utils = require('./utils')

const storagePath = './.nyc_output'

class OutputFiles {
  constructor (coverageInfo, options) {
    // Clone coverageInfo to prevent mutating the passed in data
    this.coverageInfo = clone(coverageInfo)
    this.iterator = 0
    this._parseAndIsolate(options)
    this.options = options
  }

  rewritePath (path, options) {
    // generate a new path relative to ./coverage/js.
    // this would be around where you'd use mkdirp.

    var str = ``

    // define option vars
    var options_output_dir_str = (options && options.hasOwnProperty('output_dir')) ? options.output_dir : storagePath
    var options_tamper_html_bool = (options && options.hasOwnProperty('tamper_html')) ? options.tamper_html : true
    var options_overwrite_bool = (options && options.hasOwnProperty('overwrite')) ? options.overwrite : false

    // update path
    var path_obj = _utils.genPath(options_output_dir_str)
    var fixPath = (path_obj && path_obj.hasOwnProperty('dir')) ? path_obj.dir : storagePath
    fixPath = pathLib.resolve(process.cwd(), fixPath)+'/js'
    
    // Get the last element in the path name
    var truncatedPath = pathLib.basename(path)

    // Special case: when html present, strip and return specialized string
    if (truncatedPath.includes('.html') && options_tamper_html_bool === true) {
      truncatedPath = pathLib.resolve(fixPath, truncatedPath) + 'puppeteerTemp-inline'
    } else {
      truncatedPath = truncatedPath.split('.js')[0]
      truncatedPath = pathLib.resolve(fixPath, truncatedPath)
    }
    mkdirp.sync(fixPath)
    if (fs.existsSync(truncatedPath + '.js') && !options_overwrite_bool) {
      this.iterator++
      str = `${truncatedPath}-${this.iterator}.js`
    } else {
      str = `${truncatedPath}.js`
    }
    return str
  }

  _parseAndIsolate (options) {
    for (var i = 0; i < this.coverageInfo.length; i++) {
      var path = this.rewritePath(this.coverageInfo[i].url, options)
      this.coverageInfo[i].url = path
      fs.writeFileSync(path, this.coverageInfo[i].text)
    }
  }

  getTransformedCoverage () {
    return this.coverageInfo
  }
}

module.exports = function (coverageInfo, options) {
  return new OutputFiles(coverageInfo, options)
}
