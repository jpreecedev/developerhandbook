const Promise = require('bluebird')
const path = require('path')
const { CATEGORIES_MAP } = require('../src/utils/categories')

function blogPosts({ createPage, graphql }) {
  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.jsx')
    resolve(
      graphql(
        `
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
                    date(formatString: "MMMM DD, YYYY")
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

        posts.forEach((post, index) => {
          const previous = index === posts.length - 1 ? null : posts[index + 1].node
          const next = index === 0 ? null : posts[index - 1].node

          if (!post.node.frontmatter.categories) {
            post.node.frontmatter.categories = ['Unsorted']
          }

          post.node.frontmatter.categories.forEach(category => {
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

        return {
          posts,
          siteTitle: result.data.site.siteMetadata.title
        }
      })
    )
  })
}

module.exports = blogPosts
