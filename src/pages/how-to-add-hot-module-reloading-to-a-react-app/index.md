---
layout: post
title: How to add Hot Module Reloading (HMR) to a React app
description: When using Webpack Dev Server, we can easily add support for Hot Module Reloading (HMR) which will signficantly reduce development time by reducing time required to see our changes on screen
date: 2018-12-31
updated: 2019-09-14
categories: ['Webpack', 'React', 'JavaScript', 'webpack-intro-series']
seriesTitle: Intro to Webpack mini series
group: 'Software Development'
---

Hot Module Reloading (HMR) is an essential tool in every front-end developers tool chest. When using Webpack along with Webpack Dev Server, with a little extra configuration you can easily enable HMR, which will get your changes in screen quicker and often whilst maintaining the state of your application.

<div class="alert alert-primary" role="alert">
  Please note, this tutorial assumes that you already have at least a basic Webpack configuration file, and that you have already installed Webpack Dev Server.  If you have not, please check out our tutorials on how to do so.

  <ul class="mt-3 mb-1">
    <li><a href="/webpack/webpack-4-from-absolute-scratch/">Webpack 4 from absolute scratch</a></li>
    <li><a href="/webpack/getting-started-with-webpack-dev-server/">Getting started with Webpack Dev Server</a></li>
  </ul>
</div>

Before we can add Hot Module Reloading to our React project, we need some React code! Let's do that first.

## How to create a simple React application

We are not trying to win any awards here, we only need to get React rendering out _something_ so we can move on. This is not a tutorial about how to build a _useful_ React website, after all.

Start by installing React, and ReactDOM. Both are required to render a React browser-based web application.

```shell
npm install --save react react-dom
```

**Note**: These are runtime dependencies, so we use `--save` instead of `--save-dev`.

Open `index.js` (in the `src` folder), delete all the existing code, and add the following;

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))
```

**Note**: If you are following this series from the beginning, and you have enabled TypeScript, rename your `index.ts` file to `index.tsx` to avoid TypeScript related warnings in your editor. From here on out, use the `.tsx` file extension instead of `.js` or `.jsx`.

Next, create a new file called `app.js` and add the following;

```jsx
import React from 'react'

function App() {
  return <h2>This is our React application!</h2>
}

export default App
```

Run `npm start` and observe the application in the browser;

![Simple React application](simple-react-application.png)

With Webpack, we do get some automatic refreshing behaviour out of the box, but we will take steps to configure this properly using `react-hot-loader`.

## Add Hot Module Loading for React

A killer reason for using a tool like Webpack is hot module reloading (HMR). HMR enables you to see your changes in the browser almost immediately as you make them, usually without the need to refresh the page or lose your application state.

To add HMR, first install `react-hot-loader` as follows;

```shell
npm install --save-dev react-hot-loader
```

We then add `react-hot-loader` to Babel as a plugin. Update the `.babelrc` as follows (add the `plugins` key/value);

```diff
{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
+  "plugins": ["react-hot-loader/babel"]
}
```

Then we update our application to utilise HMR. Open `app.js` and change the code as follows;

```jsx
import React from 'react'
import { hot } from 'react-hot-loader/root'

function App() {
  return <h2>This is our React application!</h2>
}

export default hot(App)
```

Finally, update your `start` NPM script with the `--hot` flag, as follows;

```json
"start": "cross-env NODE_ENV=development webpack-dev-server --hot --config webpack.config.js"
```

We use the `hot` higher order function to enable HMR. HMR should now be active and working properly.

Make a superficial change in `app.js`, save the file and observe the sweet sweet goodness of HMR as your app immediately updates with no refresh!! Congratulations, you have successfully enabled Hot Module Reloading.

## Summary

We can utilise Hot Module Reloading (HMR) with Webpack Dev Server to reduce the amount of time needed to see our changes on screen. HMR also has the benefit of not refreshing the entire page, only the components that we have edited since the last time we saved our changes. This means that our position in the application, and the application state, are often left untouched, meaning we can easily carry on from where we were up to.

## Next steps

If you would like to continue learning about Webpack, check out the next post in the [How to configure SCSS modules for Webpack](/webpack/how-to-configure-scss-modules-for-webpack/)
