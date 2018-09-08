import * as React from 'react'
import Helmet from 'react-helmet'
import config from '../../site-config'
import { CATEGORIES_MAP } from '../utils/categories'
import icon from '../../static/icon.png'

function PostSEO({ post, siteTitle, location }) {
  const { description, title, image = icon, categories } = post.frontmatter
  const { twitter, siteTitleAlt, url } = config
  const { pathname } = location

  const category = categories[0]

  const schemaOrgJSONLD = [
    {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      url,
      name: title,
      alternateName: siteTitleAlt || ''
    },
    {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@id': `${url}/${
              category in CATEGORIES_MAP
                ? CATEGORIES_MAP[category]
                : category.toLowerCase().replace(' ', '-')
            }`,
            name: title
          }
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@id': url + pathname,
            name: title
          }
        }
      ]
    }
  ]

  debugger

  return (
    <Helmet title={`${title} | ${siteTitle}`}>
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

      <script type="application/ld+json">{JSON.stringify(schemaOrgJSONLD)}</script>
    </Helmet>
  )
}

export default PostSEO
