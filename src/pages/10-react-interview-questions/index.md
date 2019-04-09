---
layout: post
title: 10 React.js interview questions (and possible answers)
description:
date: 2019-04-10
categories: ['React', 'practical-react-series']
seriesTitle: Practical React Developer
featuredImage: './interview.jpg'
---

## What are fragments in React?

Fragments in React allow for returning multiple elements without the need for a container element.

For example;

```javascript
render() {
  return (
    <img />
    <input />
    <button>Click</button>
  )
}
```

The above code is invalid because the `render` function (when inheriting from a `class`, and also applies to functional components' return value) can only return one single value, but this example returns three values.

To resolve the issue, a container element (such as a `div`) could be used. However, container elements add unnecessary depth to the DOM and can also break layout of certain CSS properties (such as CSS grid).

Fragments allow you to return multiple elements without the container element.

The following is valid;

```jsx
render() {
  return (
    <React.Fragment>
      <img />
      <input />
      <button>Click</button>
    </React.Fragment>
  )
}
```

As is;

```jsx
render() {
  return (
    <>
      <img />
      <input />
      <button>Click</button>
    </>
  )
}
```

(The above example [requires Babel 7](https://reactjs.org/blog/2017/11/28/react-v16.2.0-fragment-support.html#support-for-fragment-syntax)).

**Difficulty**: Easy.<br/>
**Reasoning**: To help the candidate feel more relaxed and start the conversation flowing.

## What is React.js, and explain why might you use it on a project?

## Why is React-DOM a seperate package to React?

React is an isomorphic library which contains many helper functions for creating components and managing state.

ReactDOM, which is also isomorphic, is used for creating and updating the DOM in the context of web pages. ReactDOM is designed to run in desktop and mobile browsers, such as; Chrome, Firefox etc.

ReactDOM was split from React so that other UI rendering libraries (renderers) could be use in other scenarios.

Some examples of other renderers include; [React ART, React Native, react-pdf and more](http://iamdustan.com/react-renderers/).

**Difficulty**: Easy.<br/>
**Reasoning**: Demonstrates that the interviewee has a broader understanding of what React is, and how rendering works at a high level.

## How do you unit test a React Component?

## What is JSX?

JSX is an abstraction over `React.createElement`. JSX allows us to write HTML-like code directly in our JavaScript files. At build time (usually), JSX is converted (compiled) into JavaScript entirely, as JSX itself cannot be interpreted by any browser.

Following on from examples given earlier, we can seen that when, for example, our JSX is compiled using `@babel/preset-react`, we see the following output;

```javascript{13}
function (_React$Component) {
  _inherits(Interview, _React$Component);

  function Interview() {
    _classCallCheck(this, Interview);

    return _possibleConstructorReturn(this, _getPrototypeOf(Interview).apply(this, arguments));
  }

  _createClass(Interview, [{
    key: "render",
    value: function render() {
      return React.createElement(React.Fragment, null, React.createElement("img", null), React.createElement("input", null), React.createElement("button", null, "Click"));
    }
  }]);

  return Interview;
}(React.Component);
```

Line 12 (the highlighted line) shows (abbreviated for clarity);

```jsx
<img />
```

Was converted to;

```javascript
React.createElement('img', null)
```

This is JavaScript code that can now be read and executed by the runtime (browser).

**Difficulty**: Intermediate.<br/>
**Reasoning**: Demonstrates that the interviewee has a deeper understanding of the development ecosystem, Babel, transpilation/compilation.

## What is React Context API?

## What are hooks in React?

## What is Redux?

## When/why do you need to use keys on elements

## What is the difference between rendering and hydrating a component?

## BONUS: Are you a full-stack developer, or a front-end developer?

## Summary
