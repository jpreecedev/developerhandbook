import * as React from 'react'
import Helmet from 'react-helmet'
import Jumbotron from '../components/Jumbotron'
import PostOverview from '../components/PostOverview'
import Pagination from '../components/Pagination'
import { CATEGORIES_MAP } from '../utils/categories'

function BlogIndex({ data }) {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges
  return (
    <div>
      <Helmet title={siteTitle} />
      <Jumbotron title="Cleaner code, better code." />
      <main role="main" className="container">
        {posts.map(({ node }) => {
          const title = node.frontmatter.title
          const category = node.frontmatter.categories[0]
          const mappedCategory = `${(category in CATEGORIES_MAP
            ? CATEGORIES_MAP[category]
            : category
          )
            .toLowerCase()
            .replace(' ', '-')}`

          return (
            <PostOverview
              title={title}
              slug={node.fields.slug}
              mappedCategory={mappedCategory}
              excerpt={node.excerpt}
            />
          )
        })}
        <Pagination />
      </main>
    </div>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 5, skip: 0, sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt(pruneLength: 1200)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            description
            categories
          }
        }
      }
    }
  }
`
