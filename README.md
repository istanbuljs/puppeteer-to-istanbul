# Puppeteer to Istanbul Extra

Convert coverage from the format outputted by [puppeteer](https://developers.google.com/web/tools/puppeteer/) to a format consumable by [Istanbul][istanbul].


## Introduction

*Puppeteer-to-istanbul-extra* is a fork of [puppeteer-to-istanbul](https://github.com/istanbuljs/puppeteer-to-istanbul). It is basically the same as, but provides additional functionality.


## Usage

### To Output Coverage in Istanbul Format with Puppeteer

1. install _puppeteer_, `npm i -D puppeteer`.
2. install _puppeteer-to-istanbul-extra_, `npm i -D puppeteer-to-istanbul-extra`.
3. run your code in puppeteer with coverage enabled:

    ```js
    (async () => {
      const pti = require('puppeteer-to-istanbul-extra')
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
      var options_obj = {output_dir: './.nyc_output'};
      pti.write([...jsCoverage, ...cssCoverage], options_obj)
      await browser.close()
    })()
    ```


### Options

puppeteer-to-istanbul-extra provides options for use with the `write` method. 

Below are the list of available options:

| Option name | Description | Type | Default |
| ----------- | ----------- | ---- | ------- |
| `output_dir` | DIrectory to output coverage information | `String` | `./.nyc_output` |
| `tamper_html` | Will append a suffix to the file name if `html` appears within it. Setting this option to false will disable this functionality  | `Boolean` | `false` |
| `overwrite` | List of extensions that nyc should attempt to handle in addition to `.js` | `Boolean` | `true` |


### To Check Istanbul Reports

1. install nyc, `npm i nyc -g`.
2. use nyc's report functionality:

    ```bash
    nyc report --reporter=html
    ```

_puppeteer-to-istanbul-extra_ outputs temporary files in a format that can be consumed by nyc.

see [istanbul](https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib) for a list of possible reporters.


## Extras

Please see [Puppeteer-to-Istanbul](https://github.com/istanbuljs/puppeteer-to-istanbul) for additional information.
