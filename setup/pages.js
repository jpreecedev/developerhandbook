const path = require('path')

function pages(props) {
  const { createPage, posts, siteTitle } = props
  const stub = path.resolve('./src/templates/stub.jsx')

  let i
  let j
  let k
  let temparray
  const chunk = 5

  for (i = 5, j = posts.length, k = 2; i < j; i += chunk, k += 1) {
    temparray = posts.slice(i, i + chunk)

    temparray.forEach(() => {
      const path = `/page/${k}`
      const category = `Page ${k}`

      createPage({
        path,
        component: stub,
        context: {
          posts: temparray.map(post => post.node),
          category,
          siteTitle
        }
      })
    })
  }

  return props
}

module.exports = pages
