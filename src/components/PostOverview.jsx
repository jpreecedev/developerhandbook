/* eslint-disable react/no-danger */

import * as React from 'react'
import { Link } from 'gatsby'
import Published from './Published'

function PostOverview({ post, slug, title, mappedCategory, excerpt }) {
  return (
    <div key={slug}>
      <h2>
        <Link to={`/${mappedCategory}${slug}`}>{title}</Link>
      </h2>
      <Published post={post} />
      <p dangerouslySetInnerHTML={{ __html: excerpt }} />
    </div>
  )
}

export default PostOverview
