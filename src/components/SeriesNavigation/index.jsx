import React from 'react'
import classnames from 'classnames'

import { Link } from 'gatsby'
import styles from './styles.module.scss'

function SeriesNavigation({ title, posts, currentUrl }) {
  return (
    <aside className={classnames('d-none', 'd-md-block', 'col-md-3')}>
      <dl className={classnames(styles.indented, 'ml-3')}>
        <dt className={styles.title}>{title}</dt>
        {Object.keys(posts).map(key => {
          const isSamePage = key === currentUrl
          return (
            <dd key={key}>
              {isSamePage && <span className={styles.underline}>{`${posts[key]}`}</span>}
              {!isSamePage && <Link to={key}>{posts[key]}</Link>}
            </dd>
          )
        })}
      </dl>
    </aside>
  )
}

export default SeriesNavigation
