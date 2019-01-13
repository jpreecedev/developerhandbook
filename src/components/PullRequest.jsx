import React from 'react'

function PullRequest({ slug }) {
  const basePath = 'https://github.com/jpreecedev/developerhandbook/tree/master/src/pages'

  return (
    <a href={`${basePath}${slug}index.md`} className="mt-3 mb-3 btn btn-warning">
      <span className="d-block ml-3 mr-3">Edit this page on GitHub</span>
    </a>
  )
}

export default PullRequest
