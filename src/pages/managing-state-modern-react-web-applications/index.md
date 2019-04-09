---
layout: post
title: Managing state in modern React web applications
description: A high level look local state vs Context API vs Redux, and best practices around when to use what
date: 2018-10-16
categories: ['React']
group: 'Software Development'
---

## Overview

This post details a presentation I gave at my local [JavaScript North-West Meetup](https://www.meetup.com/JavaScript-North-West/events/254373432/) on 16th October 2018 at [Dept Digital Agency](https://www.deptagency.com/en-gb/) in Manchester, UK.

<iframe src="//www.slideshare.net/slideshow/embed_code/key/aMknsWUmJdwlya" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/JonPreece/managing-state-in-modern-react-web-applications" title="Managing state in modern React web applications" target="_blank">Managing state in modern React web applications</a> </strong> from <strong><a href="https://www.slideshare.net/JonPreece" target="_blank">Jon Preece</a></strong> </div>

Below are the accompanying notes I wrote that acted as a rough speaking guide, and may or may not have been spoken during the event itself.

## Assumptions

Throughout this talk I will assume that you have at least a working to intermediate knowledge of JavaScript and React concepts, and that you have at least worked with React in some capacity in the past. This is, after all, a presentation on React. This is not a course for beginners, or introductory level.

This presentation assumes that you are using at least version 16.3 of React JS, this is because the refreshed version of Context was not released until this version.

Please ask questions as we go along as others may find the answers helpful. Should your question require a long time to answer, I may defer the answer until after the presentation is over. (Come speak to me afterwards).

## What is state?

At a basic level, state is what allows you to create components that are dynamic and interactive. State enables users to interact with your application. Without state, your application would do little. You will almost always want your application to respond to changes in data, usually when fetched from an external API. State is the enabler here.

## What tools are at your disposal?

### Local state

Local state is used at component level and has a limited use-case. Local state is available when defining an ES6 class which extends `React.Component`, and is defined using an instance property called `state`. `state` can not be mutated directly, but can be updated by calling an instance method called `setState`. More on this later.

### Context API

Context API was revised in React 16.3 and gives us a Provider/Consumer pattern that enables us to pass state down our component hierarchy. You define a provider that effectively wraps local state, and makes that state (as well as update functions) available to any child component at any depth in the hierarchy via a Consumer object. More on this later.

### Redux

Redux is probably the most well know and least understood state management tool available for React as well as other JavaScript frameworks/libraries. Using an advanced tool like Redux still has its place and we will discuss why later.

### Any many, many more

There are other state management tools available, such as MobX and Unstated. There is a comprehensive list on Hackernoon, [The React State Museum](https://hackernoon.com/the-react-state-museum-a278c726315).

## Which state management tool should I choose?

One does not simply choose a state management tool.

It is important to know your tools, know your project, understand the future direction of the project, and make informed decisions accordingly.

There is no reason why you can't use local state, Context API & Redux all in the same application, although I wouldn't start with that.

You probably wouldn't want to mix multiple advanced state management tools like Redux, MobX and Unstated in a single React application, because that would exponenetially increase complexity and the learning curve for devs joining your team or helping maintain your codebases.

Local state works best with forms. When local state is used frequently it becomes unwieldly, and hard to reason about, and most importantly, harder to unit test. I like to use local state when handling data that isn't final yet, i.e. data that will eventually be posted to the server once the user has finished inputting it.

Context API, thanks to its hierarchical nature, is particularly useful for enabling access to data from child components. Historically, if we had some data defined in a parent component that we need to access in a child component, we would pass that data down via `props`. This would often go several levels deep. This was messy and made code more noisey and harder to reason about. Context API exposes a Consumer, which has access to the state, eliminating prop drilling. We will see a couple of demos shortly.

Redux is strikingly similar to Context API in that it effectively has a Provider/Consumer pattern, although its less obvious. The main difference is that instead of having potentially many different states, there is a single state contained within a global store, that can be accessed using a function called `connect`, which can be used to access the state and pass that state through to the component. Redux is built on top of the Context API, which can be clearly seen when looking at the `Provider` component in the `react-redux` Github repository. [Link](https://github.com/reduxjs/react-redux/blob/master/src/components/Provider.js).

## Local state demo

<iframe src="https://codesandbox.io/embed/6j7467j0nk" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Notes of interest:

- Container/presentation (Parent/child) relationship
- Presentation component takes a default state, which it binds to the form
- Presentation component uses local state to store users input
- Once form is submitted, data is lifted up to the parent, which does something useful with it (displays an `alert` in this case)
- User can reset form using the reset button. This works because we do not (cannot) mutate the initial state, we copy it to our local state
- Each time the user makes a change to a field, we call `setState` to apply that change to our local copy of state.
- The `onSubmitted` function is passed from the container to the presentation component

## Local state demo summary

The form state is isolated in the presentation component until the user finalises it (submits the form), when it is lifted up and processed accordingly.

Calling `setState` is asychronous, batched and can cause the component to re-render.

### There is hidden pain here.

This is a fairly contrived example where we are passing an initial state object to the registration form. What happens, if, after the form has been rendered the first time, the initialState object gets changed, causing a re-rendering?

_Answer:_ The registration form will not be reflect the changes, because the local state never gets updated. We used to have a component lifecycle method called `ComponentWillReceiveProps`, which would pass you the local state and the updated props so you could update your component accordingly, but this lifecycle method has recently been deprecated and will be removed entirely from React in the next major version release.

## Prop Drilling vs Context API demo

### Prop Drilling

<iframe src="https://codesandbox.io/embed/o100zj1n35" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Notes of interest:

- The demo shows a component whos styling can be toggled with a button. There is a `toggleTheme` function that lives in the `App` component that calls `setState` with the updated theme.
- When the component renders, the `currentTheme` is retrieved from state and passed to the `Container` and `Bacon` components, which utilise it.
- The `toggleTheme` function, `darkTheme` and `currentTheme` objects are passed down to the toggle button.
- This code is messy, even with only 1-2 levels of depth. Imagine the pain over several levels!

### Context API

<iframe src="https://codesandbox.io/embed/o100zj1n35" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Notes of interest:

- No longer necessary to pass props down to each individual component
- A `ThemeProvider` object has been inserted into the component hierarchy
- Each component is responsible for fetching what they need from the state using a `ThemeConsumer`
- The `ThemeProvider` is a component, which wraps a `ThemeContext` object
- Returns a `ThemeContext.Provider` object, which contains only the children components within, and the exact value to provide to each consumer
- The consumer is exported as-is
- Use the `Button` component as an example of how this is syntactically fiddly, and what this code would look like without ES6 arrow functions or destructuring (arguably, easier to reconcile).

## Context API demo summary

Context API is really just a wrapper around `setState`.

This can result in tidier code because you don’t have calls to `setState` all over the place (that is encapsulated). No need to write `this.state.myProp` either, just `myProp`, which reduces noise. This pattern is easy to conceptualise and reason about, making it approachable to developers of all levels.

I have a few complaints. Almost all examples will show usages of the Conumer with ES6 arrow functions and destructuring. Also because of JSX we have to throw in an extra set of curly braces. This makes it syntactically fiddly, even with editor tools such as ‘Indent Rainbow’ and ‘Bracket Pair Colorizer’ I still find myself awkwardly trying to get my brackets to match up.

The Enzyme unit test framework from AirBnB currently has poor support for Context API. This will likely change in future releases.

## Redux demo

Redux is slightly different in that it has a root level `Provider` that is applied across the entire application. You use actions and reducers to update state, and a function called `connect` to retrieve state from the store.

<iframe src="https://codesandbox.io/embed/o5klnyl1my" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

Notes of interest:

- There is no `Provider` directly in our `App` component, the `Provider` wraps everything and is usually used when calling `ReactDOM.render()`
- There is some setup required to define your reducers and actions
- The `Bacon` component has two exports. The first is the plain stateless functional component that works exactly the same as all the other demos. The second export (default export) has the component wrapped with `connect`, which takes two callback functions as its parameters, which returns a function that then takes the component as its arguments. The first function, `mapStateToProps`, gets passed the state from the store, and allows whatever properties are required to be extracted and returns. This return value then gets passed to the component to be consumed.
- This is really easy to unit test because there is no need to set up a mocked store, provider or anything else, we can just test the plain JavaScript function.

## Redux demo summary

Redux has a steeper learning curve because of the need for actions, a store, reducers, dispatchers, and the immutable nature.

Redux scales very well when working with many components and even applications running on the same page.

Redux has excellent tooling (Redux Developer Tools) that make debugging a breeze. The debugger allows you to step through time and see what changes were made to a piece of data and what action caused that change.

As mentioned, unit testing is easy because there is no mocking required, we just test our plain function and pass it whatever arguments are needed.

## Best practices/Common patterns

It is important to know what tools are available and what problem they are trying to solve, then use the most appropriate tool for the job.

Local state for anything other than forms is a bad idea.

When working with local state, prefer a container/presentation relationship, and lift state up when ready. We've not mentioned `ref` for good reason, thats because 99% of the time you shouldn't need to use it!

Don't pay too much attention when sensationalist news says that some tool is dead. Redux is not dead, is being actively maintained and developed, and is widely used.

My recommendation is to use Context API when it makes sense to do so going forward, then should a problem arise that only Redux can solve, then add it to your project _on demand_.

Please avoid prop drilling, it makes code hard to reason about and tidious to follow through.

## Finally

This space is still evolving. My favourite up-and-coming technology is GraphQL, developed by Facebook, and Apollo, created by Meteor. Apollo has state management built in and may be game changer, there are early signs that GraphQL with Apollo will gain mainstream adoption over the next couple of years, so watch this space. Thats a whole presentation on its own.
