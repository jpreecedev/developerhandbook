---
layout: post
title: How to configure SCSS modules for Webpack
description: SCSS modules are a fantastic way of writing clean, self contained styles, that are usually consumed by components
date: 2018-12-31
categories: ['Webpack', 'JavaScript']
tags: ['webpack', 'javascript', 'babel']
---

**Please note, this post is part of a wider series (see the end for links)**

Your website will look pretty plain without some styles. SCSS is a popular choice for styling and is fairly straightforward to configure.

We will focus on SCSS modules and global SCSS, so let's get started.

Run the following command in your terminal to install Sass and related tooling;

```shell
npm install --save-dev node-sass sass-loader style-loader css-loader mini-css-extract-plugin
```

What are these packages for?

- `node-sass` provides binding for Node.js to LibSass, a Sass compiler.
- `sass-loader` is a loader for Webpack for compiling SCSS/Sass files.
- `style-loader` injects our styles into our DOM.
- `css-loader` interprets `@import` and `@url()` and resolves them.
- `mini-css-extract-plugin` extracts our CSS out of the JavaScript bundle into a separate file, essential for production builds.

We need to add two loaders, one for global styling and one for componentised styling, referred to as SCSS modules. SCSS modules play well with component-based libraries/frameworks like React.

By default, Webpack will include our compiled CSS in our JavaScript bundle (`main.js`). Whilst this works just fine for development builds, we do not want this for production. We will use Mini CSS Extract Plugin only when building for production, because it slows the build slightly and we want to keep our builds as efficient as possible.

Start by importing Mini CSS Extract Plugin into your `webpack.config.js` file as follows;

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
```

Then add it as a plugin;

```javascript
module.exports = {
  ///...
  plugins: [
    ///...
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
    })
  ]
}
```

We discussed cache busting earlier in this post when discussing our bundled JavaScript. Same applies here so when we are running a production build we want to add a hash to the filename.

Now we need to add our two new loaders, as follows;

```javascript
module.exports = {
  ///...
  module: {
    rules: [
      ///...
      {
        test: /\.module\.s(a|c)ss$/,
        loader: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              camelCase: true,
              sourceMap: isDevelopment
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment
            }
          }
        ]
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        loader: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment
            }
          }
        ]
      }
      ///...
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  }
  ///...
}
```

**Note** to simplify our imports in our JavaScript file, we should add the `.scss` file extension to `resolve` > `extensions` as shown above.

The first rule only applies to files with the `.module.scss` or `.module.sass` file extensions. First, SCSS is converted to CSS (`sass-loader`), then run through `css-loader` to process `@import()`, `url()` etc, then `style-loader` (to be appended to the DOM) or Mini CSS Extract Plugin to externalise the CSS when doing a production build.

The CSS loader is important here because it is also responsible for transforming our SCSS class names into a CSS modules convention. We are essentially breaking the cascade here to prevent our styles effecting other elements on the page and vice-versa. The generated class names are comparable to those described by the [BEM approach to naming](http://getbem.com/introduction/).

The second rule is very similar to the first, except we do not transform the class names.

With all the configuration out of the way, we now need some styles so that we can test everything is working.

Under `src`, create a new file called `app.module.scss` and add the following coode;

```css
.red {
  color: red;
}
```

Any element that gets the class `red` will have a red foreground colour.

Open `app.js` and import the SCSS file as follows;

```javascript
import styles from './app.module'
```

We do not need to include the file extension because we have already told Webpack to look for files with `.scss` file extensions automatically.

Now for the usage;

```javascript
function App() {
  return <h2 className={styles.red}>This is our React application!</h2>
}
```

Pretty straightforward huh? No matter how `css-loader` transforms our class name (it probably gets renamed to something like `app-module__red___1S0lD`), we can reference the style using the same name we gave it in the `app.module.scss`.

Next, we need some global styles.

Create a new file called `global.scss` under `src` and add the following;

```css
body {
  background-color: yellow;
}
```

This will give our webpage a lovely yellow background.

Open `index.js` and import the global styles as follows;

```javascript
import './global'
```

And the final result...

![Webpack 4 CSS Modules](webpack-4-css-modules.png)

Beautiful. I should be a designer.

## Summary

SCSS modules take quite a bit of effort to set up, needing no fewer than 5 primary Webpack plugins to get working properly, but the initial set up is well worth the effort. SCSS modules enable us to write compartmentalised styles, which can help make maintenance easier in the future as your application grows.
