const a = true

if (false) {
  console.info('hello world!')
} else if (a || !a) {
  console.info('i did run')
} else {
  console.info('i should not run')
}