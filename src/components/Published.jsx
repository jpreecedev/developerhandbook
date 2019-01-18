import * as React from 'react'

import Categories from './Categories'
import profilePic from '../images/jonpreece.png'
import twitter from '../images/twitter.png'

function Published({ post, showProfile }) {
  return (
    <>
      <Categories post={post} />
      {showProfile && (
        <div style={{ display: 'flex', marginBottom: '1rem', fontSize: '0.75rem' }}>
          <img src={profilePic} className="rounded mr-3 rounded-pill" alt="Jon Preece" />
          <p style={{ alignSelf: 'center', marginBottom: 0 }} className="text-muted">
            <img
              src={twitter}
              className="mr-1"
              alt="Follow DeveloperHandbook.com on Twitter"
            />
            <a
              href="https://twitter.com/jpreecedev"
              rel="noopener noreferrer"
              target="_blank"
            >
              Jon Preece
            </a>
            <br />
            {post.frontmatter.date}
            {' · '}
            {post.timeToRead}
            {' '}
minute read
          </p>
        </div>
      )}
    </>
  )
}

export default Published
