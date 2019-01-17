import React from 'react'
import classnames from 'classnames'

import styles from './styles.module.scss'

function TableOfContents({ className, headings }) {
  return (
    <nav className={classnames(styles.nav, className)}>
      <ul className={classnames('list-unstyled', 'pl-3', styles.list)}>
        {headings.map(heading => (
          <li className={`pl-${heading.depth > 2 ? heading.depth : '0'}`}>
            {heading.value}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
