import React from 'react'
import classnames from 'classnames'

import styles from './styles.module.scss'

function TableOfContents({ className }) {
  return (
    <nav className={classnames(styles.nav, className)}>
      <ul className="list-unstyled">
        <li className="toc-entry toc-h2">
          <a href="#how-it-works">How it works</a>
        </li>
        <li className="toc-entry toc-h2">
          <a href="#example-in-navbar">Example in navbar</a>
        </li>
        <li className="toc-entry toc-h2">
          <a href="#example-with-nested-nav">Example with nested nav</a>
        </li>
        <li className="toc-entry toc-h2">
          <a href="#example-with-list-group">Example with list-group</a>
        </li>
        <li className="toc-entry toc-h2">
          <a href="#usage">Usage</a>
          <ul className="list-unstyled pl-3">
            <li className="toc-entry toc-h3">
              <a href="#via-data-attributes">Via data attributes</a>
            </li>
            <li className="toc-entry toc-h3">
              <a href="#via-javascript">Via JavaScript</a>
            </li>
            <li className="toc-entry toc-h3">
              <a href="#methods">Methods</a>
              <ul className="list-unstyled pl-3">
                <li className="toc-entry toc-h4">
                  <a href="#scrollspyrefresh">.scrollspy('refresh')</a>
                </li>
                <li className="toc-entry toc-h4">
                  <a href="#scrollspydispose">.scrollspy('dispose')</a>
                </li>
              </ul>
            </li>
            <li className="toc-entry toc-h3">
              <a href="#options">Options</a>
            </li>
            <li className="toc-entry toc-h3">
              <a href="#events">Events</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  )
}

export default TableOfContents
