import * as React from 'react'

import profilePic from '../images/jonpreece-96.png'
import linkedin from '../images/linkedin.png'

function Published({ post, showProfile }) {
  return (
    <>
      {showProfile && (
        <div style={{ display: 'flex', marginBottom: '1rem', fontSize: '0.75rem' }}>
          <img
            src={profilePic}
            className="rounded mr-3 rounded-pill"
            alt="Jon Preece"
            style={{ maxWidth: '75px', maxHeight: '75px' }}
          />
          <p style={{ alignSelf: 'center', marginBottom: 0 }} className="text-muted">
            <img src={linkedin} className="mr-1" alt="Follow Jon Preece on LinkedIn" />
            Follow{' '}
            <a
              href="https://www.linkedin.com/in/jonpreecedev/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Jon Preece on LinkedIn
            </a>
            .
            <br />
            {`Published on `}
            {post.frontmatter.date}
            {' · '}
            {post.frontmatter.updated && `Updated on ${post.frontmatter.updated} · `}
            {post.timeToRead} minute read.
          </p>
        </div>
      )}
    </>
  )
}

export default Published
