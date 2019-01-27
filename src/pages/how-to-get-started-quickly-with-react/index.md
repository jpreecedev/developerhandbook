---
layout: post
title: How to get started quickly with React
description: Thankfully there are several ways, with varying degrees of difficultly, to get started with React quickly.
date: 2019-01-02
categories: ['React']
tags: ['react', 'javascript']
---

This post explores 3 separate ways to get a React application up and running quickly.

## TL;DR

To get start quickly with React, you have three choices;

- [CodeSandbox](https://codesandbox.io/s/new)
- [Create React App](https://reactjs.org/docs/create-a-new-react-app.html)
- [Parcel.js](/parcel.js/build-a-react-web-app-with-parcel/)

## How to get started with React using CodeSandbox

CodeSandbox is one of the most useful tools on the web today. CodeSandbox enables you to forget all about the complexities of setting up a development environment and enables you to _just start coding_. CodeSandbox is truly a breath of fresh air and a pleasure to work with.

You can create a new CodeSandbox by following this link; [New React CodeSandbox](https://codesandbox.io/s/new)

![New React CodeSandbox](new-react-codesandbox.png)

No configuration is needed here, you can make changes to the code and see those changes immediately in the preview on the right.

### Pros of CodeSandbox

- Very quick and easy to get started, no configuration needed
- Full syntax highlighting, intellisense (autocomplete), and console for detailed feedback messages
- Has a built-in test runner so we can write unit tests and run them right in the browser
- Good integration with GitHub so we can move away from CodeSandbox when the time is right

### Cons of CodeSandbox

- Best for small projects

## How to get started with React using Create-React-App

[Create-React-App](https://facebook.github.io/create-react-app/) is the de facto standard for new developers getting started with React. Create-React-App is best initialised using the CLI, so Node.js and some basic knowledge of how to use the terminal is required.

Create-React-App comes with MANY features out of the box, including;

- React, JSX, ES6, TypeScript and Flow support (as well as many additional plugins that enable you to use newer syntax)
- Autoprefixing for CSS
- Unit test runner
- Development server with hot module reloading (HMR)
- Production build scripts
- Service worker for offline support

To create a new Create-React-App, run the following commands in your terminal;

```shell
npx create-react-app my-app
cd my-app
npm start
```

Now you can browse to `http://localhost:3000` and see the site. Open the code in your favourite editor and you will see that any changes you make are immediately displayed in the browser (it updates every time you save!).

![Create React App](create-react-app.png)

### Pros of Create-React-App

- Very fast and easy to get started
- Has a broad range of functionality out-of-the-box
- Is production ready

### Cons of Create-React-App

- Has a broad range of functionality out-of-the-box, can be complex
- Docs almost always refer to `yarn` instead of `npm`. Most people do not have `yarn` and would have to know to install in separately, or that `npm` can usually be used in its place
- All the configuration is "brushed under the rug" and you have to irreversibly "eject" the code to be able to make configuration changes

## How to get started with React using Parcel.js

Parcel.js is the new kid on the block, and is a Webpack competitor. Parcel.js takes your code, analyses it and builds it automatically, no configuration needed. I have a more comprehensive [Parcel.js React tutorial](/parcel.js/build-a-react-web-app-with-parcel/), but this is what you need to know;

- You create your `index.html` file, `index.js` file and link the two using a `script` tag.
- Then add your React code to `index.js` in the same way that CodeSandbox does
- From your terminal, you call `npm run parcel ./index.html` and your code will be built and hosted in the browser automatically. That is it!

### Pros of Parcel.js

- Fast, lightweight
- No configuration
- Is production ready

### Cons of Parcel.js

- Less widely used than other tools like Webpack (community is smaller)

## More depth: What the heck is JSX anyway?

This post has mentioned JSX several times and offered no explanation as to what that is, so let's just tidy that up.

When JSX first burst onto the screen, it was possibly one of the most controversial technologies in the history of web development (I am barely even exaggerating!).

Since the dawn of time, us developers have _known_ that the ultimate web development sin was to mix concerns. HTML, CSS, and JavaScript should all live in their own separate files and be completely disconnected from each other. This has been reinforced by countless books, YouTube videos and training workshops.

JSX not only blurs the lines, but it straight up requires you to mix your concerns into one single file.

Take the following example;

```jsx
import React from 'react'
import ReactDOM from 'react-dom'

function App() {
  return (
    <div className="App" style={{ backgroundColor: 'yellow' }}>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

Yes, this is a JavaScript file. Specifically it is a JavaScript file that contains JSX (sometimes these files have a `.jsx` file extension).

Here we have a mix of JavaScript, HTML, and inline CSS all in the same place. We could also import CSS and have it included directly in our JavaScript bundles (although you probably would want to extract it as part of your build pipeline).

Let's be clear, this code does not work in the browser (...without a lot of legwork! See my post on Medium, [You might not need a build toolchain](https://itnext.io/you-might-not-need-a-build-toolchain-324edcef7f9a) for more details). To understand why, we have to understand what happens to JSX when built/transpiled.

Take the following snippet (some bits have been removed for brevity).

```jsx
'use strict'

var _react = require('react')
var _react2 = _interopRequireDefault(_react)
var _reactDom = require('react-dom')

function App() {
  return _react2.default.createElement(
    'div',
    { className: 'App', style: { backgroundColor: 'yellow' } },
    _react2.default.createElement('h1', null, 'Hello CodeSandbox'),
    _react2.default.createElement('h2', null, 'Start editing to see some magic happen!')
  )
}

var rootElement = document.getElementById('root')
_reactDom2.default.render(_react2.default.createElement(App, null), rootElement)
```

This is what our React code looks like when it has been run through our compiler.

React provides a function called `createElement` that takes the type of element, its attributes, content, and children. At runtime React evaluates all this code and eventually the DOM is built from it.

In a nutshell, JSX saves us the considerable pain of having to write and maintain code like this and provides a higher-level API that most developers are very comfortable with and that significantly reduces the learning curve.

## Summary

Thankfully there are several ways, with varying degrees of difficultly, to get started with React quickly. CodeSandbox is the quickest and easiest choice, as it "just works" right in the browser. Create React App is a fantastic starting point with a rich feature set out of the box. Rolling your own project from scratch using a build tool like Parcel.js is also very powerful, whilst requiring more setup.
