---
layout: post
title: Webpack 4 from absolute scratch
description: Learn how to write your own Webpack configuration from absolute scratch quickly
date: 2018-12-31
updated: 2019-09-14
categories: ['Webpack', 'webpack-intro-series']
seriesTitle: Intro to Webpack mini series
group: 'Software Development'
---

Writing your own Webpack 4 configuration from absolute scratch is not strictly necessary. You could go online, find a basic Webpack configuration file and fork it/copy it to your project and use that as your starting point.

Whilst using a starter project is good for getting started quickly, it can be better to have a more indepth understanding of the process, which can help with adding/removing functionality (and debugging) later.

We will configure Webpack to do the following;

- Build our JavaScript, use Babel and various plugins to allow us to use the latest language features whilst maintaining backwards compatibility
- Enable hot module reloading (HMR)
- Build other assets such as SCSS and images
- Alternatively, we will look at how to use TypeScript instead of Babel

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

Assuming all is working well, you should notice that a new directory is created (called `dist`) and a new bundle called `main.js`. The second command runs the compiled code, which writes `Hello, World!` to the console.

This is our project so far;

![Webpack 4 initial setup](webpack-4-initial-config.png)

Feel free to ignore the yellow warning in the console. Webpack says that it has defaulted to production mode, which is fine for now. We will fix this later.

Let's move on.

## Configure Webpack to compile ES6+ code using Babel

Currently Webpack is not doing much for us. It takes our code and bundles it, minifies it, (because it defaults to production mode), then outputs the compiled code into a single file. The compilation step using Babel is required to maximise cross browser support.

An added benefit of using a compiler like Babel is that we can also configure it to support language features that are not currently standardised or supported by all browsers.

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

We added a module rule. There can be many rules for basically all different file extensions. Typically you will have different rules for JavaScript files, TypeScript files, images, SVG's and so on.

Each rule is ran by Webpack for every file that it encounters in our project. As part of the rule, we have provided a `test`, which is a regular expression. The regular expression is simple. If the file has a `.js` or `.jsx` file extension, it will be processed using the given loader, which here is `babel-loader`. As all the code in `node_modules` is not part of our project (and usually pre-compiled) we do not need to do that here, so we exclude that project and tell Webpack not to process any files within.

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

console.log(hello)
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

## Configure Webpack to compile ES6+ code using Babel and TypeScript

Babel is fantastic, I love it. Babel is fast, and easy to configure. TypeScript is great for writing code that scales well, is easier to maintain, and is self documenting. More and more projects are moving to using TypeScript, and that is great for the future of web development.

Babel and TypeScript are not mutually exclusive, they are not competing products. You can easily use TypeScript and Babel together, with a simple plugin called `@babel/preset-typescript`. Let us try it out.

Carrying on from where we left off, we need to make a few changes.

First rename `src/index.js` to `src/index.ts`. TypeScript is opt in, and JavaScript and TypeScript code can co-exist safely in the same project. To opt in, changing the file name is all that is required.

Open `src/index.ts`, delete all existing code, and add the following;

```javascript
interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

const newUser: User = {
  id: 123,
  username: 'jpreecedev',
  firstName: 'Jon',
  lastName: 'Preece'
}

console.log(newUser)
```

Here we have used a built in feature of TypeScript called **interfaces**. This allows us to define a contract for the shape of an object, in this case, a `User` object. Any object that implements user must implement all those properties.

Observe the `newUser` object next. Notice that it implements the `User` interface and has all the properties associated with that interface. Finally we output the value of `newUser`.

Before we can see this in action, we need to install and set up `@babel/preset-typescript`.

Run the following command;

```shell
npm install --save-dev @babel/preset-typescript
```

Next, open `.babelrc` and all `@babel/preset-typescript` as shown;

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"]
}
```

Then, open `webpack.config.js` and update the existing rule that currently only handles JavaScript files to include TypeScript files as well;

```diff
module.exports = {
  module: {
    rules: [
      {
-        test: /\.jsx?$/,
+        test: /\.(t|j)sx?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  }
};
```

If you do not have much experience with regular expressions, this might look a little confusing. All that is going on here is that we are saying to Webpack; _Babel Loader can process JS, JSX, TS, and TSX files_.

Finally, update `resolve` > `extensions` to automatically resolve both `.ts` and `.tsx` files, as follows;

```diff
resolve: {
-  extensions: [".js", ".jsx"]
+  extensions: [".js", ".jsx", ".ts", ".tsx"]
}
```

To run the code, run the following command;

```shell
npm run build -- --mode development && node ./dist/main.js
```

You should see the `newUser` object output to the console;

```json
{
  "id": 123,
  "username": "jpreecedev",
  "firstName": "Jon",
  "lastName": "Preece"
}
```

Congratulations, you now have support for TypeScript in your codebase. Note that `@babel/preset-typescript` does not have compile time checking, you will need the full blown TypeScript compiler for that, but this is enough to get off the ground quickly.

## Summary

Congratulations, you have written your first, albeit basic, Webpack configuration file. Subsequent posts will discuss how to flesh this out and get all the pieces in place to enable us to build and deploy a serious React single page application (SPA).

## Next steps

If you would like to continue learning about Webpack, check out the next post in the [Webpack tutorial series, How to create a production ready Webpack config](/webpack/how-to-create-a-production-ready-webpack-config/)
