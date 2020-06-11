# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.2.2"></a>
## [1.4.0](https://www.github.com/istanbuljs/puppeteer-to-istanbul/compare/v1.3.1...v1.4.0) (2020-06-11)


### Features

* allow a custom storagePath ([#56](https://www.github.com/istanbuljs/puppeteer-to-istanbul/issues/56)) ([eb1aabc](https://www.github.com/istanbuljs/puppeteer-to-istanbul/commit/eb1aabc705ed10bfc5010128eb0fbaf69c17f777))
* allow the output file to not include the hostname ([#57](https://www.github.com/istanbuljs/puppeteer-to-istanbul/issues/57)) ([3a5b312](https://www.github.com/istanbuljs/puppeteer-to-istanbul/commit/3a5b312c0b02a9a2115a54ddd5095b3684257e78))

### [1.3.1](https://www.github.com/istanbuljs/puppeteer-to-istanbul/compare/v1.3.0...v1.3.1) (2020-05-11)


### Bug Fixes

* JSON encode URL ([8aa1c44](https://www.github.com/istanbuljs/puppeteer-to-istanbul/commit/8aa1c448252da995e7507272878eb00f44242215))

## [1.3.0](https://www.github.com/istanbuljs/puppeteer-to-istanbul/compare/v1.2.2...v1.3.0) (2020-04-14)


### Features

* add support for complete path reporting on files with http(s) protocol ([#17](https://www.github.com/istanbuljs/puppeteer-to-istanbul/issues/17)) ([149716b](https://www.github.com/istanbuljs/puppeteer-to-istanbul/commit/149716b5323b7b1025e43c17e577744601528f72))
* include original url in final output. ([#34](https://www.github.com/istanbuljs/puppeteer-to-istanbul/issues/34)) ([dec48a2](https://www.github.com/istanbuljs/puppeteer-to-istanbul/commit/dec48a25d0e2145ad44a485d591b1b58d1039091))


### Bug Fixes

* do not overwrite coverage after each test suite ([#42](https://www.github.com/istanbuljs/puppeteer-to-istanbul/issues/42)) ([848aa76](https://www.github.com/istanbuljs/puppeteer-to-istanbul/commit/848aa76533ce63f09a319d377b84163151505a5e))
* JSON being output was not valid ([de9109c](https://www.github.com/istanbuljs/puppeteer-to-istanbul/commit/de9109c794523eb8924ef24770503908650cc952))
* write to disk incrementally  ([#40](https://www.github.com/istanbuljs/puppeteer-to-istanbul/issues/40)) ([c57bd74](https://www.github.com/istanbuljs/puppeteer-to-istanbul/commit/c57bd741534813a7b42c8f300ddb61ef42086ef1))

## [1.2.2](https://github.com/istanbuljs/puppeteer-to-istanbul/compare/v1.2.1...v1.2.2) (2018-03-03)


### Bug Fixes

* we need to create the .nyc_output folder if it doesn't exist ([17c9e69](https://github.com/istanbuljs/puppeteer-to-istanbul/commit/17c9e69))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/istanbuljs/puppeteer-to-istanbul/compare/v1.2.0...v1.2.1) (2018-03-01)


### Bug Fixes

* clone should be a regular dependency not a dev dependency ([9dad7fc](https://github.com/istanbuljs/puppeteer-to-istanbul/commit/9dad7fc))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/istanbuljs/puppeteer-to-istanbul/compare/v1.1.0...v1.2.0) (2018-02-25)


### Bug Fixes

* file:// was missing ([0ec1a0a](https://github.com/istanbuljs/puppeteer-to-istanbul/commit/0ec1a0a))
* output format didn't quite match v8 ([#5](https://github.com/istanbuljs/puppeteer-to-istanbul/issues/5)) ([8b669f8](https://github.com/istanbuljs/puppeteer-to-istanbul/commit/8b669f8))


### Features

* add entry-point document ([#10](https://github.com/istanbuljs/puppeteer-to-istanbul/issues/10)) ([1f49ae5](https://github.com/istanbuljs/puppeteer-to-istanbul/commit/1f49ae5))
* Implemented JS local copying and renaming for conversion to v8 ([#6](https://github.com/istanbuljs/puppeteer-to-istanbul/issues/6)) ([be72192](https://github.com/istanbuljs/puppeteer-to-istanbul/commit/be72192))
* implemented puppeteer to V8 class ([#4](https://github.com/istanbuljs/puppeteer-to-istanbul/issues/4)) ([327c1ef](https://github.com/istanbuljs/puppeteer-to-istanbul/commit/327c1ef))



<a name="1.1.0"></a>
# 1.1.0 (2018-02-24)


### Features

* add command-line-tool for outputting coverage in puppeteer format ([#1](https://github.com/istanbuljs/puppeteer-to-istanbul/issues/1)) ([111354d](https://github.com/istanbuljs/puppeteer-to-istanbul/commit/111354d))
* initial library structure ([6b2deb5](https://github.com/istanbuljs/puppeteer-to-istanbul/commit/6b2deb5))
