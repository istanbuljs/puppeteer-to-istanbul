const path = require('path')
const fs = require('fs')
const OutputFiles = require('./output-files')
const mkdirp = require('mkdirp')
const PuppeteerToV8 = require('./puppeteer-to-v8')
const v8toIstanbul = require('v8-to-istanbul')
const _utils = require('./utils')

class PuppeteerToIstanbul {
  constructor (coverageInfo, options) {
    this.coverageInfo = coverageInfo
    this.puppeteerToConverter = OutputFiles(coverageInfo, options).getTransformedCoverage()
    this.puppeteerToV8Info = PuppeteerToV8(this.puppeteerToConverter).convertCoverage()
    this.options = options
  }

  setCoverageInfo (coverageInfo) {
    this.coverageInfo = coverageInfo
  }

  writeIstanbulFormat (options) {
    
    var fullJson = {}

    this.puppeteerToV8Info.forEach(jsFile => {
      const script = v8toIstanbul(jsFile.url)
      script.applyCoverage(jsFile.functions)

      let istanbulCoverage = script.toIstanbul()
      let keys = Object.keys(istanbulCoverage)

      fullJson[keys[0]] = istanbulCoverage[keys[0]]
    })

    var path_temp_str = (options && options.hasOwnProperty('output_dir')) ? options.output_dir : './.nyc_output',
        output_obj = _utils.genPath(path_temp_str),
        output_dir_str = output_obj['dir'],
        output_path_str = output_obj['path']
        ;

    output_dir_str = path.resolve(process.cwd(), output_dir_str)
    output_path_str = path.resolve(process.cwd(), output_path_str)

    mkdirp.sync(output_dir_str)
    fs.writeFileSync(output_path_str, JSON.stringify(fullJson), 'utf8')
  }
}

module.exports = function (coverageInfo, options) {
  return new PuppeteerToIstanbul(coverageInfo, options)
}
