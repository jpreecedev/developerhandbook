import * as React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Jumbotron from '../components/Jumbotron'
import PostOverview from '../components/PostOverview'
import Pagination from '../components/Pagination'
import Layout from '../components/Layout'
import { getCategoryUrlFriendly } from '../utils/categories'
import SocialProfile from '../components/StructuredData/SocialProfile'
import MiniProfile from '../components/MiniProfile'

function BlogIndex({ data, location }) {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges.map(edge => edge.node)

  return (
    <Layout>
      <Helmet title={siteTitle}>
        <script type="application/ld+json">{SocialProfile()}</script>
      </Helmet>
      <Jumbotron title="Cleaner code, better code." />
      <main id="content" role="main" className="container mb-5">
        <MiniProfile />
        <div className="row mb-2">
          {posts.map(post => (
            <div className="col-md-6" key={post.fields.slug}>
              <div className="card flex-md-row mb-4 shadow-sm h-md-250">
                <div className="card-body d-flex flex-column align-items-start">
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
              </div>
            </div>
          ))}
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
        title
      }
    }
    allMarkdownRemark(
      limit: 10
      skip: 0
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { isLive: { ne: false } } }
    ) {
      edges {
        node {
          timeToRead
          excerpt(pruneLength: 500)
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
