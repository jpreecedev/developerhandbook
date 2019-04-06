import * as React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import PostOverview from '../components/PostOverview'
import Pagination from '../components/Pagination'
import Layout from '../components/Layout'
import { getCategoryUrlFriendly } from '../utils/categories'
import SocialProfile from '../components/StructuredData/SocialProfile'

function BlogIndex({ data, location }) {
  const { siteTitle, description } = data.site.siteMetadata
  const posts = data.allMarkdownRemark.edges.map(edge => edge.node)

  return (
    <Layout>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
        <script type="application/ld+json">{SocialProfile()}</script>
      </Helmet>
      <main id="content" role="main" className="mb-5 mt-4">
        <div className="container">
          <div className="row mb-2">
            {posts.map(post => (
              <div className="col-12 col-md-6 col-lg-4" key={post.fields.slug}>
                <PostOverview
                  post={post}
                  key={post.fields.slug}
                  title={post.frontmatter.title}
                  slug={post.fields.slug}
                  mappedCategory={`${getCategoryUrlFriendly(
                    post.frontmatter.categories[0]
                  )}`}
                  excerpt={post.excerpt}
                />
              </div>
            ))}
          </div>
        </div>
        <Pagination location={location} />
      </main>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        siteTitle
        description
      }
    }
    allMarkdownRemark(
      limit: 9
      skip: 0
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          timeToRead
          excerpt(pruneLength: 250)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            description
            categories
            seriesTitle
            featuredImage {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
