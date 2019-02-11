const Redirects = [
  {
    from: '/career/devs-this-is-how-i-got-fit/null',
    to: '/career/devs-this-is-how-i-got-fit/'
  },
  {
    from: '/c-sharp/create-restful-api-authentication-using-web-api-jwt/null',
    to: '/c-sharp/create-restful-api-authentication-using-web-api-jwt/'
  },
  {
    from: '/entity-framework/',
    to: '/category/entity-framework/'
  },
  {
    from: '/wpf-mvvm/',
    to: '/category/wpf-mvvm/'
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
