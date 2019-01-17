import React from 'react'
import classnames from 'classnames'
import TableOfContents from '../TableOfContents'

import styles from './styles.module.scss'

function SeriesLayout({ children, headings }) {
  return (
    <main
      id="content"
      role="main"
      className={classnames('container', styles.container)}
      style={{ marginBottom: '10rem' }}
    >
      <div className="row">
        <aside className={classnames('col-2')}>
          <dl className={styles.indented}>
            <dt>Getting Started</dt>
            <dd>
              <a href="#">First</a>
            </dd>
            <dd>
              <a href="#">Second</a>
            </dd>
            <dd>
              <a href="#">Third</a>
            </dd>
          </dl>
          <dl className={styles.indented}>
            <dt>Intermediate</dt>
            <dd>
              <a href="#">First</a>
            </dd>
            <dd>
              <a href="#">Second</a>
            </dd>
            <dd>
              <a href="#">Third</a>
            </dd>
          </dl>
          <dl className={styles.indented}>
            <dt>Build Tools</dt>
            <dd>
              <a href="#">First</a>
            </dd>
            <dd>
              <a href="#">Second</a>
            </dd>
            <dd>
              <a href="#">Third</a>
            </dd>
          </dl>
        </aside>
        <article className="col-8">{children}</article>
        <TableOfContents className="col-2" />
      </div>
    </main>
  )
}

export default SeriesLayout
