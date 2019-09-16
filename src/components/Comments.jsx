import * as React from 'react'
import { DiscussionEmbed } from 'disqus-react'
import LazyLoad from 'react-lazy-load'
import config from '../../site-config'

function Comments({ url, identifier, title }) {
  const { shortname } = config.disqus
  const disqusConfig = {
    url,
    identifier,
    title
  }
  return (
    <div id="discussion">
      <LazyLoad>
        <DiscussionEmbed shortname={shortname} config={disqusConfig} />
      </LazyLoad>
    </div>
  )
}

export default Comments
