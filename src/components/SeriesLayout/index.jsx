import React from 'react'

import SeriesNavigation from '../SeriesNavigation'

const webpackSeriesTitle = 'Intro to Webpack mini series'
const webpackPosts = {
  '/webpack/webpack-4-from-absolute-scratch/': 'Webpack 4 from absolute scratch',
  '/webpack/how-to-create-a-production-ready-webpack-config/':
    'How to create a production ready Webpack config',
  '/webpack/getting-started-with-webpack-dev-server/':
    'Getting started with Webpack Dev Server',
  '/webpack/how-to-add-hot-module-reloading-to-a-react-app/':
    'How to add Hot Module Reloading (HMR) to a React app',
  '/webpack/how-to-configure-scss-modules-for-webpack/':
    'How to configure SCSS modules for Webpack',
  '/webpack/how-to-process-images-with-webpack/': 'How to process images with Webpack',
  '/webpack/configure-webpack-4-hmr-scratch/':
    'How to configure Webpack Hot Module Reloading (HMR) using Node.js API',
  '/webpack/webpack-typescript-from-scratch/': 'Webpack 4 and TypeScript from scratch'
}

const reactSeriesTitle = 'Practical React Developer'
const reactPosts = {
  '/react/what-is-react-why-use-it/': 'What is React, and why use it?',
  '/react/get-started-quickly-with-codesandbox/':
    'Get started quickly with React using CodeSandbox',
  '/react/set-up-react-project-parceljs/':
    'How to export your React project from CodeSandbox to your desktop with Parcel.js',
  '/react/easily-add-routing-to-react-app/':
    'How to add routing to a React app using @reach/router',
  '/react/build-a-complete-property-listings-page-with-react/':
    'Build a complete property listings page with React.js',
  '/react/advanced-filtering-using-react-context-api/':
    'Add advanced filtering to a React app using React Context API',
  '/react/adding-finishing-touches-property-finder/':
    "Adding the finishing touches to 'Property Finder'",
  '/react/10-react-interview-questions/': '10 React.js interview questions'
}

const passportSeriesTitle = 'Comprehensive Passport.js Mini-Series'
const passportPosts = {
  '/passport.js/node-express-passport-authentication-mini-series/':
    'Build an authentication system using Node.js, Express, and Passport.js',
  '/passport.js/protect-website-using-passportjs-jwt/':
    'How to protect your website using Passport.js and JWT',
  '/passport.js/how-to-add-passportjs-google-oauth-strategy/':
    'How to add Passport.js Google OAuth Strategy to your website',
  '/passport.js/how-to-add-passportjs-facebook-strategy/':
    'How to add Passport.js Facebook Strategy to your website',
  '/passport.js/passport-role-based-authorisation-authentication/':
    'How to restrict access using Passport.js role-based authorisation'
}

const getSeries = title => {
  switch (title) {
    case webpackSeriesTitle:
      return { title: webpackSeriesTitle, posts: webpackPosts }
    case reactSeriesTitle:
      return { title: reactSeriesTitle, posts: reactPosts }
    case passportSeriesTitle:
      return { title: passportSeriesTitle, posts: passportPosts }
    default:
      return undefined
  }
}

function SeriesLayout({ title, children, pathname }) {
  const { title: seriesTitle, posts } = getSeries(title)

  return (
    <div className="container">
      <div className="row">
        <main role="main" className="col-12 col-lg-9" style={{ marginBottom: '10rem' }}>
          <article id="content">
            <SeriesNavigation
              title={seriesTitle}
              posts={posts}
              currentUrl={pathname}
              additionalClassNames="d-block d-lg-none"
            />
            {children}
          </article>
        </main>
        <SeriesNavigation
          title={seriesTitle}
          posts={posts}
          currentUrl={pathname}
          additionalClassNames="d-none d-lg-block col-lg-3"
        />
      </div>
    </div>
  )
}

export default SeriesLayout
