import * as React from 'react'
import { DiscussionEmbed } from 'disqus-react'

function Comments({ url, identifier, title }) {
  const disqusShortname = 'jpreecedev'
  const disqusConfig = {
    url,
    identifier,
    title
  }
  return (
    <div>
      <h4>Discussion</h4>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  )
}

export default Comments
