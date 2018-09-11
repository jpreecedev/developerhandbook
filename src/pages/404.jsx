import * as React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import Jumbotron from '../components/Jumbotron'
import { getLink, getDistinctCategories } from '../utils/categories'

function NotFoundPage({ data }) {
  const siteTitle = data.site.siteMetadata.title
  const categories = getDistinctCategories(data.allMarkdownRemark.edges)

  return (
    <div>
      <Helmet title={siteTitle} />
      <Jumbotron title="Cleaner code, better code." />
      <main role="main" className="container">
        <h1>404</h1>
        <p>Sorry, we are not sure what to do with that request.</p>
        <p>Perhaps try one of these categories instead?</p>
        <ul>
          {categories.map(category => (
            <li key={category}>
              <Link className="nav-link" to={getLink(category)}>
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query NotFoundQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          frontmatter {
            categories
          }
        }
      }
    }
  }
`
