import * as React from 'react'
import Nav from './Nav'

import 'prismjs/themes/prism-coy.css'
import '../global.scss'

function Layout({ children }) {
  return (
    <>
      <a className="sr-only sr-only-focusable" href="#content">
        Skip to main content
      </a>
      <Nav />
      {children}
    </>
  )
}

export default Layout
