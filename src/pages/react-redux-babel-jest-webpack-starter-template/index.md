---
layout: post
title: A bare bones React boilerplate, featuring Webpack 4, React, Redux, Jest, and Babel 7
description: Boilerplate and template projects are awesome, however, sometimes they can be quite bloated.  This is a barebones starter template.
date: 2018-09-22
categories: ['React', 'Webpack', 'JavaScript']
featuredImage: ''
---

I love template projects.

In fact, I use them all the time. Template projects, seed projects, starter projects, whatever you want to call them, they are fantastic. Starter templates help you get up and running very quickly and can be very useful and powerful when learning something new.

Many template projects I see around the web are bloated with every feature under the sun. Having a long list of features can be amazing, however, some projects have grown significantly... which can increase complexity, the learning curve, bundle size, and reduce performance.

Under no circumstances am I suggesting that using a popular open source larger starter project is a bad idea. However, when working on projects I like to start with the minimum feature set required to get the project off the ground, and then add features on demand.

I created a repository on GitHub to cater for my exact needs, [webpack 4 scratch](https://github.com/jpreecedev/webpack-4-scratch). The post provides an overview of the out-of-the-box functionality and reasoning behind decisions made.

## Overview

Before we get into the details, lets answer the most important question first. What functionality does this starter provide?

- React, Redux and React Router pre-configured out-of-the-box.
- Development build with hot module reloading. Make a change and see it instantly without a full page refresh.
- Production build with minification of JavaScript, CSS, HTML and other assets. Ship an optimized build to a production environment.
- Uses Babel 7 to maximise cross browser support of your JavaScript and allows you to write code against the latest standards.
- Write comprehensive unit and integration tests using Jest. Gives confidence that code works as it should.
- Code style is standardized. The project is pre-configured to adhere to and enforce the latest code quality/consistency guidelines using ESLint & Prettier, not only on your machine but your collegues as well.

That is about it. Everything you need to get started.

I primarily am a front-end developer, and most new projects I start, or projects I work on, use React, a state management system, and a router.

## The fastest way to get started

To use this starter project, run the following commands;

```bash
git clone https://github.com/jpreecedev/webpack-4-scratch.git my-app
cd my-app
npm install
npm start
```

Now open your browser to `http://localhost:8080` to see the welcome page.

![Webpack 4 Starter Project](starter-project-in-chrome.png)

You should notice in Chrome developer tools that Hot Module Replacement (HMR) is enabled and active. The site is minimal with a few components. Try clicking the links at the bottom to navigate between pages. Clicking the green button will display an `alert`. If you check the code, you will see that a JavaScript decorator is used to change the message dynamically. Pretty sweet huh!

## React, React Router and Redux out-of-the-box

The project has been pre-configured to use the latest versions of React, React Router and Redux out-of-the-box.

Routing is configured at the application entry point. This repo does not create sub routes, nested routes, etc. You would need to configure this yourself should the project grow to justify the need to do so.

## Babel 7 for cross browser support

I mentioned that this starter project uses Babel 7 to maximise cross browser support. Well what does that mean exactly?

Babel 7 takes your new, modern, shiney ES6/ES7+ JavaScript code and transpiles (converts) it to ES5. This is a good thing because ES5 was around for a very long time and has excellent cross browser support. 99% of the code you write will be compatible with browsers all the way back to at least Internet Explorer 9.

As well as excellent cross browser support, Babel can also enable support for experimental features of the language that have not yet been ratified. These enhancements enable you to write code using emerging standards. I have added support for several emerging standards that are very likely to get promoted to full support in future versions of the ECMAScript specification.

- Class properties
  You never have to `bind` the `this` context of functions again thanks to this plugin. Read more on [Babel class properties documentation](https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties). (as of Sept 18, Stage 3)
- Decorators (The newer version)
  An advanced feature that allows you to intercept functions and add new functionality to them, such as logging. (As of Sept 18, Stage 2)
- Object rest spread
  Enables the [use of rest/spread syntax](https://babeljs.io/docs/en/next/babel-plugin-proposal-object-rest-spread.html). (As of Sept 18, Stage 4)
- Async to generator
  Simplify [asynchronous code with support](https://babeljs.io/docs/en/next/babel-plugin-transform-async-to-generator.html) for `async` and `await` keywords. (As of Sept 18, Stage 4)

There are some other plugins to further optimize your bundles for fastest possible delivery in the browser.

## Webpack for development and production builds

Worried about efficiency when writing your code? Sick of waiting for slow builds? Forget it. Webpack 4 is blazing fast and has full support for hot module loading, meaning when you make a change to your code you see it in the browser straight away without losing your applications state or having to endure a full page refresh.

As for production? We have you covered. Webpack 4 automatically optimizes your code as much as 60% versus Webpack 3, meaning faster page load times and ultimately happier customers.

## ESLint, Pretter, and Stylelint for code quality consistency

Arguably one of the most important and often overlooked aspects of starting a new project, code quality and consistency. The project is configured with the latest community standards for quality and consistency regardless of how many developers will be contributing to the code base.

## Jest for unit testing

We have mentioned code quality several times throughout this post. Quality is key to the long term maintainability of any project. Whilst not a silver bullet, unit and integration testing go a long way towards helping ensure that your code is resilient to change and can stand the test of time.

To simplify testing of your React components, we have also pre-configured Jest to use Enzyme (a testing utility from [Airbnb](https://github.com/airbnb/enzyme)), which provides shallow rendering and a fluent API to reduce the complexity of, and the noise in, your tests, making testing a breeze.

## Summary

Webpack-4-scratch is an excellent starting point for a single developer or a large team when starting a new project. The project comes with React, Redux, React Router, the latest Babel plugins, Webpack pre-configured and much more to make getting up and running quickly as easy as possible.
