import React from 'react'
import classnames from 'classnames'

import { Link } from 'gatsby'
import styles from './styles.module.scss'

function SeriesNavigation({ title, posts, currentUrl, additionalClassNames }) {
  return (
    <aside className={classnames(styles.indented, additionalClassNames)}>
      <div className={classnames(styles.sticky, 'bg-light rounded')}>
        <h4 className={classnames(styles.title, 'text-underline')}>{title}</h4>
        <ul>
          {Object.keys(posts).map(key => {
            const isSamePage = key === currentUrl
            return (
              <li key={key}>
                {isSamePage && (
                  <span className={styles.underline}>{`${posts[key]}`}</span>
                )}
                {!isSamePage && <Link to={key}>{posts[key]}</Link>}
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}

export default SeriesNavigation
