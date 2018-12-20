/* eslint-disable react/no-danger */

import * as React from 'react'
import { graphql } from 'gatsby'
import config from '../../site-config'

import Jumbotron from '../components/Jumbotron'
import Published from '../components/Published'
import PostSEO from '../components/PostSEO'
import Comments from '../components/Comments'
import PullRequest from '../components/PullRequest'
import Layout from '../components/Layout'

function BlogPostTemplate(props) {
  const { data, location, pageContext } = props
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { pathname } = location
  const { slug } = pageContext

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
    <Layout>
      <PostSEO
        post={post}
        siteTitle={siteTitle}
        pathname={pathname}
        baseUrl={url}
        fullUrl={fullUrl}
      />
      <Jumbotron title={post.frontmatter.title} />
      <main
        id="content"
        role="main"
        className="container"
        style={{ marginBottom: '10rem' }}
      >
        <Published post={post} {...disqusConfig} showComments showImage />
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <PullRequest slug={slug} />
        <Comments {...disqusConfig} />
      </main>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query($slug: String!) {
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
        date(formatString: "DD MMMM, YYYY")
      }
    }
  }
`
