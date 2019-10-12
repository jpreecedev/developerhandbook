import * as React from 'react'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'

import Nav from '../components/Nav'
import PostOverview from '../components/PostOverview'
import jonpreece from '../images/jonpreece-96.png'
import { getCategoryUrlFriendly } from '../utils/categories'

const NotFoundPage = ({ data, location }) => {
  React.useEffect(() => {
    const { pathname, hostname } = location
    if (hostname !== 'localhost') {
      Sentry.captureMessage(`404! ${pathname}`)
    }
  }, [location])

  const { siteTitle, description } = data.site.siteMetadata

  const posts = data.allMarkdownRemark.edges.map(edge => edge.node)

  const developmentPosts = posts
    .filter(post => post.frontmatter.group === 'Software Development')
    .slice(0, 9)

  const groupedPosts = [{ title: 'Software Development', posts: developmentPosts }]

  return (
    <>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
      </Helmet>
      <a className="sr-only sr-only-focusable" href="#content">
        Skip to main content
      </a>
      <header>
        <Nav />
      </header>
      <main id="content" role="main" className="container mb-5">
        <div className="text-center bg-light p-5">
          <img
            src={jonpreece}
            className="align-self-center rounded-circle mr-auto ml-auto d-block mt-3 mb-3"
            alt="Jon Preece"
          />
          <h1>Content was either not found, or removed</h1>
          <hr />
          <p>
            I have been hard at work re-structuring the website recently, and that means
            that some old posts have been removed. I&apos;m really sorry about that, but
            content gets old and out of date, so rather than giving you false or incorrect
            information, I have opted to remove it.
          </p>
          <p className="d-block">Please ensure your bookmarks are up to date.</p>
        </div>
        <div className="container mt-5">
          {groupedPosts.map(groupedPost => (
            <React.Fragment key={groupedPost.title}>
              <div className="row mb-2">
                <div className="col-12">
                  <h2 className="mt-0">{`Learn "${groupedPost.title}"`}</h2>
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
