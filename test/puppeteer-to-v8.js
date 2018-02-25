/* globals describe, it, before */

var PuppeteerToV8 = require('../lib/puppeteer-to-v8')()

require('chai').should()

describe('puppeteer-to-v8', () => {
  let v8Coverage
  const fixture = require('./fixtures/function-coverage-missing')

  before(() => {
    PuppeteerToV8.setCoverageInfo(fixture)

    v8Coverage = PuppeteerToV8.convertCoverage()
  })

  it('translates ranges into v8 format', () => {
    // V8 coverage has ranges on a functions object, so check for that
    let firstV8Range = v8Coverage[0].functions[0].ranges[0]
    let firstFixtureRange = fixture[0].ranges[0]

    // The V8 range object has a few transformations, in particular
    // start -> startOffset, end -> endOffset and count = 1 being added
    firstV8Range.startOffset.should.eql(firstFixtureRange.start)
    firstV8Range.endOffset.should.eql(firstFixtureRange.end)
    firstV8Range.count.should.eql(1)
  })

  // look at the uuid library:
  // uuid.v4()
  it('generates scriptId', () => {
    // Ensures that the scriptId is of type 'number'
    (typeof v8Coverage[0].scriptId).should.eql('number')
  })
})
