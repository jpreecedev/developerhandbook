const path = require('path')
const { CATEGORIES_MAP } = require('../src/utils/categories')

function getPostsForCategory(posts, category) {
  return posts.reduce((acc, current) => {
    const categories = current.node.frontmatter.categories
    if (categories) {
      const hasCategory = categories.includes(category)
      if (hasCategory) {
        acc.push(current.node)
      }
    }
    return acc
  }, [])
}

function stub(props) {
  const { createPage, posts, siteTitle } = props
  const stub = path.resolve('./src/templates/stub.jsx')

  posts.forEach(post => {
    if (!post.node.frontmatter.categories) {
      post.node.frontmatter.categories = ['Unsorted']
    }

    post.node.frontmatter.categories.forEach(category => {
      const mappedCategory =
        category in CATEGORIES_MAP ? CATEGORIES_MAP[category] : category

      const path = `${mappedCategory.toLowerCase().replace(' ', '-')}`

      createPage({
        path: `/category/${path}`,
        component: stub,
        context: {
          posts: getPostsForCategory(posts, category),
          category,
          mappedCategory: path,
          siteTitle
        }
      })
    })
  })

  return props
}

module.exports = stub
