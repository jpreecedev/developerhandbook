import * as React from 'react'
import { OutboundLink } from 'gatsby-plugin-google-analytics'

import profilePic from '../images/jonpreece.jpg'

function Bio() {
  return (
    <div className="mt-5">
      <hr />
      <div className="d-flex">
        <img
          src={profilePic}
          className="rounded-circle"
          style={{ width: '100px', height: '100px' }}
          alt="Jon Preece"
        />
        <p className="ml-3 align-self-center">
          Written by
          {' '}
          <strong>Jon Preece</strong>
          {' '}
who lives and works in Manchester, North
          West England.
          {' '}
          <OutboundLink
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/jpreecedev"
          >
            You should follow him on Twitter
          </OutboundLink>
          .
        </p>
      </div>
    </div>
  )
}

export default Bio
