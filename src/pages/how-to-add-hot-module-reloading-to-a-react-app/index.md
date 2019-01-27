---
layout: post
title: How to add Hot Module Reloading (HMR) to a React app
description: When using Webpack Dev Server, we can easily add support for Hot Module Reloading (HMR) which will signficantly reduce development time by reducing time required to see our changes on screen
date: 2018-12-31
categories: ['Webpack']
tags: ['webpack', 'javascript', 'babel', 'webpack-intro-series']
---

Before we can add Hot Module Reloading to our React project, we need some React code! Let's do that first.

## Create a simple React application

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

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": ["react-hot-loader/babel"]
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

## Summary

We can utilise Hot Module Reloading (HMR) with Webpack Dev Server to reduce the amount of time needed to see our changes on screen. HMR also has the benefit of not refreshing the entire page, only the components that we have edited since the last time we saved our changes. This means that our position in the application, and the application state, are often left untouched, meaning we can easily carry on from where we were up to.
