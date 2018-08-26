import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import 'prismjs/themes/prism-coy.css'
import '../styles.scss'

import { rhythm, scale } from '../utils/typography'

function Template(props) {
  const { location, children } = props
  let header

  let rootPath = `/`
  if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
    rootPath = `${__PATH_PREFIX__}/`
  }

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          textAlign: 'center',
          marginBottom: rhythm(1.5),
          marginTop: 0
        }}
      >
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'inherit'
          }}
          to="/"
        >
          DeveloperHandbook.com
          <br />
          Cleaner code, better code.
        </Link>
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          textAlign: 'center',
          fontFamily: 'IBM Plex Sans, sans-serif',
          marginTop: 0,
          marginBottom: rhythm(-1)
        }}
      >
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'inherit'
          }}
          to="/"
        >
          DeveloperHandbook.com
          <br />
          Cleaner code, better code.
        </Link>
      </h3>
    )
  }
  return (
    <div
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`
      }}
    >
      {header}
      {children()}
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400"
          rel="stylesheet"
        />
      </Helmet>
    </div>
  )
}

export default Template
