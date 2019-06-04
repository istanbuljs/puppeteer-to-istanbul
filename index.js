const PuppeteerToIstanbul = require('./lib/puppeteer-to-istanbul')

module.exports = {
  write: (puppeteerFormat, outputDir) => {
    const pti = PuppeteerToIstanbul(puppeteerFormat, outputDir)
    pti.writeIstanbulFormat()
  }
}
