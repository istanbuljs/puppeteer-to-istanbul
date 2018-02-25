// output JavaScript bundled in puppeteer output to format
// that can be eaten by Istanbul.

const fs = require('fs')
const mkdirp = require('mkdirp')

class OutputFiles {
  constructor (coverageInfo) {
    this.coverageInfo = coverageInfo
    this.iterator = 0
    this.parseAndIsolate()
    this.output()
  }

  rewritePath (path) {
    // generate a new path relative to ./coverage/js.
    // this would be around where you'd use mkdirp.

    var str = ``

    // Get the last element in the path name
    var truncatedPath = path.split('/')[path.split('/').length - 1]
    truncatedPath = truncatedPath.split(".js")[0]
    truncatedPath = './coverage/js/' + truncatedPath
    mkdirp.sync('./coverage/js')
    // const fd = fs.openSync(truncatedPath, 'r+');
    if (fs.existsSync(truncatedPath + '.js'))  {
      this.iterator++
      str = `${truncatedPath}-${this.iterator}.js`
      return str
    }
    else {
      str = `${truncatedPath}.js`
      return str
    }
    return str
  }

  parseAndIsolate () {
    for (var i = 0; i < this.coverageInfo.length; i++) {
      var path = this.rewritePath(this.coverageInfo[i]['url'])
      this.coverageInfo[i]['url'] = path
      fs.writeFileSync(path, this.coverageInfo[i]['text'])
    }
    //
    //
    //
    // }
    // for (key in keys) {
    //   if (key == "url") {
    //     for (item in key) {
    //       key[item] = rewritePath(key[item])
    //     }
    //   }
    //   else if (key == "text") {
    //     // Sanity check, should not be here if this was not handled in time
    //     for (item in key) {
    //       fs.writeFileSync(path, key[item], 'utf8')
    //     }
    //   }
    // }
    // this.coverageInfo = JSON.stringify(cInf);
  }

  output () {
    return this.coverageInfo
  }
}

module.exports = function (coverageInfo) {
  return new OutputFiles(coverageInfo)
}
