const Redirects = [
  {
    from: '/career/devs-this-is-how-i-got-fit/null',
    to: '/career/devs-this-is-how-i-got-fit/'
  }
]

function getRedirects() {
  return Redirects.map(({ from, to }) => ({
    fromPath: from,
    toPath: to,
    isPermanent: true,
    redirectInBrowser: true
  }))
}

module.exports = getRedirects
