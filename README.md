# puppeteer-to-istanbul

convert from puppeteer's coverage output to a format that can be used by istanbul reports

## Plan of Action

1. build a shim that lets us run arbitrary JavaScript code in puppeteer (
   we can add this as a tool in the `./bin` folder).
2. write unit-tests for converting between puppeteer and v8 format.
3. write unit tests that verify outputting JavaScript files to disk.
4. profit.