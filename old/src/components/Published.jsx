import * as React from 'react'

function Published({ post, showProfile }) {
  return (
    <>
      {showProfile && (
        <div style={{ display: 'flex', marginBottom: '1rem', fontSize: '0.75rem' }}>
          <p style={{ alignSelf: 'center' }} className="text-muted mb-0">
            {post.frontmatter.updated
              ? `Last updated on ${post.frontmatter.updated}.`
              : `Published on ${post.frontmatter.date}.`}{' '}
            {post.timeToRead} minute read.
          </p>
        </div>
      )}
    </>
  )
}

export default Published
