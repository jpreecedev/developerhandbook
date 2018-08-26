import * as React from 'react'

import profilePic from '../images/profile-pic.jpg'

function Bio() {
  return (
    <div>
      <img src={profilePic} alt="Kyle Mathews" />
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
