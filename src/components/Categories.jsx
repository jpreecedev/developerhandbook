import * as React from 'react'

import { Link } from 'gatsby'
import { getLink } from '../utils/categories'

function Categories({ post }) {
  return (
    <>
      <h2 id="related">Related Posts</h2>
      <p className="mb-3">
        {post.frontmatter.categories.map(category => (
          <Link
            key={category}
            className="badge badge-secondary badge-large mr-1"
            to={getLink(category)}
          >
            {category}
          </Link>
        ))}
      </p>
    </>
  )
}

export default Categories
