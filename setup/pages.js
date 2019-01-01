/* eslint-disable no-loop-func */

const path = require('path')

function pages(props) {
  const { createPage, posts, siteTitle, description } = props
  const stub = path.resolve('./src/templates/stub.jsx')

  let i
  let j
  let k
  let temparray
  const chunk = 5

  for (i = 5, j = posts.length, k = 2; i < j; i += chunk, k += 1) {
    temparray = posts.slice(i, i + chunk)

    temparray.forEach(() => {
      const pagePath = `/page/${k}`
      const category = `Page ${k}`

      createPage({
        path: pagePath,
        component: stub,
        context: {
          posts: temparray.map(post => post.node),
          category,
          siteTitle,
          description
        }
      })
    })
  }

  return props
}

module.exports = pages
