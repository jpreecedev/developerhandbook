import React from 'react'
import classnames from 'classnames'
import TableOfContents from '../TableOfContents'

import styles from './styles.module.scss'
import SeriesNavigation from '../SeriesNavigation'

const posts = {
  '/webpack/webpack-4-from-absolute-scratch/': 'Webpack 4 from absolute scratch',
  '/webpack/how-to-create-a-production-ready-webpack-config/':
    'How to create a production ready Webpack config',
  '/webpack/getting-started-with-webpack-dev-server/':
    'Getting started with Webpack Dev Server',
  '/webpack/how-to-add-hot-module-reloading-to-a-react-app/':
    'How to add Hot Module Reloading (HMR) to a React app',
  '/webpack/how-to-configure-scss-modules-for-webpack/':
    'How to configure SCSS modules for Webpack',
  '/webpack/how-to-process-images-with-webpack/': 'How to process images with Webpack'
}

function SeriesLayout({ title, children, headings, pathname }) {
  return (
    <main
      id="content"
      role="main"
      className={classnames('container', styles.container)}
      style={{ marginBottom: '10rem' }}
    >
      <div className="row">
        <SeriesNavigation title={title} posts={posts} currentUrl={pathname} />
        <article className="col col-md-8">{children}</article>
        <TableOfContents className="d-none d-md-block col-2" headings={headings} />
      </div>
    </main>
  )
}

export default SeriesLayout
