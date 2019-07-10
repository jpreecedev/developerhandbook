import * as React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'

function NotFoundPage({ data }) {
  const { siteTitle, description } = data.site.siteMetadata

  return (
    <>
      <Layout>404 - Page Not Found!</Layout>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
      </Helmet>
      <main id="content" role="main" className="container">
        <p>Sorry, we are not sure what to do with that request.</p>
      </main>
    </>
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
  }
`
