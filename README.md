# Puppeteer to Istanbul

[![Build Status](https://travis-ci.org/istanbuljs/puppeteer-to-istanbul.svg?branch=master)](https://travis-ci.org/istanbuljs/puppeteer-to-istanbul)
[![Coverage Status](https://coveralls.io/repos/github/istanbuljs/puppeteer-to-istanbul/badge.svg?branch=master)](https://coveralls.io/github/istanbuljs/puppeteer-to-istanbul?branch=master)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

Convert coverage from the format outputted by [puppeteer](https://developers.google.com/web/tools/puppeteer/) to a format consumable by [Istanbul][istanbul].

## Usage

### To Output Coverage in Istanbul Format with Puppeteer

1. install _puppeteer_, `npm i -D puppeteer`.
2. install _puppeteer-to-istanbul_, `npm i -D puppeteer-to-istanbul`.
3. run your code in puppeteer with coverage enabled:

    ```js
    (async () => {
      const pti = require('puppeteer-to-istanbul')
      const puppeteer = require('puppeteer')
      const browser = await puppeteer.launch()
      const page = await browser.newPage()

      // Enable both JavaScript and CSS coverage
      await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage()
      ]);
      // Navigate to page
      await page.goto('https://www.google.com');
      // Disable both JavaScript and CSS coverage
      const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage(),
      ]);
      await pti.write([...jsCoverage, ...cssCoverage], { includeHostname: true , storagePath: './.nyc_output' })
      await browser.close()
    })()
    ```

### To Check Istanbul Reports

1. install nyc, `npm i nyc -g`.
2. use nyc's report functionality:

    ```bash
    nyc report --reporter=html
    ```

_puppeteer-to-istanbul_ outputs temporary files in a format that can be
consumed by nyc.

see [istanbul](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib) for a list of possible reporters.

## Contributing

The best way to get started with Puppeteer to Istanbul is by installing it for yourself and running tests.
PTI requires the most recent build of __v8toistanbul__ to function properly, so start by running `npm install`. 

Next, ensure that all tests are passing before continuing by running `npm test` (or equivalently, `npm t`). This should generate a report that gives the same coverage as seen on this README. 

Note that a majority of the tests run against pre-generated fixtures, or JSON snippets, that come from Puppeteer's raw output. These are located in the `\test\fixtures` area. To generate one of your own, write or use one of the scripts in the test area `test\sample_js`, and run `bin/puppeteer-js-runner.js` through node, like so: 

`node bin/puppeteer-js-runner.js --file=/test/sample_js/sample2.js`.

If you see an issue with Puppeteer to Istanbul, please open an issue! If you want to help improve Puppeteer to Istanbul, please fork the repository and open a pull request with your changes.

Make sure to review our [contributing guide][contributing] for specific guidelines on contributing.

[coveralls]: https://github.com/GoogleChrome/puppeteer
[istanbul]: https://github.com/istanbuljs/istanbuljs
[nyc]: https://github.com/istanbuljs/nyc
[contributing]: https://github.com/istanbuljs/puppeteer-to-istanbul/blob/master/CONTRIBUTING.md
