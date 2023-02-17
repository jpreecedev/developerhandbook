/* eslint-disable react/no-danger */

import * as React from 'react'
import { graphql } from 'gatsby'
import RehypeReact from 'rehype-react'
import config from '../../site-config'

import Published from '../components/Published'
import PostSEO from '../components/PostSEO'
import Comments from '../components/Comments'
import Categories from '../components/Categories'
import Layout from '../components/Layout'
import MiniProfile from '../components/MiniProfile'
import StandardLayout from '../components/StandardLayout'
import SeriesLayout from '../components/SeriesLayout'

import SharePriceEvaluator from '../components/SharePriceEvaluator'

const renderAst = new RehypeReact({
  createElement: React.createElement,
  components: {
    'share-price-evaluator': SharePriceEvaluator
  }
}).Compiler

function BlogPostTemplate(props) {
  const { data, location } = props
  const post = data.markdownRemark
  const { headings } = post
  const { frontmatter } = post
  const { siteTitle } = data.site.siteMetadata
  const { pathname } = location

  const { url } = config
  const fullUrl = url + pathname

  const disqusConfig = {
    url: fullUrl,
    identifier: pathname,
    title: frontmatter.title
  }

  const isSeries = (categories =>
    categories.filter(tag => tag.indexOf('-series') > -1).length > 0)(
    frontmatter.categories
  )

  const { seriesTitle } = frontmatter

  if (!post) {
    return null
  }

  const postContent = (
    <>
      <Published post={post} {...disqusConfig} showProfile />
      <div>{renderAst(post.htmlAst)}</div>
      <Categories post={post} />
      <MiniProfile />
      <Comments {...disqusConfig} />
    </>
  )

  return (
    <>
      <Layout>{frontmatter.title}</Layout>
      <PostSEO
        post={post}
        siteTitle={siteTitle}
        pathname={pathname}
        baseUrl={url}
        fullUrl={fullUrl}
      />
      {!isSeries && <StandardLayout>{postContent}</StandardLayout>}
      {isSeries && (
        <SeriesLayout
          headings={headings}
          pathname={pathname}
          title={seriesTitle}
          postTitle={frontmatter.title}
        >
          {postContent}
        </SeriesLayout>
      )}
    </>
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
      htmlAst
      timeToRead
      headings {
        value
        depth
      }
      frontmatter {
        categories
        title
        description
        date(formatString: "MMM DD, YYYY")
        updated(formatString: "MMM DD, YYYY")
        seriesTitle
      }
    }
  }
`
