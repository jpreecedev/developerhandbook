---
layout: post
title: 10 React.js interview questions (and possible answers)
description:
date: 2019-04-10
categories: ['React', 'practical-react-series']
seriesTitle: Practical React Developer
featuredImage: './interview.jpg'
group: 'Personal Growth'
---

Interviewing for a developer role does not have to be a stressful experience. Interviewing can be fun. Interviewing can be an opportunity to geek out about the tools and technologies you use every day.

More often than not, when you interview for a company you will be asked a broad range of questions about various aspects of software engineering, including, but not limited to, the following;

- Problem solving
- Algorithms and data structures
- Agile, Scrum, Kanban and other working practices
- Specific tools and technologies
- Experience

Interviews can consist of face-to-face contact, online meetings, whiteboarding, telephone conversations, and the combination of all of the above (especially for large technology companies).

There is an infinite list of possible questions you may be asked, or possible tasks you may be asked to perform, so a little preparation is a good idea.

To keep the post specific, let us talk only about React in the context of applying for a front-end developer role. We may explore other aspects of the interview process in follow up posts.

## What are fragments in React?

Fragments in React allow for returning multiple elements without the need for a container element.

For example;

```jsx
render() {
  return (
    <img />
    <input />
    <button>Click</button>
  )
}
```

The above code is invalid because the `render` function (when inheriting from a `class`, and also applies to functional components' return value) can only return one single value, but this example returns three values. (This is a limitation in many programming languages, not just a limitation of React or JavaScript).

To resolve the issue, a container element (such as a `div`) could be used. However, container elements add unnecessary depth to the DOM and can also break layout of certain CSS ol (such as CSS grid).

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

**Difficulty**: Entry.<br/>
**Reasoning**: To help the candidate feel more relaxed and start the conversation flowing.

## What is React.js, and explain why might you use it on a project?

## Why is React-DOM a seperate package to React?

React is an isomorphic library which contains many helper functions for creating components and managing state.

ReactDOM, which is also isomorphic, is used for creating and updating the DOM in the context of web pages. ReactDOM is designed to run in desktop and mobile browsers, such as; Chrome, Firefox etc.

ReactDOM was split from React so that other UI rendering libraries (renderers) could be use in other scenarios.

Some examples of other renderers include; [React ART, React Native, react-pdf and more](http://iamdustan.com/react-renderers/).

**Difficulty**: Entry.<br/>
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

React Context provides a mechanism for sharing state between components without needing to directly pass props down the component tree.

- React Context API consists of a `Provider` and a `Consumer`. The `Provider` element wraps a hierarchical tree of components, and makes state available to the `Consumer` anywhere within the same tree. The `Consumer` can access state from the `Provider` regardless of depth, as long as both are within the same tree.
- As React Context is hierarchical and applied to a tree of components, it is normal to have many Contexts in the same application with no conflicts to unexpected interactions between them.
- Context is not mutally exclusive to existing state management tools, like Redux, local state, `useState` etc.

Context is best used when working with small amounts of state (closer to the single responsibility principal).

## What are hooks in React?

## What is Redux?

## When/why do you need to use keys on elements

## What is the difference between rendering and hydrating a component?

## BONUS: Are you a full-stack developer, or a front-end developer?

**Warning:** Incoming opinion. This reflects _my personal experience and opinions_ and your views may vary!

How a developer answers this question speaks a lot about their skillset or their perception of their skillset.

A developer will fall in to one of three categories;

- A back-end developer
- A front-end developer
- A full-stack developer

A **back-end** developer has knowledge and expertise in back-end concerns, tooling, languages, frameworks, and so on. The have little-to-no experience of front-end considerations, and they never claim to (a true back-end developer will often be fast to tell you how they do not like working on the front-end!).

A **front-end** developer has knowledge and expertise in front-end concerns, tooling, languages, frameworks, and so on. A front-end developer will often (although not always) have limited knowledge and experience of back-end concerns, but they recognise that this is not their primary skillset. During an interview, a front-end developer may assert that they have working knowledge and experience with back-end systems, but do not necessary consider that to be a primary skillset.

A **full-stack** developer. <1% of the time a true full-stack developer will have comprehensive knowledge and experience of both back-end and front-end ecosystems. A true full-stack developer will be as comfortable writing dockerfiles, cloudformation templates, updating DNS records, and configuring build pipelines as they are vertically centering text using CSS.

More often than not, somebody who claims to be a full-stack developer will in fact be a back-end developer who has had minimal exposure both JavaScript & CSS and is dificient in both areas compared to a front-end developer.

With this said, be careful when applying for a job that specifically hires for a full-stack developer, and ideally specialise in either the front-end or back-end.

## Summary
