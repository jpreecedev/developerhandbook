import React from 'react'
import classnames from 'classnames'

import styles from './styles.module.scss'

function SeriesLayout({ children }) {
  return (
    <main
      id="content"
      role="main"
      className={classnames('container', styles.container)}
      style={{ marginBottom: '10rem' }}
    >
      <div className="row">
        <aside className={classnames('col-2')}>
          <dl>
            <dt>Getting Started</dt>
            <dd>First</dd>
            <dd>Second</dd>
            <dd>Third</dd>
          </dl>
          <dl>
            <dt>Intermediate</dt>
            <dd>First</dd>
            <dd>Second</dd>
            <dd>Third</dd>
          </dl>
          <dl>
            <dt>Build Tools</dt>
            <dd>First</dd>
            <dd>Second</dd>
            <dd>Third</dd>
          </dl>
        </aside>
        <article className="col-8">{children}</article>
        <nav className="col-2 post-overview" />
      </div>
    </main>
  )
}

export default SeriesLayout
