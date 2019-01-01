import * as React from 'react'
import { Link } from 'gatsby'

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

function IntroToWebpackMiniSeries({ currentUrl }) {
  return (
    <div style={{ margin: '2rem 0' }}>
      <h4 style={{ marginTop: 0 }}>
        Please be aware, this post is part of a mini series!
      </h4>
      <p />
      <ol>
        {Object.keys(posts).map(key => {
          const isSamePage = key === currentUrl
          return (
            <li key={key}>
              {isSamePage && (
              <span>
                {posts[key]}
                {' '}
(You are here!)
              </span>
)}
              {!isSamePage && <Link to={key}>{posts[key]}</Link>}
            </li>
          )
        })}
      </ol>
      <p>
        The full source code that accompanies this
        {' '}
        <a href="https://github.com/jpreecedev/webpack-4-react-from-scratch">
          tutorial series in over on GitHub
        </a>
        .
      </p>
    </div>
  )
}

export default IntroToWebpackMiniSeries
