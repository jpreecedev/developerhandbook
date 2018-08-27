import * as React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import get from 'lodash/get'

import Bio from '../components/Bio'
import Jumbotron from '../components/Jumbotron'
import Published from '../components/Published'

function BlogPostTemplate(props) {
  const { data, pathContext } = props
  const post = data.markdownRemark
  const siteTitle = get(props, 'data.site.siteMetadata.title')
  const { previous, next } = pathContext
  return (
    <div>
      <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
      <Jumbotron title={post.frontmatter.title} />
      <main role="main" className="container">
        <Published post={post} />
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr />
        <Bio />
        <ul>
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
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
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
