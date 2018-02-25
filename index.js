const PuppeteerToIstanbul = require('./lib/puppeteer-to-istanbul')

module.exports = {
  write: (puppeteerFormat) => {
    const PuppeteerToIstanbul = require('./lib/puppeteer-to-istanbul')
    const pti = PuppeteerToIstanbul(puppeteerFormat)
    pti.writeIstanbulFormat()
  }
}