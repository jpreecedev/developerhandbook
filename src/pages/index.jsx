import * as React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Jumbotron from '../components/Jumbotron'
import PostOverview from '../components/PostOverview'
import Pagination from '../components/Pagination'
import Layout from '../components/Layout'
import { getCategoryUrlFriendly } from '../utils/categories'
import SocialProfile from '../components/StructuredData/SocialProfile'

function BlogIndex({ data, location }) {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout>
      <Helmet title={siteTitle}>
        <script type="application/ld+json">{SocialProfile()}</script>
      </Helmet>
      <Jumbotron title="Cleaner code, better code." />
      <main id="content" role="main" className="container">
        {posts.map(({ node }) => {
          const { title } = node.frontmatter
          const category = node.frontmatter.categories[0]

          return (
            <PostOverview
              key={node.fields.slug}
              title={title}
              slug={node.fields.slug}
              mappedCategory={`${getCategoryUrlFriendly(category)}`}
              excerpt={node.excerpt}
            />
          )
        })}
        <Pagination location={location} />
      </main>
    </Layout>
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
    allMarkdownRemark(
      limit: 5
      skip: 0
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
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
