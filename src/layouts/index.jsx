/* eslint-disable */
import * as React from 'react'

import Nav from '../components/Nav'

import 'prismjs/themes/prism-coy.css'
import '../styles.scss'

function Template({ children, location }) {
  return (
    <div>
      <Nav location={location} />
      {children()}
    </div>
  )
}

export default Template
