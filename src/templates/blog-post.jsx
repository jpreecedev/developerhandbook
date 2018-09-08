import * as React from 'react'
import Link from 'gatsby-link'

import Bio from '../components/Bio'
import Jumbotron from '../components/Jumbotron'
import Published from '../components/Published'
import PostSEO from '../components/PostSEO'

function BlogPostTemplate(props) {
  const { data, location, pathContext } = props
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pathContext
  return (
    <div>
      <PostSEO post={post} siteTitle={siteTitle} location={location} />
      <Jumbotron title={post.frontmatter.title} />
      <main role="main" className="container" style={{ marginBottom: '10rem' }}>
        <Published post={post} />
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <Bio />
        {(previous || next) && (
          <div>
            <hr />
            <h5 className="mt-5">Continue Reading</h5>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                {previous.frontmatter.title}
                <br />
              </Link>
            )}
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title}
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      timeToRead
      frontmatter {
        categories
        title
        description
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
