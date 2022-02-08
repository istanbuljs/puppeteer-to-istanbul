const PuppeteerToIstanbul = require('./lib/puppeteer-to-istanbul')
const PuppeteerToC8 = require('./lib/puppeteer-to-c8')

module.exports = {
  write: (puppeteerFormat, options) => {
    const pti = PuppeteerToIstanbul(puppeteerFormat, options)
    pti.writeIstanbulFormat(options)
  },
  writeC8: (puppeteerFormat, options) => {
    const ptc8 = PuppeteerToC8(puppeteerFormat, options)
    ptc8.writeC8Format(options)
  }
}
