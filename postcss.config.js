const postcssImport = require(`postcss-import`)
const postcssCssNext = require(`postcss-cssnext`)
const postcssReporter = require(`postcss-reporter`)

module.exports = () => ({
  plugins: [postcssImport(), postcssCssNext(), postcssReporter()]
})
