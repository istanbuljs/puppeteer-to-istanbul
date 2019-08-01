/* globals describe, it, beforeEach */

const OutputFiles = require('../lib/output-files')
const rimraf = require('rimraf')
const pathLib = require('path')
const url = require('url')

const storagePath = '.nyc_output/js'
const storagePathTop = '.nyc_output'

require('chai').should()

describe('output-files', () => {
  beforeEach(cleanupCoverage)

  // we can use path.basename(path[, ext]).
  it('exposes a handler that appropriately handles colliding names', () => {
    const outputFiles = OutputFiles(require('./fixtures/block-else-not-covered.json'))

    // Since block-else-not-covered was generated by the above line, this
    // should make a new file with -1 appended to the name
    var newPath = outputFiles.rewritePath('./sample_js/block-else-not-covered-1.js')
    newPath.should.include(storagePath + '/sample_js/block-else-not-covered-1.js')
  })

  it('handle multiple files with same name, and replace in json', () => {
    // Input from the fixture should be JSONified already
    const fixture = require('./fixtures/function-coverage-full-duplicate.json')
    const coverageInfo = OutputFiles(fixture).getTransformedCoverage()

    // Fixture should and output coverage should not be in the same place
    coverageInfo[0].url.should.not.eql(fixture[0].url)
    coverageInfo[1].url.should.not.eql(fixture[1].url)

    coverageInfo[0].url.should.eql(movedUrl(fixture[0].url))
    coverageInfo[1].url.should.eql(movedUrl(fixture[0].url.replace('.js', '-1.js')))
  })

  // call it something like indexHTML-inline-1.js
  it('appropriately handles only inline JavaScript', () => {
    const fixture = require('./fixtures/inline-script-coverage.json')
    const coverageInfo = OutputFiles(fixture).getTransformedCoverage()

    coverageInfo[0].url.should.include('puppeteerTemp-inline.js')
  })

  it('appropriately handles inline and external JavaScript', () => {
    const fixture = require('./fixtures/inline-and-external-script-coverage.json')
    const coverageInfo = OutputFiles(fixture).getTransformedCoverage()

    coverageInfo[0].url.should.eql(movedUrl(fixture[0].url))
    coverageInfo[1].url.should.include('puppeteerTemp-inline.js')
  })

  it('appropriately handles two cases of inline JavaScript', () => {
    const fixture = require('./fixtures/two-inline.json')
    const coverageInfo = OutputFiles(fixture).getTransformedCoverage()

    coverageInfo[0].url.should.include('puppeteerTemp-inline.js')
    coverageInfo[1].url.should.include('puppeteerTemp-inline-1.js')
  })

  it('appropriately handles modules required via http/https', () => {
    const fixture = require('./fixtures/http-es6-modules.json')
    const coverageInfo = OutputFiles(fixture).getTransformedCoverage()

    coverageInfo[0].url.should.include('js/index.js')
    coverageInfo[1].url.should.include('js/utils/doc_ready.js')
    coverageInfo[2].url.should.include('js/models/record.js')
    coverageInfo[3].url.should.include('js/views/record.js')
  })

  it('maintains original url in output', () => {
    const fixture = require('./fixtures/http-es6-modules.json')
    const coverageInfo = OutputFiles(fixture).getTransformedCoverage()

    coverageInfo[0].originalUrl.should.equal(fixture[0].url)
    coverageInfo[1].originalUrl.should.equal(fixture[1].url)
    coverageInfo[2].originalUrl.should.equal(fixture[2].url)
    coverageInfo[3].originalUrl.should.equal(fixture[3].url)
  })

  function cleanupCoverage () {
    rimraf.sync(storagePathTop)
  }

  // Takes in a script and rewrites it to the path we expect in /coverage/js
  function movedUrl (path) {
    var urlPath = new url.URL(path)
    urlPath = urlPath.pathname.substring(1)
    return pathLib.resolve(storagePath, urlPath)
  }
})
