---
title: How to configure SCSS modules for Webpack
description: SCSS modules are a fantastic way of writing clean, self contained styles, that are usually consumed by components
pubDate: 2018-12-31
updated: 2019-09-16
categories: ["Webpack", "webpack-intro-series"]
seriesTitle: Intro to Webpack mini series
group: "Software Development"
---

SCSS is a popular choice for styling websites, thanks to features such as; mixins, variables and functions, which CSS historically never had native support for. One of the most challenging aspects of styling using CSS is the **C**ascade, meaning that elements can inherit style properties from many other CSS selectors. This can be problematic, and SCSS can be a solution to make this problem more managable.

SCSS modules are usually directly tied to one specific component/element, and are not typically re-used.

This post explores how to configure Webpack to support standard SCSS (`your-styles.scss`) and SCSS modules (`your-component.module.scss`).

**We assume that you already have a Webpack configuration file**. If you need help getting started, please check out our post [Webpack 4 from absolute scratch](/webpack/webpack-4-from-absolute-scratch/).

If you do not already have the following line in your Webpack configuration file, go ahead and add it;

```javascript
const isDevelopment = process.env.NODE_ENV === "development"
```

This is used to optimize your bundles only when building for production, which should result in faster development builds.

## How to add support for SCSS and SCSS modules in Webpack

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
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
```

Then add it as a plugin;

```diff
module.exports = {
  ///...
  plugins: [
    ///...
+    new MiniCssExtractPlugin({
+      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
+      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
+    })
  ]
}
```

We add a hash to the filename of our bundles for easy and efficient cache busting.

Next, add our two new loaders, as follows;

```diff
module.exports = {
  ///...
  module: {
    rules: [
      ///...
+      {
+        test: /\.module\.s(a|c)ss$/,
+        loader: [
+          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
+          {
+            loader: 'css-loader',
+            options: {
+              modules: true,
+              sourceMap: isDevelopment
+            }
+          },
+          {
+            loader: 'sass-loader',
+            options: {
+              sourceMap: isDevelopment
+            }
+          }
+        ]
+      },
+      {
+        test: /\.s(a|c)ss$/,
+        exclude: /\.module.(s(a|c)ss)$/,
+        loader: [
+          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
+          'css-loader',
+          {
+            loader: 'sass-loader',
+            options: {
+              sourceMap: isDevelopment
+            }
+          }
+        ]
+      }
      ///...
    ]
  },
  resolve: {
-    extensions: ['.js', '.jsx']
+    extensions: ['.js', '.jsx', '.scss']
  }
  ///...
}
```

**Note** to simplify our imports in our JavaScript file, we should add the `.scss` file extension to `resolve` > `extensions` as shown above.

The first rule only applies to files with the `.module.scss` or `.module.sass` file extensions. First, SCSS is converted to CSS (`sass-loader`), then run through `css-loader` to process `@import()`, `url()` etc, then `style-loader` (to be appended to the DOM) or Mini CSS Extract Plugin to externalise the CSS when doing a production build.

The CSS loader is important here because it is also responsible for transforming our SCSS class names into a CSS modules convention. We are essentially breaking the cascade here to prevent our styles effecting other elements on the page and vice-versa.

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
import styles from "./app.module"
```

We do not need to include the file extension because we have already told Webpack to look for files with `.scss` file extensions automatically.

Now for the usage;

```jsx
function App() {
  return <h2 className={styles.red}>This is our React application!</h2>
}
```

Pretty straightforward huh? No matter how `css-loader` transforms our class name (it probably gets renamed to something random like `_1S0lDPmyPNEJpMz0dtrm3F`), we can reference the style using the same name we gave it in the `app.module.scss`.

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
import "./global"
```

And the final result...

![Webpack 4 CSS Modules](/assets/webpack-4-css-modules.png)

Beautiful. I should be a designer.

## Summary

SCSS modules take quite a bit of effort to set up, needing no fewer than 5 primary Webpack plugins to get working properly, but the initial set up is well worth the effort. SCSS modules enable us to write compartmentalised styles, which can help make maintenance easier in the future as your application grows.
