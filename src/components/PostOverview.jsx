/* eslint-disable react/no-danger */

import * as React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import Published from './Published'

function PostOverview({ post, slug, title, mappedCategory, excerpt }) {
  return (
    <div className="card mb-4" key={slug}>
      {post.frontmatter.featuredImage ? (
        <Img
          className="card-img-top"
          fluid={post.frontmatter.featuredImage.childImageSharp.fluid}
          alt={title}
          title={title}
        />
      ) : null}
      <div className="card-body">
        <h2 className="card-title card-title-small mt-0">
          <Link to={`/${mappedCategory}${slug}`}>{title}</Link>
        </h2>
        <Published post={post} />
        <p className="card-text">
          <small className="text-muted">
            Last updated
            {` ${post.frontmatter.date}.`}
          </small>
        </p>
        <p dangerouslySetInnerHTML={{ __html: excerpt }} />
        <Link className="btn btn-primary" to={`/${mappedCategory}${slug}`}>
          Continue reading
        </Link>
      </div>
    </div>
  )
}

export default PostOverview
