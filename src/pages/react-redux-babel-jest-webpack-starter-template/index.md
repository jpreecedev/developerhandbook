---
layout: post
title: A bare bones React boilerplate, featuring Webpack 4, React, Redux, Jest, and Babel 7
description: Boilerplate and template projects are awesome, however, sometimes they can be quite bloated.  This is a barebones starter template.
date: 2018-09-15
categories: ['React', 'Webpack', 'JavaScript']
tags: ['react', 'webpack', 'javascript', 'redux', 'babel']
---

I love template projects.

In fact, I use them all the time. Template projects, seed projects, starter projects, whatever you want to call them, they are fantastic. Starter templates help you get up and running very quickly and can be very useful and powerful when learning something new.

However, where starter projects stop making sense is when said project becomes bloated with every feature under the sun. Without naming names (_cough, [create-react-app](https://github.com/facebook/create-react-app)_), some projects have grown significantly in _features_, which can increase complexity, the learning curve, size, and reduce performance.

Under no circumstances am I suggesting that using a starter project is a bad idea. However, I required a starter that just contained the absolute minimum functionality to get a project off the ground, then I could worry about adding additional functionality at a later date.

I created a repository on GitHub to solve this exact problem, [webpack 4 scratch](https://github.com/jpreecedev/webpack-4-scratch). This post discusses how the repository was built and provides an explanation of the functionality provided.

## Overview

Before we get into the details, lets answer the most important question first. What functionality does this starter provide?

- React, Redux and React Router pre-configured out-of-the-box.
- Development build with hot module reloading. Make a change and see it instantly without a full page refresh.
- Production build with minification of JavaScript, CSS and other assets. Ship an optimized build to a production environment.
- Uses Babel 7 to maximise cross browser support of your JavaScript and allows you to write code against the latest standards.
- Write comprehensive unit and integration tests using Jest. Gives confidence that code works as it should.
- Code style is standardized. The project is pre-configured to adhere to and enforce the latest code quality/consistency guidelines using ESLint & Prettier, not only on your machine but your collegues as well.

And that is about it. Everything you need to get started.

## The fastest way to get started

## React, Redux and React Router out-of-the-box

## Babel 7 for cross browser support

I mentioned that this starter project uses Babel 7 to maximise cross browser support. Well what does that mean exactly?

Babel 7 takes your new, modern, shiney ES6/ES7+ JavaScript code and transpiles (converts) it to ES5. This is a good thing because ES5 was around for a very long time and has excellent cross browser support. 99% of the code you write will be compatible with browsers all the way back to at least Internet Explorer 9.

As well as excellent cross browser support, Babel can also enable support for experimental features of the language that have not yet been ratified. These enhancements enable you to write code using emerging standards. I have added support for several emerging standards that are very likely to get promoted to full support in future versions of the ECMAScript specification.

- Class properties
  You never have to `bind` the `this` context of functions again thanks to this plugin. Read more on [Babel class properties documentation](https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties).
- Decorators
  An advanced feature that allows you to intercept functions and add new functionality to them, such as logging.
- Object rest spread
  Enables the [use of rest/spread syntax](https://babeljs.io/docs/en/next/babel-plugin-proposal-object-rest-spread.html).
- Async to generator
  Simplify [asynchronous code with support](https://babeljs.io/docs/en/next/babel-plugin-transform-async-to-generator.html) for `async` and `await` keywords.

There are some other plugins to further optimize your bundles for fastest possible delivery in the browser.

## Webpack for development and production builds

Worried about efficiency when writing your code? Sick of waiting for slow builds? Forget it. Webpack 4 is blazing fast and has full support for hot module loading, meaning when you make a change to your code you see it in the browser straight away without losing your applications state or having to endure a full page refresh.

As for production? We have you covered. Webpack 4 automatically optimizes your code as much as 60% versus Webpack 3, meaning faster page load times and ultimately happier customers.

## ESLint, Pretter, and Stylelint for code quality consistency

## Jest for unit testing

We have mentioned code quality several times throughout this post. Quality is key to the long term maintainability of any project. Whilst not a silver bullet, unit and integration testing go a long way towards helping ensure that your code is resilient to change and can stand the test of time.

To simplify testing of your React components, we have also pre-configured Jest to use Enzyme (a testing utility from [Airbnb](https://github.com/airbnb/enzyme)), which provides shallow rendering and a fluent API to reduce the complexity of, and the noise in, your tests, making testing a breeze.

## Summary
