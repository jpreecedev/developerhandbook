---
layout: post
title: Getting started with Webpack Dev Server
description: Webpack Dev Server is fantastic for quickly running and debugging Webpack based websites, thanks in part to its support for Hot Module Reloading (HMR)
date: 2018-12-31
updated: 2019-09-14
categories: ['Webpack', 'webpack-intro-series']
seriesTitle: Intro to Webpack mini series
group: 'Software Development'
---

Webpack Dev Server is a development time HTTP web server with built in support for Hot Module Reloading (HMR), which can help you rapidly build websites. HMR enables you to see your changes on screen much faster by enabling more incremental builds.

## How to set up Webpack Dev Server

To use Webpack Dev Server, start as follows.

Create a new file called `index.html` in your `src` directory and add the following code;

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Webpack 4 - React From Scratch</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <div id="root"></div>
  </body>
</html>
```

Now we need to configure Webpack to inject script tags for our JavaScript bundle. We need to do this because we probably will not know the name of our JavaScript file when doing production builds. Typically when generating a production build, our JavaScript file will have a random file name, for cache busting.

To make this injection magic happen, we need to use `html-webpack-plugin`. Start by installing it using the NPM script below.

```shell
npm install --save-dev html-webpack-plugin html-loader
```

We need `html-loader` also so we can handle HTML files.

Now open `webpack.config.js` and add the `HtmlWebPackPlugin` following to the `plugins` section;

```javascript
const HtmlWebPackPlugin = require('html-webpack-plugin')
const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = {
  ///...
  plugins: [
    ///...
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    })
    ///...
  ]
}
```

The last step is to tell Webpack that when it encounters HTML files, it should use the `html-loader` we just installed.

Open `webpack.config.js` and add the following to `module` > `rules`;

```javascript
const HtmlWebPackPlugin = require('html-webpack-plugin')
const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = {
  ///...
  module: {
    rules: [
      ///...
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: !isDevelopment }
          }
        ]
      }
    ]
  }
  ///...
}
```

**Note**: When running in production mode, the processed HTML will be automatically compressed (all whitespace removed) to make the file as small as possible to maximise transfer speed across the wire.

Go to your `package.json` file and add the following NPM script, so we can now start using Webpack Dev Server;

```json
"start": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js"
```

If your project does not already have `cross-env` installed, you can install it using the following command;

```shell
npm install --save-dev cross-env
```

`cross-env` makes using environment variables across different operating systems seamless.

Run the `start` command on the terminal.

```shell
npm start
```

Then open your browser to `http://localhost:8080` and observe the result as shown;

![Webpack 4 Dev Server](webpack-4-dev-server.png)

You should now see the **Hello World** header text is visible, meaning our HTML is working, and in the console we see **[WDS] Live Reloading enabled** output, so we know our JavaScript is being loaded and executed.

## Summary

Configuring Webpack Dev Server is quick and easy. The only complication we encounter is getting the correct paths for our compiled assets (JavaScript in this case). This problem is easily solved using `html-webpack-plugin` and `html-loader`, which together take care of processing our HTML files and injecting `<script>` and `<style>` tags automatically at build time for us.

## Next steps

If you would like to continue learning about Webpack, check out the next post in the [How to add Hot Module Reloading (HMR) to a React app](/webpack/how-to-add-hot-module-reloading-to-a-react-app/)
