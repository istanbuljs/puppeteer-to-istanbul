/* globals describe, it */

const OutputFiles = require('../lib/output-files')
const rimraf = require('rimraf')
const fs = require('fs')

require('chai').should()

describe('puppeteer-to-v8', () => {
  describe('filename generation', () => {

    beforeEach(() => {
      rimraf.sync('./coverage');
    })

    // we can use path.basename(path[, ext]).
    it('exposes a handler that appropriately handles colliding names', () => {
      const outputFiles = OutputFiles(require('./fixtures/block-else-not-covered.json'))
      console.log('Test');
      var a = outputFiles.rewritePath('./sample_js/block-else-not-covered-1.js')
      a.should.eql('./coverage/js/block-else-not-covered-1.js')
    })

    it('handle multiple files with same name, and replace in json', () => {
      // Input from the fixture should be JSONified already
      const fixture = require('./fixtures/function-coverage-full-duplicate.json')
      const outputFiles = OutputFiles(fixture).coverageInfo
      console.log(outputFiles)
      outputFiles[0].url.should.eql(fixture[0].url)
      outputFiles[1].url.should.eql(fixture[0].url
        .replace('.js', '-1.js'))
    })

    // call it something like indexHTML-inline-1.js
    it('appropriately handles inline JavaScript', () => {
      
    })

    after(() => {
      rimraf.sync('./coverage');
    })


  })
})
