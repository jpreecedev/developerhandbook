const Promise = require('bluebird')
const { createFilePath } = require('gatsby-source-filesystem')
const blogPosts = require('./setup/blogPosts')
const stubs = require('./setup/stub')
const pages = require('./setup/pages')

const pipe = (...functions) => args => functions.reduce((arg, fn) => fn(arg), args)

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    graphql(`
          {
            site {
              siteMetadata {
                title
              }
            }
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              limit: 1000
            ) {
              edges {
                node {
                  excerpt(pruneLength: 1200)
                  timeToRead
                  fields {
                    slug
                  }
                  frontmatter {
                    categories
                    title
                    description
                    date(formatString: "MMMM DD, YYYY")
                  }
                }
              }
            }
          }
        `).then(result => {
      if (result.errors) {
        console.log(result.errors)
        reject(result.errors)
      }

      // Create blog posts pages.
      const posts = result.data.allMarkdownRemark.edges
      const siteTitle = result.data.site.siteMetadata.title
      const args = { createPage, posts, siteTitle }

      pipe(blogPosts, stubs, pages)(args)

      resolve()
    })
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
