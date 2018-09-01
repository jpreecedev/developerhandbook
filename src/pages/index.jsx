import * as React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Jumbotron from '../components/Jumbotron'
import { CATEGORIES_MAP } from '../utils/categories'

function BlogIndex(props) {
  const siteTitle = get(props, 'data.site.siteMetadata.title')
  const posts = get(props, 'data.allMarkdownRemark.edges')

  return (
    <div>
      <Helmet title={siteTitle} />
      <Jumbotron title="Cleaner code, better code." />
      <main role="main" className="container">
        {posts.map(({ node }) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug
          const category = get(node, 'frontmatter.categories[0]') || 'Unsorted'
          const mappedCategory = `${(category in CATEGORIES_MAP
            ? CATEGORIES_MAP[category]
            : category
          )
            .toLowerCase()
            .replace(' ', '-')}`

          return (
            <div key={node.fields.slug}>
              <h2>
                <Link to={`/${mappedCategory}${node.fields.slug}`}>{title}</Link>
              </h2>
              <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
            </div>
          )
        })}
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
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
