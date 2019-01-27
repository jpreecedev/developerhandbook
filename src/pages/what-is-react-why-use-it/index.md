---
layout: post
title: What is React.js, and why use it?
description: We can use React to build interactive web pages. React encourages building pieces, called components, that are assembled to form a complete page.
date: 2019-01-21
categories: ['React']
tags: ['react', 'javascript', 'practical-react-series']
seriesTitle: Practical React Developer
---

React is a tool for building dynamic and interactive user interfaces.

React promotes building small pieces, called _components_, (which are often JavaScript functions or classes), that are assembled to form a UI. Notice that we have not used the word "web" or "page" here, because React itself is view-layer agnostic, meaning a separate view renderer is used to create a UI for the user to consume.

React is not a framework, like Angular. React is an unopinionated library that, when combined with a renderer, can display/capture data and respond to user inputs and network events.

As React is view-layer agnostic, you, the developer, are not limited to using React to build for the web.

React is closely associated with ReactDOM, which understands how to render markup in the browser, and ReactNative, which understands how to render a mobile friendly native view.

## What problems does React solve?

React attempts to solve the following problems;

- Updating the DOM/user interface is expensive in terms of memory, CPU/GPU/general processing time (not financial, but computationally), and writing UI manipulation code can be boring and repetitive.
- Software can become entwined and complex over time, especially as the application grows and has many contributors.
- Consistency

By doing the following;

- React creates an in-memory representation of the DOM (Virtual DOM) that gets updated every time state changes in your application. Each time the virtual DOM is created, it is compared to the previous version and the real DOM gets "patched" with the differences. The only parts of the DOM that get updated are the parts that have changed, rather than rebuilding the entire DOM.
- There are usually two types of React components, _Container_ components and _Presentation_ components. Container components house the logic (perhaps business rules or AJAX requests) and pass data to child _presentation_ components which contain no logic and only display data passed from the parent. Child components are often very small and self-contained, making them easy to unit test (ensure quality) and easy to reuse in many places.
- Most of all, React creates consistency and highly encourages (but not requires) a team of developers to write code in a standard way, making onboarding of new team members easier and longer term maintainability easier.

In a nutshell, React is fast, structured, and easier to maintain for teams of developers.

## Do you even need a library/framework?

We have spoken a lot so far about React and what it brings to the table, but do you even need a framework/library at all?

**Short answer:** _yes_.

**Long answer:** _no, but_.

**Explanation**
Strictly speaking, with investment in time and effort, you can build dynamic websites yourself without a framework.

At a minimum, your website will probably need some of the following features;

- Trigger changes somewhere on your page based on a user interaction. Let's say you are building an e-commerce site that has a list of products and a basket. When you click an "Add" button the product is added to the basket and the basket quantity gets updated visually on the page without a page refresh. You could use `document.querySelector` to grab the basket quantity element and update the `innerHTML`.
- Respond to user input. Your website may have a form that captures data. You could write some native JavaScript to attach event listeners using `addEventListener` to each input field, and capture the users input and store it somewhere, ready to be sent possibly to your remote server.
- The ability to make asynchronous requests to the server. You can use the built-in and universally supported `XMLHttpRequest` object to do this with minimal code.

Yes, you can build a website that is dynamic and interactive yourself using plain old JavaScript. You might want to ask yourself _why_ would you want to do this? Why not use an off-the-shelve lightweight, feature rich library that was built by some of the smartest people in our industry (including community contributors of course!).

One killer feature of React that really propels it to the next level, in my humble opinion, is the distinct lack of React code that ends up in the code base. React is unopinionated and gets out of my way, leaving me with code that is largely just native JavaScript anyway, with very few React language specific paradigms.

The React learning curve is minimal. React is fast, lightweight, and feature rich. If you already know JavaScript, you are already 90% on your way to knowing React.

Enough said.

## Summary

React is a fast, lightweight, feature rich library that helps us build dynamic web and mobile applications. You probably want to use React because it promotes small, reusable pieces called components, which promotes structure and consistency. React helps you to write more robust, easier to maintain code especially for larger teams of developers. React is very performant, which it achieves, in part, by intelligently patching the DOM when the state of your components changes. React is not strictly necessary to build a modern website today, you could roll-your-own framework, but the rich out-of-the-box feature set can help you build quality websites more rapidly.
