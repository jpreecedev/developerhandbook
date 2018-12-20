import * as React from 'react'
import CommentCount from './CommentCount'
import Categories from './Categories'

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
      <Categories post={post} />
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
