const fs = require('fs')
const args = require('yargs').demandCommand(1).argv
const coverageInfo = require(args._[0])

const PuppeteerToIstanbul = require('./lib/puppeteer-to-istanbul')

const pti = PuppeteerToIstanbul(coverageInfo)
pti.writeIstanbulFormat()