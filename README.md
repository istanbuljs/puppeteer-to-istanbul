# Puppeteer to Istanbul

[![Build Status](https://travis-ci.org/istanbuljs/puppeteer-to-istanbul.svg?branch=master)](https://travis-ci.org/istanbuljs/puppeteer-to-istanbul)
[![Coverage Status](https://coveralls.io/repos/github/istanbuljs/puppeteer-to-istanbul/badge.svg?branch=master)](https://coveralls.io/github/istanbuljs/puppeteer-to-istanbul?branch=master)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

Convert coverage from the format outputted by [puppeteer](https://developers.google.com/web/tools/puppeteer/) to a format consumable by [Istanbul][istanbul].

## Usage

### to output coverage in Istanbul format with puppeteer

1. install _puppeteer-to-istanbul_, `npm i puppeteer-to-istanbul`.
2. run your code in puppeteer with coverage enabled:

    ```js
    const pti = require('puppeteer-to-istanbul')

    // Enable both JavaScript and CSS coverage
    await Promise.all([
      page.coverage.startJSCoverage(),
      page.coverage.startCSSCoverage()
    ]);
    // Navigate to page
    await page.goto('https://example.com');
    // Disable both JavaScript and CSS coverage
    const [jsCoverage, cssCoverage] = await Promise.all([
      page.coverage.stopJSCoverage(),
      page.coverage.stopCSSCoverage(),
    ]);
    const coverage = [...jsCoverage, ...cssCoverage];
    pti.write(jsCoverage)
    ```
    
This will run Istanbul's HTML Reporting through [nyc][nyc] based on the output of the converted `your_puppeteer_coverage.json`.
    
### to run istanbul reports

1. install nyc, `npm i nyc`.
2. use nyc's report functionality:

    ```bash
    npm run report --reporter=html
    ```
    
_puppeteer-to-istanbul_ outputs temporary files in a format that can be
consumed by nyc.

see [istanbul](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib) for a list of possible reporters.

## Project Website

To learn about the conversion process between Puppeteer to Istanbul, and everything in between, visit the project's [website](https://hack-illinois-team-istanbul.herokuapp.com/).

## Contributing

If you see an issue with Puppeteer to Istanbul, please open an issue! If you want to help improve Puppeteer to Istanbul, please fork the repository and open a pull request with your changes.

Make sure to review our [contributing guide][contributing]

[coveralls]: https://github.com/GoogleChrome/puppeteer
[istanbul]: https://github.com/istanbuljs/istanbuljs
[nyc]: https://github.com/istanbuljs/nyc
[contributing]: contributing.md
