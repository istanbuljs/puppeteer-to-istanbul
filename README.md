# Puppeteer to Istanbul

[![Build Status](https://travis-ci.org/istanbuljs/puppeteer-to-istanbul.svg?branch=master)](https://travis-ci.org/istanbuljs/puppeteer-to-istanbul)
[![Coverage Status](https://coveralls.io/repos/github/istanbuljs/puppeteer-to-istanbul/badge.svg?branch=master)](https://coveralls.io/github/istanbuljs/puppeteer-to-istanbul?branch=master)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

Convert coverage output from [Coveralls][coveralls] to an [Istanbul][istanbul] format

## Usage

Puppeteer to Istanbul isn't available on NPM yet, so to use it, first clone the repository. Then run the following commands:

```
node run.js your_puppeteer_coverage.json
./node_modules/.bin/nyc report --reporter=html
```

This will run Istanbul's HTML Reporting through [nyc][nyc] based on the output of the converted `your_puppeteer_coverage.json`.

To get a JSON output of your Puppeteer coverage, take a look at [this Puppeteer example](https://github.com/GoogleChrome/puppeteer/blob/v1.1.0/docs/api.md#class-coverage) of pulling coverage, and simply write the `jsCoverage` object out to a JSON file.

## Project Website

To learn about the conversion process between Puppeteer to Istanbul, and everything in between, visit the project's [website](https://hack-illinois-team-istanbul.herokuapp.com/).

## Contributing

If you see an issue with Puppeteer to Istanbul, please open an issue! If you want to help improve Puppeteer to Istanbul, please fork the repository and open a pull request with your changes.

Make sure to review our [contributing guide][contributing]

[coveralls]: https://github.com/GoogleChrome/puppeteer
[istanbul]: https://github.com/istanbuljs/istanbuljs
[nyc]: https://github.com/istanbuljs/nyc
[contributing]: contributing.md
