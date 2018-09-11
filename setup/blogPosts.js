const path = require('path')
const { getCategoryUrlFriendly } = require('../src/utils/categories')

function blogPosts(props) {
  const { createPage, posts } = props
  const blogPost = path.resolve('./src/templates/blog-post.jsx')

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    if (!post.node.frontmatter.categories) {
      post.node.frontmatter.categories = ['Unsorted']
    }

    post.node.frontmatter.categories.forEach(category => {
      createPage({
        path: `${getCategoryUrlFriendly(category)}${post.node.fields.slug}`,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          timeToRead: post.node.timeToRead,
          previous,
          next
        }
      })
    })
  })

  return props
}

module.exports = blogPosts
