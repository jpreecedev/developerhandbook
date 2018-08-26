import React from 'react'

import profilePic from './profile-pic.jpg'
import { rhythm } from '../utils/typography'

function Bio() {
  return (
    <div
      style={{
        display: 'flex',
        marginBottom: rhythm(2.5)
      }}
    >
      <img
        src={profilePic}
        alt="Kyle Mathews"
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          width: rhythm(2),
          height: rhythm(2)
        }}
      />
      <p>
        Written by
        {' '}
        <strong>Jon Preece</strong>
        {' '}
who lives and works in Manchester, North
        West England.
        {' '}
        <a href="https://twitter.com/jpreecedev">You should follow him on Twitter</a>
      </p>
    </div>
  )
}

export default Bio
