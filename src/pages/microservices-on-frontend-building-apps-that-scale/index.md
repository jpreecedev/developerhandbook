---
layout: post
title: Microservices on the front-end - Building front-end apps that scale
description: This is a discussion around how to build a front-end microservice website and what the potential benefits and drawbacks are
date: 2018-11-21
categories: ['Front-end', 'Architecture']
group: 'Software Development'
---

## Overview

This post details a presentation I gave at my local [Manchester Web Meetup](https://www.meetup.com/Manchester-Web-Meetup/events/256037115/) on 21st November 2018 at [The Hut Group](https://www.thg.com/) in Media City, Salford, UK.

<iframe src="//www.slideshare.net/slideshow/embed_code/key/bL0S0EqIUfkXMS" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/JonPreece/microservices-in-the-front-end-123604578" title="Microservices in the front end" target="_blank">Microservices in the front end</a> </strong> from <strong><a href="https://www.slideshare.net/JonPreece" target="_blank">Jon Preece</a></strong> </div>

Below are the accompanying notes I wrote that acted as a rough speaking guide, and may or may not have been spoken during the event itself.

## Who am I?

- Developer at RC, this is where I have learnt about frontend microservice architecture
- I like to experiment with new ideas, and I make available what I can through my public GitHub repo
- I have decided to start speaking at events like this one more often so that I can give back to the community that has given me so much over the years
- If you do have any feedback or suggestions on how I can improve, please feel free to let me know. I’m most likely to respond if you email me.

## Overview of tonight's talk

- Discuss what microservice architecture is and how the paradigm can be applied to the frontend
- Discuss the details around the of the code, the tooling, the project structure etc
- Hopefully learn enough to be able to go implement this pattern in our own repositories
- We will touch on state management and how we tackled the issue of sharing state at RC

## RC Screenshot 1

- This is the website I work on for my day job, the replatformed Rental Cars website
- This website has comprehensive back-end and front-end micro-service architecture
- There are usually several microservices running on any one single page

## RC Screenshot 2

For example, on this page there is a header and search box which are both front-end microservices

## Buy my house screenshot 1

- When I was planning this presentation I decided that I wanted to make some code available for you to go look at (RC is private)
- The website isn’t much to look at, but all the practices we are going to talk about today are covered
- I will give the link shortly
- here are 3 front-end microservices on this page

## Buy My House Screenshot 2

- I have highlighted the 3 microservices

## GitHub Repo Screenshot

- There are 3 standalone repositories here, although there is no reason why they couldn’t live in a single repo (we will talk about this later)
- Buy My House API - This was written in C# .NET Web API and exposes an endpoint which returns a list of properties that are currently available for sale.
- Buy My House Gateway - Exposes a GraphQL endpoint which can be used to talk to Buy My House API microservice. This allows only a specific subset of data to be returned to the client, rather than EVERYTHING. We’ll discuss this reasoning later
- Buy My House - The entire front-end, including all standalone front-end micro-services. This is a mono-repo. We will talk more about this later.

## Title Slide

- I want to define what I’m talking about when I say “Scale”

## Scale slide

- No not that kind of scale

## Scalability

- This rectangle represents my project, my repository
- Maintaining a project is easy when only one person is contributing to it
- But now the company is doing well, so more people are hired and start contributing
- More people get hired, pain points of everybody working on the same files start becoming a regular occurrence, such as merge conflicts and code being overwritten unintentionally
- Now it's chaos, and the stability of the project is undermined
- The scalability I’m referring to is making your project robust enough to be able to withstand dozens or hundreds of contributors commiting code and making changes on a daily basis. This is where front-end microservice architecture comes in
- Getting code changes out in a timely and safe manner is of the utmost importance

## Performance

- We can’t talk about scalability without touching on the impact to performance

## What is micro-service architecture

- Small, independent, isolated, single function modules with well defined interfaces and operations
- There are usually performance benefits that accompany a microservice architecture
- Apps can be scaled horizontally and vertically
- Can be independently deployed
- Can make continuous deployment and delivery possible
- Less risk, because you usually deploy little and often
- Falling back when things go wrong is easier for the same reason
- What is micro-service architecture specifically on the front-end?

### Transclusion

- Forming many pieces of a page into a single page, usually orchestrated by an aggregator (page is built dynamically)
- Ability to use different frameworks on the front-end
- I want to expand on this point on the next slide

## Buy my house screenshot

- Every microservice on this page is written using React

## Front-end diagram 1

- If we take the previous screenshot and turn it into a diagram, we see in a simpler form that every microservice is written in React
- As a side note, the React library is not included on the page 3 times, it is externalise from the bundles and loaded at the end of the body BEFORE any other microservices are loaded

## Front-end diagram 2

- There is no technical reason why every component couldn’t be written in a different framework
- You probably don’t want to do this because you would have to include each framework/library on the page, which would add a lot of bloat
- Where frontend microservice architecture really shines is where you want to transition from one framework to another, which in the fast pace world of front-end development is highly desirable

## Performance

- Back to performance, how is a typical front-end website built today?

## A typical micro-service website today

- The front end may make several requests to various backend microservices, both internal and external
- At least some of these requests may be being made on page load or shortly after
- Some requests may block the user from performing an action

## Web Gateway slide 1 & 2

- It is becoming increasingly common to introduce a gateway layer
- Server side rendering of the front end
- Good for SEO
- Front-end may make a single request to the gateway and get back the exact data it needs to render, as a tool like GraphQL can go resolve data from all the endpoints and combined it into a single distilled response

### GraphQL aside

- I prefer to use GraphQL on the application gateway so that I don’t have a complex, in-flux tool like Apollo on the client. This will probably change at some point
- I don’t want a chatty client making micro requests to microservices once the page has loaded (client side)
- GraphQL lets me query several microservices at a time and return back to the client with a single cohesive response
- On the application gateway, I server side render the React application and then rehydrate it client side, which is quicker and should result in better SEO

## Source Control / Multi Repo

- We are now in a Multi-repo environment. Every front end and back end microservice, as well as everything in between lives in its own repository
- This can be hard to manage, adds complexity in places like CI/CD tools, reporting etc
- Cognitively draining as you will typically have to constantly change windows/editors to find code/many changes to several repositories at once

## Source Control / Mono Repo

- Every microservice, every API, everything lives in one repo
- This means there is a single source of truth, a single place to find code, track down bugs etc
- Large companies like Google, Facebook and Twitter have monorepos
- Babel has released tooling to help manage a monorepo, called Lerna
- I thought the idea was ridiculous when I first heard about it a couple of years ago, but I’ve warmed up to it and now when starting a new project its something i seriously consider from the start

## Why is Babel a monorepo?

- I couldn’t resist not showing this wiki page from Babel’s GitHub repository
- Juggling a multimodule project over multiple repos is like trying to teach a newborn baby how to ride a bike
- Easier to verify that code is working as expect, and is consistent
- Babel acknowledge that the code is more intimidating to newer developers/contributors
- And you might be thinking that this is a dumb idea, but other big projects like React and Ember have been doing this forever

## What does it look like in practice?

- Every component is built in isolation, usually in a folder called packages
- Every component can be individually published to a registry, such as NPM or your own private repository
- In this project, we’re using a shell application that pulls in all its dependencies to build the page. The shell doesn’t add much business logic itself

## Tooling

- Monorepos currently work best when built with Yarn & Lerna
- Yarn is a package manager like NPM, but has some additional functionality
- Primarily, Yarn workspaces allow node_modules to be hoisted to the root. A single yarn install will install the dependencies for every package
- No need to go into each package and run npm install
- I don’t think there is currently a comparable feature in NPM, but i wouldn’t bet against it appearing in the not so distant future
- Lerna optimises the workflow around managing multi-package repositories with Git and NPM
- Lerna was developed by Babel, and is being used by many large companies
- Lerna makes it easier to publish packages to your registry of choice
- Lerna manages the version numbers, either independently or fixed
- Lerna detects dependent packages and publishes them as well
- Potential pain point. When using Lerna, everything must be a package or not everything will work as you expect

## Yarn & Lerna

- If you’re considering migrating to a monorepo, you will probably want to consider switching to Yarn and implementing Lerna. Lerna is more painful when used with NPM.

## State

- Its all very well building components in isolation, but sooner or later you will probably want to share state between 2 or more components

## The Martian

- Your components can’t always live in isolation, sooner or later they are going to need to make contact with the outside world

##SSR State Provider

- To solve the problem at Rental Cars, we developed a wrapper around React Context API which had access to a global variable
- Global when server side rendered, window when client side rendered
- A consumer exposed an UpdateState function, which notified all other services on the page that global state had changed
- This global state is agnostic of any framework
- When state changes, React uses its Virtual DOM diffing to figure out if a re-render is necessary. We tested this comprehensively with 4 services running on a page doing several complex operations, and noted no significant decline in performance
- This approach was chosen because of the current stigma around using a Flux type library like Redux

## Microservice Envy

- Whilst researching this presentation, I came across a point on the Thoughtworks TechRadar, which was titled Microservice Envy
- Just because everybody else is creating microservices, doesn’t mean you should as well
- Assess the pros and cons, decide if this approach is right for your project

## Pros

- Pro - Smaller modules are faster to release
- Pro - Can be scaled independently, both horizontally and vertically
- Pro - Easier to understand and easier to onboard new team members
- Pro - Microservices can be reused in many places
- Pro - Less to roll back when things go wrong
- Pro - Ability to change and evolve without breaking dependent services, as long as the contract is maintained

## Cons

- Con - Increased devops, monitoring, delivery workflow must be automated using a pipeline, tools like Graphite and Grafana become essential
- Con - Achieving team independence requires the team to have all skills within itself.
- Con - Increased configuration. Git repo, CI/CD pipeline
- Con - More throughput, although request will be smaller

## Summary

- Break your front end into smaller pieces, which can be independently iterated, deployed and managed
- An intermediate service called a Web Gateway may help reduce chatter and improve performance
- Putting all your components/services into a single repo, called a Monorepo, may make developing easier
- A general purpose solution for sharing state is required
