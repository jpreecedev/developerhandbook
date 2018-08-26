import * as React from 'react'
import calendarIcon from '../images/calendar.svg'

function Published({ post }) {
  return (
    <div style={{ display: 'flex', marginBottom: '1rem' }}>
      <img src={calendarIcon} alt="Calendar" />
      <p style={{ alignSelf: 'center', marginBottom: 0, marginLeft: '.5rem' }}>
        Published on
        {' '}
        <strong>{post.frontmatter.date}</strong>
        {' | '}
        Read time
        {' '}
        {post.timeToRead}
        {' '}
minutes
      </p>
    </div>
  )
}

export default Published
