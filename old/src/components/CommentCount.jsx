import React from 'react'
import { CommentCount as DisqusCommentCount } from 'disqus-react'
import config from '../../site-config'

function CommentCount({ url, identifier, title }) {
  const { shortname } = config.disqus
  const disqusConfig = {
    url,
    identifier,
    title
  }
  return (
    <a href="#discussion">
      <DisqusCommentCount shortname={shortname} config={disqusConfig}>
        0 Comments
      </DisqusCommentCount>
    </a>
  )
}

export default CommentCount
