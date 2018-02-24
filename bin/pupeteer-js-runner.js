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

  // Navigate to page
  await page.goto('https://www.npmjs.com/');

  // Disable both JavaScript and CSS coverage
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);

  fs.writeFileSync('output.json', JSON.stringify(jsCoverage, null, 2), 'utf8');

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
