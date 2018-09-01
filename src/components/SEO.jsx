import React from 'react'
import Helmet from 'react-helmet'
import config from '../../site-config'

function Post({ post, siteTitle, slug }) {
  const { description, title, image } = post.frontmatter
  const url = config.url + slug
  const { twitter } = config

  return (
    <Helmet title={`${post.frontmatter.title} | ${siteTitle}`}>
      {description && <meta name="description" content={description} />}
      {image && <meta name="image" content={image} />}

      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitter} />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}

export default Post
