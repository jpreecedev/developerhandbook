import * as React from 'react'

import Nav from './Nav'
import Jumbotron from './Jumbotron'

import 'prismjs/themes/prism-coy.css'
import '../global.scss'

function Layout({ children }) {
  return (
    <>
      <a className="sr-only sr-only-focusable" href="#content">
        Skip to main content
      </a>
      <header>
        <Nav />
        <Jumbotron>
          <div className="title">
            <h1 className="text-center mt-0">{children}</h1>
          </div>
        </Jumbotron>
      </header>
    </>
  )
}

export default Layout
