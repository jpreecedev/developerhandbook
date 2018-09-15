/* eslint-disable react/no-danger */

import * as React from 'react'
import config from '../../site-config'

import Bio from '../components/Bio'
import Jumbotron from '../components/Jumbotron'
import Published from '../components/Published'
import PostSEO from '../components/PostSEO'
import Comments from '../components/Comments'
import PullRequest from '../components/PullRequest'

function BlogPostTemplate(props) {
  const { data, location, pathContext } = props
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { pathname } = location
  const { slug } = pathContext

  const { url } = config
  const fullUrl = url + pathname

  const disqusConfig = {
    url: fullUrl,
    identifier: pathname,
    title: post.frontmatter.title
  }

  if (!post) {
    return null
  }

  return (
    <div>
      <PostSEO
        post={post}
        siteTitle={siteTitle}
        pathname={pathname}
        baseUrl={url}
        fullUrl={fullUrl}
      />
      <Jumbotron title={post.frontmatter.title} />
      <main role="main" className="container" style={{ marginBottom: '10rem' }}>
        <Published post={post} {...disqusConfig} showComments />
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <PullRequest slug={slug} />
        <Bio />
        <Comments {...disqusConfig} />
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
