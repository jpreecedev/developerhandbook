const Redirects = require('./redirect-urls.json')

function getRedirects() {
  return Redirects.map(({ from, to }) => ({
    fromPath: from,
    toPath: to,
    isPermanent: true,
    redirectInBrowser: true
  }))
}

module.exports = getRedirects
