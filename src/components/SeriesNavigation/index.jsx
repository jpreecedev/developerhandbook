import React from 'react'
import classnames from 'classnames'

import { Link } from 'gatsby'
import styles from './styles.module.scss'

function SeriesNavigation({ title, posts, currentUrl }) {
  return (
    <aside className={classnames('d-none', 'd-md-block', 'col-2')}>
      <dl className={styles.indented}>
        <dt className={styles.title}>{title}</dt>
        {Object.keys(posts).map(key => {
          const isSamePage = key === currentUrl
          return (
            <dd key={key}>
              {isSamePage && <span>{`${posts[key]}`}</span>}
              {!isSamePage && <Link to={key}>{posts[key]}</Link>}
            </dd>
          )
        })}
      </dl>
    </aside>
  )
}

export default SeriesNavigation
