import * as React from 'react'

const slugs = require(`github-slugger`)()

function Link({ heading }) {
  slugs.reset()
  return <a href={`#${slugs.slug(heading)}`}>{heading}</a>
}

export default Link
