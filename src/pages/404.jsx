import * as React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Jumbotron from '../components/Jumbotron'
import Layout from '../components/Layout'

function NotFoundPage({ data, location }) {
  React.useEffect(() => {
    const { pathname, hostname } = location
    if (hostname !== 'localhost') {
      Sentry.captureMessage(`404! ${pathname}`)
    }
  }, [])

  const { siteTitle, description } = data.site.siteMetadata

  return (
    <Layout>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
      </Helmet>
      <Jumbotron />
      <main id="content" role="main" className="container">
        <h1>404</h1>
        <p>Sorry, we are not sure what to do with that request.</p>
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
  }
`
