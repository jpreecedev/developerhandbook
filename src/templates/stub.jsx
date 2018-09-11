/* eslint-disable react/no-danger */

import * as React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Link from 'gatsby-link'
import Jumbotron from '../components/Jumbotron'
import Published from '../components/Published'
import { getCategoryUrlFriendly } from '../utils/categories'
import Pagination from '../components/Pagination'

function getPostCategory(post) {
  if (!post.frontmatter.categories) {
    return 'Unsorted'
  }

  return getCategoryUrlFriendly(post.frontmatter.categories[0])
}

function StubTemplate(props) {
  const { location, pathContext } = props
  const { posts, siteTitle, category, mappedCategory } = pathContext
  return (
    <div>
      <Helmet title={`${category} | ${siteTitle}`} />
      <Jumbotron title={category} />
      <main role="main" className="container mb-5">
        {posts.map(post => {
          const title = get(post, 'frontmatter.title') || post.fields.slug
          return (
            <div key={post.fields.slug}>
              <h2>
                <Link
                  to={`/${mappedCategory || getPostCategory(post)}${post.fields.slug}`}
                >
                  {title}
                </Link>
              </h2>
              <Published post={post} />
              <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
            </div>
          )
        })}
        <Pagination location={location} />
      </main>
    </div>
  )
}

export default StubTemplate
