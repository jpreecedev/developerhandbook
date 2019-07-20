import * as React from 'react'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import PostOverview from '../components/PostOverview'
import Layout from '../components/Layout'
import { getCategoryUrlFriendly } from '../utils/categories'
import SocialProfile from '../components/StructuredData/SocialProfile'

function BlogIndex({ data }) {
  const { siteTitle, description } = data.site.siteMetadata
  const posts = data.allMarkdownRemark.edges.map(edge => edge.node)

  const developmentPosts = posts
    .filter(post => post.frontmatter.group === 'Software Development')
    .slice(0, 3)
  const growthPosts = posts
    .filter(post => post.frontmatter.group === 'Personal Growth')
    .slice(0, 3)
  const financesPosts = posts
    .filter(post => post.frontmatter.group === 'Your Finances')
    .slice(0, 3)

  const groupedPosts = [
    { title: 'Software Development', posts: developmentPosts },
    { title: 'Personal Growth', posts: growthPosts },
    { title: 'Your Finances', posts: financesPosts }
  ]

  return (
    <>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
        <script type="application/ld+json">{SocialProfile()}</script>
      </Helmet>
      <Layout>
        Welcome to Developer Handbook
        <br />
        <small>Your practical web development resource.</small>
      </Layout>
      <main id="content" role="main" className="mb-5 mt-4">
        <div className="container">
          {groupedPosts.map(groupedPost => (
            <React.Fragment key={groupedPost.title}>
              <div className="row mb-2">
                <div className="col-12">
                  <h2 className="mt-0">{`Latest posts in "${groupedPost.title}"`}</h2>
                </div>
              </div>
              <div className="row mb-2">
                {groupedPost.posts.map(post => (
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
                <div className="col-12 d-block d-mb-none">
                  <Link
                    to={`/category/${getCategoryUrlFriendly(groupedPost.title)}`}
                    className="d-block mb-3"
                  >
                    {`Continue reading posts on "${groupedPost.title}"...`}
                  </Link>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </main>
    </>
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
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          timeToRead
          excerpt(pruneLength: 250)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            updated(formatString: "DD MMMM, YYYY")
            title
            description
            categories
            seriesTitle
            group
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
