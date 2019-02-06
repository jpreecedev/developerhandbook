/* eslint-disable no-console */

const Promise = require('bluebird')
const { createFilePath } = require('gatsby-source-filesystem')
const blogPosts = require('./setup/blogPosts')
const stubs = require('./setup/stub')
const pages = require('./setup/pages')
const getRedirects = require('./setup/redirects')

const pipe = (...functions) => args => functions.reduce((arg, fn) => fn(arg), args)

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  return new Promise((resolve, reject) => {
    graphql(`
      {
        site {
          siteMetadata {
            siteTitle
            description
          }
        }
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              excerpt(pruneLength: 500)
              timeToRead
              fields {
                slug
              }
              frontmatter {
                categories
                title
                description
                date(formatString: "DD MMMM, YYYY")
                seriesTitle
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
      const { siteTitle, description } = result.data.site.siteMetadata
      const args = { createPage, posts, siteTitle, description }

      pipe(
        blogPosts,
        stubs,
        pages
      )(args)

      getRedirects().forEach(redirect => createRedirect(redirect))

      resolve()
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value
    })
  }
}
