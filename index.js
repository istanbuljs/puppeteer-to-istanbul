const PuppeteerToIstanbul = require('./lib/puppeteer-to-istanbul')

module.exports = {
  write: (puppeteerFormat, options) => {
    const pti = PuppeteerToIstanbul(puppeteerFormat)
    return pti.writeIstanbulFormat(options)
  }
}
