import React from 'react'
import classnames from 'classnames'

import SpyLink from '../SpyLink'
import styles from './styles.module.scss'

function TableOfContents({ className, headings }) {
  if (!headings) {
    return null
  }

  return (
    <nav className={classnames(styles.nav, className)}>
      <ul className={classnames('ml-1', 'pl-0', styles.list)}>
        {headings.map(heading => (
          <li
            key={heading.value}
            className={`pl-${heading.depth > 2 ? heading.depth : '0'}`}
          >
            <SpyLink heading={heading.value} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
