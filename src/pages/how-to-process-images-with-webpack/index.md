---
layout: post
title: How to process images with Webpack
description: Webpack, with various plugins, is fantastic for processing assets, including images.  We can configure Webpack to automatically compress and cache-bust our images at build time.
date: 2018-12-31
categories: ['Webpack']
tags: ['webpack', 'javascript', 'babel', 'webpack-intro-series']
seriesTitle: Intro to Webpack mini series
---

With a couple of small Webpack plugins we can add the ability to be able to import images directly in our JavaScript files, and also process those images (compress them).

Run the following command in your terminal to install the required plugins;

```shell
npm install --save-dev file-loader image-webpack-loader
```

What are these packages for?

- `file-loader` resolves your `import`s and copies the file to the output directory (usually with a randomly generated name, for cache busting)
- `image-webpack-loader` processes the images using another package called `imagemin`

**Note** that `image-webpack-loader` takes many options. For a more comprehensive explanation, see the [project GitHub repository](https://github.com/tcoopman/image-webpack-loader).

Open `webpack.config.js` and add the new loader as follows;

```javascript
module.exports = {
  ///...
  module: {
    rules: [
      ///...
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: !isDevelopment
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              webp: {
                quality: 75
              }
            }
          }
        ]
      }
      ///...
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.gif', '.png', '.jpg', '.jpeg', '.svg']
  }
  ///...
}
```

The loader can process the following file extensions; `.gif, .png, .jpg, .jpeg, .svg`.

To simplify our imports, we can add those file extensions to `resolve` > `extensions`.

Now let's test this out. Grab an image and drop it into a new folder under `src` called `images`. (I have one called `jonpreece-square.png`)

Open `app.js`, and import the image as follows;

```javascript
import jonpreece from './images/jonpreece-square'
```

Now update the `App` component as follows;

```jsx
function App() {
  return (
    <>
      <img src={jonpreece} alt="Jon Preece" />
      <h2 className={styles.red}>This is our React application!</h2>
    </>
  )
}
```

To use the image, we simply set the `src` attribute of an `img` tag and the rest is taken care of for us.

![Webpack 4 with Image Webpack Plugin](webpack-4-image-plugin.png)

## Summary

Using two Webpack plugins, we can import images directly into our JavaScript files, and process those images at build time (compress them) to make our website load faster and have automatic cache busting.
