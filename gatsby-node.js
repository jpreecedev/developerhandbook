const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { CATEGORIES_MAP } = require('./src/utils/categories')

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.jsx')
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              limit: 1000
            ) {
              edges {
                node {
                  timeToRead
                  fields {
                    slug
                  }
                  frontmatter {
                    categories
                    title
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges

        _.each(posts, (post, index) => {
          const previous = index === posts.length - 1 ? null : posts[index + 1].node
          const next = index === 0 ? null : posts[index - 1].node

          if (!post.node.frontmatter.categories) {
            post.node.frontmatter.categories = ['Unsorted']
          }

          _.each(post.node.frontmatter.categories, category => {
            const mappedCategory =
              category in CATEGORIES_MAP ? CATEGORIES_MAP[category] : category

            createPage({
              path: `${mappedCategory.toLowerCase().replace(' ', '-')}${
                post.node.fields.slug
              }`,
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
      })
    )
  })
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
