---
layout: post
title: Webpack 4 and TypeScript from scratch
description: Learn how to write your own Webpack configuration, that utilises TypeScript, from scratch
date: 2019-09-15
categories: ['Webpack', 'webpack-intro-series']
seriesTitle: Intro to Webpack mini series
group: 'Software Development'
featuredImage: './typescript.jpeg'
---

Webpack is a fast, efficient, very powerful code bundler. TypeScript is a compiler (or transpiler if you prefer) which adds support for type checking to your project. Support for type checking is useful and powerful for enabling better development time tooling (such as improved auto-complete) and reduced runtime bugs. As your team scales to include more people, types help with the maintainability and structure of your codebase.

You may not need to write your own Webpack configuration files, especially if you are using a starter project like Create React App, but writing your own can help you develop a better understanding of what your tooling is doing, which can help with adding/removing functionality (and debugging) later.

We will configure Webpack to do the following;

- Build our JavaScript using TypeScript
- Inject the `script` tags for our JavaScript automatically
- How to enable hot module reloading (HMR)

Let's get started.

## How to transpile TypeScript code using Webpack

Create a new folder called `webpack-typescript-absolute-scratch` and run `git init && npm init -y` to add Git support and create a `package.json` file with all the defaults, then open your favourite code editor in the folder just created.

Run the following command in your terminal to install Webpack and associated tools;

```shell
npm install --save-dev webpack webpack-cli typescript awesome-typescript-loader source-map-loader
```

Add a `.gitignore` file with the following lines;

```text
dist
node_modules
```

Then create a Webpack configuration file, called `webpack.config.js`.

Add the following code;

```javascript {7}
const { resolve } = require('path')

const isDevelopment = process.env.NODE_ENV !== 'production'

const config = {
  entry: {
    main: resolve('./src/index.tsx')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: ['awesome-typescript-loader?module=es6'],
        exclude: [/node_modules/]
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  }
}

module.exports = config
```

We will utilise Webpack's defaults where possible. By default, Webpack will look for our code under a folder called `src`, so here we should have a file called `index.js`. However, as we are using TypeScript we will need to override that with `./src/index.tsx` (as shown above on the highlighted line).

You may have noticed that we have included `.js` in the list of file extensions to be resolved. This is required for when Webpack processes the `node_modules` folder.

Create a new file called `index.tsx` under `src` and add the following;

```typescript
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => <p>Hello, World!</p>

ReactDOM.render(<App />, document.getElementById('root'))
```

We have referenced React, so run the following commands to install React, React DOM and the associated TypeScript definition files.

```shell
npm install --save react react-dom
npm install --save-dev @types/react @types/react-dom
```

Then add a configuration file in the root level of your project, called `tsconfig.json`, and add the following code;

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "checkJs": false,
    "skipLibCheck": false,
    "noImplicitAny": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react"
  },
  "exclude": ["node_modules", "webpack.*.js"]
}
```

This configures TypeScript to build our code in a sensible way that can be consumed in modern browsers, and also instructs TypeScript on how to resolve JSX.

Finally, add the following `build` NPM script to your `package.json`;

```json
"build": "webpack --config ./webpack.config.js"
```

Now run the following command;

```shell
npm run build
```

Your bundle has been built, but it is not particularly useful yet.

## How to inject script tags into your HTML files automatically using Webpack

So far, we have configured Webpack to transpile TypeScript files, but not much else, so let us fix that. We will utilise a Webpack plugin called `html-webpack-plugin` to take care of creating a `script` tag and injecting that `script` tag into a given HTML file automatically. This is useful as it means we do not have to hard code the path or even know the name of the bundle being generated.

Create a new file called `index.html` in your `src` directory and add the following code;

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>
      Hello from TypeScript and Webpack
    </title>
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
```

To make this injection magic happen, install `html-webpack-plugin` using the following command;

```shell
npm install --save-dev html-webpack-plugin html-loader
```

We need `html-loader` also so we can handle HTML files.

Now open `webpack.config.js` make the following changes;

```diff
const { resolve } = require('path')

+const HtmlWebPackPlugin = require('html-webpack-plugin')
const isDevelopment = process.env.NODE_ENV !== 'production'

const config = {
  entry: {
    main: resolve('./src/index.tsx')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: ['awesome-typescript-loader?module=es6'],
        exclude: [/node_modules/]
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre'
-      }
+      },
+      {
+        test: /\.html$/,
+        use: [
+          {
+            loader: 'html-loader',
+            options: { minimize: !isDevelopment }
+          }
+        ]
+      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
-  }
+  },
+  plugins: [
+    new HtmlWebPackPlugin({
+      template: './src/index.html',
+      filename: './index.html'
+    })
+  ]
}

module.exports = config
```

**Note**: When running in production mode, the processed HTML will be automatically compressed (all whitespace removed) to make the file as small as possible to maximise transfer speed across the wire. Extra bonus.

Re-run the build script and have a look at the generated HTML file in the `dist` folder. Notice that the `script` tag has been automatically generated and inserted for you.

Technically, you can load up the page in the browser now. You do ideally need a HTTP server to do this.

Install and run a basic HTTP server using the following commands;

```shell
npm install -g http-server && http-server ./dist -o
```

This should open a new browser window, and you should see `Hello, World` on screen.

Congratulations, your web app is now working. We can go one step further and use a real development server, which has extra features like Hot Module Reloading (HMR), which should help you get your changes on screen faster.

## How to add Webpack Dev Server and Hot Module Reloading (HMR) to your project

Webpack Dev Server is used as a basic HTTP web server with the added benefit of supporting Hot Module Reloading (HMR), which enables your code changes to get to your screen faster whilst often maintaining the state of your application.

Start by installing Webpack Dev Server, and associated type definitions;

```shell
npm install --save-dev webpack-dev-server @types/webpack-env cross-env
```

Then add a new script to the `scripts` section in your `package.json` file to utilise Webpack Dev Server;

```diff
"scripts": {
+  "start": "cross-env NODE_ENV=development webpack-dev-server --hot --config webpack.config.js",
  "build": "webpack --config ./webpack.config.js"
},
```

Final step, open your `index.tsx` file add the following code;

```diff
import React from "react";
import ReactDOM from "react-dom";

const App = () => <p>Hello, World!</p>;

+if (module.hot) {
+  module.hot.accept();
+}

ReactDOM.render(<App />, document.getElementById("root"));
```

This enables Hot Module Reloading (HMR) in your project.

Run `npm start` and open your browser to `http://localhost:8080`. You should see your application running in the browser, saying `Hello, World!`. Open up `index.tsx`, make a small change, press `save` and see your page automatically update itself. Sweet sweet Hot Module Reloading (HMR) FTW.

## Summary

In this tutorial we explored how to configure Webpack to transpile TypeScript files. As an added bonus we added support for automatically injecting `script` tags into our HTML files, and we added Webpack Dev Server so we could enable Hot Module Reloading (HMR).
