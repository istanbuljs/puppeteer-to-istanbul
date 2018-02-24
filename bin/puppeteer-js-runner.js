const argv = require('yargs').argv

const scriptToRun = argv.file || 'test/sample_js/sample1.js'

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Enable both JavaScript and CSS coverage
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage()
  ]);

  // Script src goes up two directories, since it is in /bin/tmp
  // This makes it so the script is specified from the project directory level
  const pageHtml = `
  <html>
  <head>
    <script src='../../${scriptToRun}'></script>
  </head>
  </html>`;

  fs.writeFileSync(__dirname + '/tmp/puppeteerTemp.html', pageHtml, 'utf8');

  // Navigate to page
  let url = 'file:///' + __dirname + '/tmp/puppeteerTemp.html';
  console.log(url);
  await page.goto(url);

  // Disable both JavaScript and CSS coverage
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);

  fs.writeFileSync(__dirname + '/tmp/output.json', JSON.stringify(jsCoverage, null, 2), 'utf8');

  let totalBytes = 0;
  let usedBytes = 0;
  const coverage = [...jsCoverage, ...cssCoverage];
  for (const entry of coverage) {
    totalBytes += entry.text.length;
    for (const range of entry.ranges)
      usedBytes += range.end - range.start - 1;
  }
  console.log(`Bytes used: ${usedBytes / totalBytes * 100}%`);

  await browser.close();
})();
