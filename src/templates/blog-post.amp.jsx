/* eslint-disable react/no-danger */

import * as React from 'react'
import { graphql } from 'gatsby'
import AmpLayout from '../components/AmpLayout'

function BlogPostAmpTemplate({ data }) {
  const post = data.markdownRemark

  if (!post) {
    return null
  }

  return (
    <AmpLayout>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </AmpLayout>
  )
}

export default BlogPostAmpTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    site {
      siteMetadata {
        siteTitle
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      timeToRead
      frontmatter {
        categories
        tags
        title
        description
        date(formatString: "DD MMMM, YYYY")
      }
    }
  }
`
