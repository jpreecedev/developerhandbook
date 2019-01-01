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
import MiniProfile from '../components/MiniProfile'
import IntroToWebpackMiniSeries from '../components/IntroToWebpackMiniSeries'

const isIntroToWebpackMiniSeries = tags =>
  tags.filter(tag => tag === 'webpack-intro-series').length > 0

function BlogPostTemplate(props) {
  const { data, location, pageContext } = props
  const post = data.markdownRemark
  const { frontmatter } = post
  const { siteTitle } = data.site.siteMetadata
  const { pathname } = location
  const { slug } = pageContext

  const { url } = config
  const fullUrl = url + pathname

  const disqusConfig = {
    url: fullUrl,
    identifier: pathname,
    title: frontmatter.title
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
      <Jumbotron title={frontmatter.title} />
      <main
        id="content"
        role="main"
        className="container"
        style={{ marginBottom: '10rem' }}
      >
        <Published post={post} {...disqusConfig} showComments />
        {isIntroToWebpackMiniSeries(frontmatter.tags) && (
          <IntroToWebpackMiniSeries currentUrl={location.pathname} />
        )}
        <div className="mb-5" dangerouslySetInnerHTML={{ __html: post.html }} />
        <MiniProfile />
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
