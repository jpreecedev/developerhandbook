import * as React from 'react'

import profilePic from '../images/jonpreece.jpg'

function Bio() {
  return (
    <div className="d-flex">
      <img
        src={profilePic}
        className="rounded-circle"
        style={{ width: '100px', height: '100px' }}
        alt="Jon Preece"
      />
      <p className="ml-3 align-self-center">
        Written by <strong>Jon Preece</strong> who lives and works in Manchester, North
        West England.{' '}
        <a href="https://twitter.com/jpreecedev">You should follow him on Twitter</a>.
      </p>
    </div>
  )
}

export default Bio
