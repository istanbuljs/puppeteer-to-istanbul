#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
require('yargs') // eslint-disable-line
  .usage('$0 <input> <output>', 'output coverage data from puppeteer', (yargs) => {
    yargs
      .positional('input', {
        default: 'test/sample_js/sample1.js',
        describe: 'file to load into headless chromium'
      })
      .positional('output', {
        default: 'test/fixtures/out.json'
      })
  }, (argv) => {
    outputPuppeteerCoverage(
      path.resolve(process.cwd(), argv.input),
      path.resolve(process.cwd(), argv.output)
    )
  })
  .help()
  .demandCommand(1)
  .argv

async function outputPuppeteerCoverage (input, output) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Enable both JavaScript and CSS coverage
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage()
  ])

  // Script src goes up two directories, since it is in /bin/tmp
  // This makes it so the script is specified from the project directory level
  const pageHtml = `
  <html>
  <head>
    <script src='../../${input}'></script>
  </head>
  </html>`

  fs.writeFileSync('/tmp/puppeteerTemp.html', pageHtml, 'utf8')

  // Navigate to page
  let url = 'file:///' + '/tmp/puppeteerTemp.html'
  await page.goto(url)

  // Disable both JavaScript and CSS coverage
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage()
  ])

  fs.writeFileSync(output, JSON.stringify(jsCoverage, null, 2), 'utf8')

  let totalBytes = 0
  let usedBytes = 0
  const coverage = [...jsCoverage, ...cssCoverage]
  for (const entry of coverage) {
    totalBytes += entry.text.length
    for (const range of entry.ranges) { usedBytes += range.end - range.start - 1 }
  }
  console.log(`Bytes used: ${usedBytes / totalBytes * 100}%`)

  await browser.close()
}
