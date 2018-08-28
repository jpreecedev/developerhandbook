const Promise = require('bluebird')
const { createFilePath } = require('gatsby-source-filesystem')
const blogPosts = require('./setup/blogPosts')
const stubs = require('./setup/stub')

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return blogPosts({ createPage, graphql }).then(({ posts, siteTitle }) =>
    stubs({ siteTitle, posts, createPage, graphql })
  )
}

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value
    })
  }
}
