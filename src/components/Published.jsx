import * as React from 'react'
import { Link } from 'gatsby'
import CommentCount from './CommentCount'

import { getLink } from '../utils/categories'
import profilePic from '../images/jonpreece.png'

function Published({
  post,
  url,
  identifer,
  title,
  showComments = false,
  showImage = false
}) {
  return (
    <>
      <p className="mb-3">
        {post.frontmatter.categories.map(category => (
          <Link key={category} class="badge badge-secondary mr-1" to={getLink(category)}>
            {category}
          </Link>
        ))}
      </p>
      <div style={{ display: 'flex', marginBottom: '1rem', fontSize: '0.75rem' }}>
        {showImage && <img src={profilePic} className="rounded mr-3" alt="Jon Preece" />}
        <p style={{ alignSelf: 'center', marginBottom: 0 }}>
          Published on
          {' '}
          <strong>{post.frontmatter.date}</strong>
          {' '}
by
          {' '}
          <a
            href="https://twitter.com/jpreecedev"
            rel="noopener noreferrer"
            target="_blank"
          >
            Jon Preece
          </a>
          {' · '}
          Read time
          {' '}
          {post.timeToRead}
          {' '}
minutes
          {showComments ? (
            <span>
              {' · '}
              <CommentCount url={url} title={title} identifier={identifer} />
            </span>
          ) : null}
        </p>
      </div>
    </>
  )
}

export default Published
