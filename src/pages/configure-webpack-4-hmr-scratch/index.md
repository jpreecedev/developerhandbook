---
layout: post
title: How to configure Webpack Hot Module Reloading (HMR) using Node.js API
description: Ever needed to configure Webpack Hot Module Reloading (HMR) from scratch using the Node.js API? It's a pain.
date: 2019-04-04
categories: ['Webpack', 'webpack-intro-series']
seriesTitle: Intro to Webpack mini series
featuredImage: './webpack.png'
---

You recently had some reason, probably work related, to configure Webpack from scratch using the Node API. This is because of _reasons_ (for example, you are moving your Webpack configuration into an NPM package), and you found the documentation somewhat lacking!!

You quickly became frustrated and decided to search for a tutorial, and now, you are here. Welcome friend!! I too have felt your pain. The Webpack documentation is lacking at best so it is up to community members like myself to fill in the gaps.

Sound about right?

The purpose of this tutorial is to show you exactly how to set up an absolute minimal repository that compiles JavaScript using Babel, compiles SASS, and that has hot module reloading for efficiently reloading your changes. And we will do all this using the Node API!

## How to set up a Webpack project from scratch

This step is straightforward and boilerplate, so we will move quickly here.

Add the following dependencies to your `package.json`;

```diff
  "devDependencies": {
+    "@babel/core": "^7.4.3",
+    "@babel/preset-env": "^7.4.3",
+    "babel-loader": "^8.0.5",
+    "clean-webpack-plugin": "^2.0.1",
+    "css-loader": "^2.1.1",
+    "html-loader": "^0.5.5",
+    "html-webpack-plugin": "^3.2.0",
+    "node-sass": "^4.11.0",
+    "sass-loader": "^7.1.0",
+    "style-loader": "^0.23.1",
+    "webpack": "^4.29.5",
+    "webpack-cli": "^3.2.3",
+    "webpack-dev-server": "^3.2.1"
  },
  "dependencies": {
+    "@babel/runtime": "^7.4.3"
  }
```

Now create a `webpack.config.js` file as follows;

```javascript
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s(a|c)ss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.scss']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    })
  ]
}
```

The above code is self-explanatory, but let us quickly discuss what we are looking at here;

- Use `babel-loader` to compile our JavaScript files
- Use `sass-loader` to compile our SCSS
- Use `html-loader` to inject our JavaScript bundle into our `index.html` file (we will create this shortly).

## Write the application code

We just want the bare bones here, we have no need to import `React` or any other external library. All we want to verify is that styles are loaded (and hot loaded) and that our JavaScript is being compiled by Webpack.

Create a new directory called `src` and add the following code;

In `index.html`, add the following;

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Webpack Hmr</title>
  </head>
  <body></body>
</html>
```

In `index.js`, add the following;

```javascript
import './index.scss'

const change = msg => {
  document.querySelector('body').innerText = msg
}

document.querySelector('body').innerText = 'Hello, World!'

setTimeout(() => {
  change('Deferred hello world!')
}, 3000)
```

In `index.scss`, add the following;

```scss
body {
  background-color: yellow;
}
```

**Note** the use of ES6 arrow functions. We are using `@babel/preset-env`, which will convert arrow functions to traditional `function`s (we will observe this later).

Oh, and by the way, in the root of your project, create a new file called `.babelrc` and add the following code;

```json
{
  "presets": ["@babel/preset-env"]
}
```

This will instruct Babel to use the `preset-env` plugin which will maximise our cross-browser compatibility.

## How to use the Webpack and Webpack Dev Server Node.js API

Just in case your ninja search skills have failed you, the official documentation does have an [example on how to use the Node.js API correctly](https://webpack.js.org/guides/hot-module-replacement/#via-the-nodejs-api), although it is well hidden and not given the shout out it deserves. In fact, I missed it several times despite actually reading through the documentation at length!

Create a new file, called `dev.js` and add the following code;

```javascript
const webpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')

const config = require('./webpack.config.js')
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost',
  inline: true
}

webpackDevServer.addDevServerEntrypoints(config, options)
const compiler = webpack(config)
const server = new webpackDevServer(compiler, options)

server.listen(5000, 'localhost', () => {
  console.log('dev server listening on port 5000')
})
```

**So what is happening?**

- Import `webpack` and `webpack-dev-server` Node.js APIs
- Import your Webpack configuration that you created earlier
- Set `hot` and `inline` to true, so that when we start `webpack-dev-server`, hot module reloading will be enabled
- **Super important, do not skip!**. Call `addDevServerEntrypoints`, which injects some hot module reloading specific entry points into your webpack configuration.
- Run a compilation and start listening for changes

## How to test that hot module reloading is working

Add the following script to your `package.json`;

```diff
"scripts": {
+  "dev": "node ./dev.js"
}
```

And run;

```bash
npm run dev
```

Then open your browser to; `http://localhost:5000` and observe.

After a few seconds, the document text should change from **Hello, World** to **"Deferred hello world!"**. This just confirms that our JavaScript is running and has not failed for some reason.

![Webpack Hot Module Reloading](webpack-hot-module-reloading.png)

It is also worth checking the `console` in developer tools to ensure that hot module reloading is definitely connected;

![Webpack Hot Module Reloading is Connected](webpack-hot-module-reloading-connected.png)

If you are not seeing anything in the console, this is a sure sign that hot module reloading is not working and you should retrace the steps of this post!

Finally, you can check that Babel has compiled your JavaScript correctly by looking at the sources;

![Webpack Babel Compiled Code](webpack-babel-compiled.png)

Webpack horribly mangles your code but with a bit of searching in `main.js`, you should be able to find your code and observe that our lovely arrow function has been magically transformed into a standard function. (I searched for "Deferred hello world", as shown in the image).

The final step is to make a change and observe the sheer beauty of your delicious page reloading and changing on your every (save) command.

## Summary

Webpack hot module reloading is a powerful feature of Webpack-dev-server, which once configured (correctly) can bring your dream of instantly reflected changes to life. The Node.js API is not well documented on Webpack's official website, and is easily overlooked. Make sure that you correctly set the entry points using `addDevServerEntrypoints`, or you will face hours of frustration.
