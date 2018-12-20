/* eslint-disable react/no-danger */

import * as React from 'react'
import { Link } from 'gatsby'
import Published from './Published'

function PostOverview({ post, slug, title, mappedCategory, excerpt }) {
  return (
    <div key={slug}>
      <Published post={post} />
      <h2 style={{ marginTop: 0 }}>
        <Link to={`/${mappedCategory}${slug}`}>{title}</Link>
      </h2>
      <p dangerouslySetInnerHTML={{ __html: excerpt }} />
      <Link to={`/${mappedCategory}${slug}`}>Continue reading</Link>
    </div>
  )
}

export default PostOverview
