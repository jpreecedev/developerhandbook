---
layout: post
title: Webpack 4 from absolute scratch
description: Learn how to write your own Webpack configuration from absolute scratch quickly
date: 2018-12-31
categories: ['Webpack', 'webpack-intro-series']
seriesTitle: Intro to Webpack mini series
featuredImage: ''
---

Writing your own Webpack 4 configuration from absolute scratch is not strictly necessary. You could go online, find a basic Webpack configuration file and fork it/copy it to your project and use that as your starting point.

Whilst using a starter project is good for getting started quickly, it is better to have a more indepth understanding of what is happening, to help with customisations and debugging later.

We will configure Webpack to do the following;

- Build our JavaScript, use Babel and various plugins to allow us to use the latest language features whilst maintaining backwards compatibility
- Enable hot module reloading (HMR)
- Build other assets such as SCSS and images

## Set up a simple Webpack project from scratch

Create a new folder called `webpack-4-react-from-scratch` and run `git init && npm init -y` to add Git support and create a `package.json` file with all the defaults, then open your favourite code editor in the folder just created.

Run the following command in your terminal to install Webpack and associated tools;

```shell
npm install --save-dev webpack webpack-cli webpack-dev-server
```

Add a `.gitignore` file with the following lines;

```text
dist
node_modules
```

Then create a Webpack configuration file, called `webpack.config.js`. We do not need any config yet.

Add the following code;

```javascript
module.exports = {}
```

We will utilise Webpack's defaults where possible. By default, Webpack will look for our code under a folder called `src`, so here we should have a file called `index.js`. Go ahead and create that.

Add the following line of JavaScript;

```javascript
console.log('Hello, World!')
```

Finally, add the following `build` NPM script to your `package.json`;

```json
"build": "webpack --config ./webpack.config.js"
```

Now run the following command;

```shell
npm run build && node ./dist/main.js
```

Assuming all is working well, you should notice that a new directory is created (called `dist`) and a new bundle called `main.js`. The second command in the script above runs that code, which writes `Hello, World!` to the console.

This is our project so far;

![Webpack 4 initial setup](webpack-4-initial-config.png)

Let's move on.

## Configure Webpack to compile ES6+ code using Babel

Currently Webpack is not doing much for us. It takes our code and bundles it, then outputs it to a single file. I personally dream of a world where this just works and no further configuration is needed. Alas, that is not currently the case, we must use Babel to make this happen for us.

We need Babel to take our nice shiny ES6+ code and make it work well in all browsers. An added benefit of using a transpiler like Babel is that we can also configure it to support language features that are not currently standardised or supported by all browsers.

Add the following packages using this command;

```shell
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader
```

What are these packages for?

- `@babel/core` is the Babel compiler core.
- `@babel/preset-env` is a preset that allows you to use the latest JavaScript without needing to worry about what transformations/polyfills are needed for browser support.
- `@babel/preset-react` is a wrapper around several transformations that enable JSX support and more.
- `babel-loader` is a plugin for Webpack. We will need to instruct Webpack to use Babel shortly.

Flip back to `webpack.config.js` and update to the following;

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
```

Here we have added a module rule. There can be many rules. Each rule is run by Webpack for every file that it encounters in our project. As part of the rule, we have provided a `test`, which is a regular expression. The regular expression is simple. If the file has a `.js` or `.jsx` file extension, it will be processed using the given loader, which here is `babel-loader`. As all the code in `node_modules` is not part of our project (and usually pre-compiled) we do not need to do that here, so we exclude that project and tell Webpack not to process any files within.

We need to tell Babel (via `babel-loader`) to use our presets. Create a new file called `.babelrc` and add the following code;

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

When Babel runs, it will look for `.babelrc` and use the presets automatically.

**Note**: We have added `resolve`, with an `extensions` array with JS and JSX file extensions. I have added this here because it will clean up our imports in our JavaScript files, meaning we will not have to include the extension as part of the import. This is strictly not necessary but I always like to have tidy code when possible.

With `resolve` > `extensions`, this;

```javascript
import frank from './frank.js'
```

becomes

```javascript
import frank from './frank'
```

Neater huh?

Update your `index.js` as follows;

```javascript
const obj = {
  hello: 'World'
}

const { hello } = obj

console.log('hello')
```

So much ES6 code here. We have used `const` and we have also used destructuring.

Run the following command in your console;

```shell
npm run build -- --mode development && node ./dist/main.js
```

This will prevent the bundle from being minifed so we can see it properly. Open `main.js` (in the `dist` folder) and observe the code as shown (which should be somewhere near the bottom);

```javascript
eval(
  'var obj = {\n  hello: "World"\n};\nvar hello = obj.hello;\nconsole.log(hello);\n\n//# sourceURL=webpack:///./src/index.js?'
)
```

Notice that `const` and our destructuring have disappeared, and has been rewritten in ES5 compatible language, so we know Babel is working.

Observe the output from the script we just ran, notice that `World` has been written out to the console!

Congratulations, you have written your first, albeit basic, Webpack configuration file. Subsequent posts will discuss how to flesh this out and get all the pieces in place to enable us to build and deploy a serious React single page application (SPA).

## Summary

We have built a very simple Webpack configuration file that when ran takes our ES6 code, transpiles it to ES5, bundles it, and outputs it to disk. Subsequent posts will discuss how to add all the pieces to build a serious React single page application (SPA).
