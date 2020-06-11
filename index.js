const PuppeteerToIstanbul = require('./lib/puppeteer-to-istanbul')

module.exports = {
  write: (puppeteerFormat, options) => {
    const pti = PuppeteerToIstanbul(puppeteerFormat, options)
    pti.writeIstanbulFormat(options)
  }
}
