import * as React from 'react'
import Link from 'gatsby-link'

import { getLink } from '../utils/categories'

function Published({ post }) {
  return (
    <div style={{ display: 'flex', marginBottom: '1rem', fontSize: '0.75rem' }}>
      <p style={{ alignSelf: 'center', marginBottom: 0 }}>
        Published on <strong>{post.frontmatter.date}</strong> in{' '}
        {post.frontmatter.categories.map((category, index) => {
          return (
            <span key={category}>
              <Link to={getLink(category)}>{category}</Link>
              {index < post.frontmatter.categories.length - 1 ? ', ' : ''}
            </span>
          )
        })}
        {' - '}
        Read time {post.timeToRead} minutes
      </p>
    </div>
  )
}

export default Published
