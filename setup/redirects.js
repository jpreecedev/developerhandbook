const Redirects = require('./redirect-urls.json')

function getRedirects() {
  return Redirects.map(({ from, to }) => {
    return [
      {
        fromPath: from,
        toPath: to,
        isPermanent: true,
        redirectInBrowser: true
      },
      {
        fromPath: `${from}null`,
        toPath: to,
        isPermanent: true,
        redirectInBrowser: true
      },
      {
        fromPath: from.substr(0, from.length - 1),
        toPath: to,
        isPermanent: true,
        redirectInBrowser: true
      }
    ]
  }).flat()
}

module.exports = getRedirects
