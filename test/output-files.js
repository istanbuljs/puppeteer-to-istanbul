/* globals describe, it */

const OutputFiles = require('../lib/output-files')

require('chai').should()

describe('puppeteer-to-v8', () => {
  describe('filename generation', () => {
    // we can use path.basename(path[, ext]).
    it('exposes a helper for generating a filename', () => {
      const outputFiles = OutputFiles() // you would pass the JSON blob in here.
      console.info(outputFiles.rewritePath('./foo/bar/hey.txt'))
    })

    it('appropriately handles colliding names', () => {

    })

    // call it something like indexHTML-inline-1.js
    it('appropriately handles inline JavaScript', () => {

    })
  })
})
