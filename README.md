# Puppeteer to Istanbul

[![Build Status](https://travis-ci.org/istanbuljs/puppeteer-to-istanbul.svg?branch=master)](https://travis-ci.org/istanbuljs/puppeteer-to-istanbul)
[![Coverage Status](https://coveralls.io/repos/github/istanbuljs/puppeteer-to-istanbul/badge.svg?branch=master)](https://coveralls.io/github/istanbuljs/puppeteer-to-istanbul?branch=master)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

Convert coverage from the format outputted by [puppeteer](https://developers.google.com/web/tools/puppeteer/) to a format consumable by [Istanbul][istanbul].

## Usage

### To Output Coverage in Istanbul Format with Puppeteer

1. install _puppeteer_, `npm i puppeteer --save`.
2. install _puppeteer-to-istanbul_, `npm i puppeteer-to-istanbul --save`.
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
      pti.write(jsCoverage)
      await browser.close()
    })()
    ```

### To Run Istanbul Reports

1. install nyc, `npm i nyc -g`.
2. use nyc's report functionality:

    ```bash
    nyc report --reporter=html
    ```

_puppeteer-to-istanbul_ outputs temporary files in a format that can be
consumed by nyc.

see [istanbul](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib) for a list of possible reporters.

## Contributing

If you see an issue with Puppeteer to Istanbul, please open an issue! If you want to help improve Puppeteer to Istanbul, please fork the repository and open a pull request with your changes.

Make sure to review our [contributing guide][contributing] for specific guidelines on contributing.

[coveralls]: https://github.com/GoogleChrome/puppeteer
[istanbul]: https://github.com/istanbuljs/istanbuljs
[nyc]: https://github.com/istanbuljs/nyc
[contributing]: https://github.com/istanbuljs/puppeteer-to-istanbul/blob/master/CONTRIBUTING.md
