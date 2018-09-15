import React from 'react'
import octocat from '../images/octocat.png'

function PullRequest({ slug }) {
  const basePath = 'https://github.com/jpreecedev/developerhandbook/tree/master/src/pages'

  return (
    <a href={`${basePath}${slug}index.md`} className="btn btn-warning">
      <img className="mt-3 mb-3" src={octocat} alt="Octocat" />
      <span className="d-block ml-3 mr-3">
        Want to make a change?
        <br />
        Edit this page on GitHub
      </span>
    </a>
  )
}

export default PullRequest
