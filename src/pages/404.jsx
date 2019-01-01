import * as React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'
import Jumbotron from '../components/Jumbotron'
import { getLink, getDistinctCategories } from '../utils/categories'
import Layout from '../components/Layout'

function NotFoundPage({ data }) {
  const { siteTitle, description } = data.site.siteMetadata
  const categories = getDistinctCategories(data.allMarkdownRemark.edges)

  return (
    <Layout>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
      </Helmet>
      <Jumbotron title="Cleaner code, better code." />
      <main id="content" role="main" className="container">
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
    </Layout>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        siteTitle
        description
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
