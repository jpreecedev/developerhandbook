/* eslint-disable no-param-reassign */

const path = require('path')
const { getCategoryUrlFriendly, getDefaultGroups } = require('../src/utils/categories')

function getPostsForCategory(posts, category) {
  return posts.reduce((acc, current) => {
    const { categories, group } = current.node.frontmatter
    if (categories) {
      const hasCategory = categories.includes(category) || group === category
      if (hasCategory) {
        acc.push(current.node)
      }
    }
    return acc
  }, [])
}

function Stub(props) {
  const { createPage, posts, siteTitle, description } = props
  const stub = path.resolve('./src/templates/stub.jsx')

  posts.forEach(post => {
    if (!post.node.frontmatter.categories) {
      post.node.frontmatter.categories = ['Unsorted']
    }

    post.node.frontmatter.categories.forEach(category => {
      const categoryPath = `${getCategoryUrlFriendly(category)}`

      createPage({
        path: `/category/${categoryPath}`,
        component: stub,
        context: {
          posts: getPostsForCategory(posts, category),
          category,
          mappedCategory: categoryPath,
          siteTitle,
          description
        }
      })
    })
  })

  getDefaultGroups().forEach(group => {
    const categoryPath = `${getCategoryUrlFriendly(group)}`
    createPage({
      path: `/category/${categoryPath}`,
      component: stub,
      context: {
        posts: getPostsForCategory(posts, group),
        group,
        mappedCategory: categoryPath,
        siteTitle,
        description
      }
    })
  })

  return props
}

module.exports = Stub
