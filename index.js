const PuppeteerToIstanbul = require('./lib/puppeteer-to-istanbul')

module.exports = {
  write: async (puppeteerFormat, options) => {
    const pti = PuppeteerToIstanbul(puppeteerFormat, options)
    await pti.writeIstanbulFormat(options)
  }
}
