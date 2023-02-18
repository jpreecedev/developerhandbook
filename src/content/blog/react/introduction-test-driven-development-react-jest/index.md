---
title: Test Driven Development (TDD) with React, React Testing Library, and Jest
description: Test Driven Development (TDD) is an essential tool for writing robust code, especially in larger teams, we look at how to get started
pubDate: 2019-09-26
categories: ["React", "Test Driven Development"]
group: "Software Development"
heroImage: /assets/test-driven-development.png
---

Test Driven Development (TDD) is a reversal in traditional thinking and coding processes. Rather than writing code, and then writing tests to verify that code, the process is reversed. Tests are written first and then the code. The result of TDD is improved code quality, higher test coverage, and confidence within the team and the business that changes made to the system will not negatively impact it in ways that were unexpected. TDD opens the door to more regular automated releases (continuous delivery), and the burden (and cost) of manual testing can be greatly reduced.

This post describes what Test-Driven Development (TDD) is to me, the company I work for, the teams I work in/with, and my colleagues, in the context of building a React web application with React Testing Library and Jest.

**This post is for people who want to get started with Test Driven Development (TDD) for React web applications.**

**TL;DR**: TDD is hard, then it's easy, then it's awesome. Make TDD your new default.

## What is Test Driven Development (TDD)?

Test Driven Development (TDD) is a strategy for ensuring code is _sufficiently considered_.

A piece of functionality (typically a component in React, or a utility) is crafted not by writing code first, but by writing one or more tests (specs) first. Only when a test spec has been written can the code to satisfy the test be written.

It is not unusual to write out many test specs without writing a single line of code. Approaching problems in this manner requires more consideration of the bigger picture, the structure of the component, and its feature set, which should lead to better quality code.

[![Test Driven Development (TDD).  Image courtesy of ResearchGate.net](/assets/test-driven-development.png)](https://www.researchgate.net/figure/Fundamental-TDD-Cycle_fig1_254008456)

There is a well-defined strategy for writing good tests.

1. Write a test that fails (**RED**). This is to avoid false positives (tests passing when they shouldn't be)
2. Write the minimum amount of code required to get the test passing (**GREEN**).
3. Refactor the code (**REFACTOR**). This might mean writing a more efficient technical solution or a more refined approach. As long as the test continues to stay green, you know there is no regression.

Red. Green. Refactor.

## What are the pros and cons of Test-Driven Development (TDD)?

The pros and cons can be a matter of perspective, and can depend on the culture in your team.

1. **Pro**. TDD usually results in higher test coverage as an overall percentage, but more importantly, more comprehensive, and complete, tests. The tests tend to be more robust, and written to a higher standard. This usually results in greater confidence in the team, and reduced fear of making a change in one place that results in a break somewhere else.
2. **Con**. TDD usually takes more time up-front. Doubling your estimates when starting out is not unreasonable. Developers ~~the sociable beings they are~~ _probably_ shouldn't be working in isolation (that could be a whole post by itself). Working in pairs, threes, or mobs of four, five, six or more people is increasingly commonplace and can substantially increase time required to complete even the simplest changes, as often every line of code is hotly debated and discussed.
3. **Pro**. TDD usually takes more time up-front. Yes, _dear reader_, this is a pro as well as a con. It can be beneficial to slow down in order to speed up. Imagine taking more time to write code at a slower pace. This extra up-front time can result in less bugs, meaning less maintenance after deployment, meaning happier customers, meaning happier bosses, meaning happier developers. Everybody wins.
4. **Con**. TDD can be boring and a breaker of [_flow_](<https://en.wikipedia.org/wiki/Flow_(psychology)>). TDD can be the destroyer of concentration, of being in the zone. Don't you just love sitting at the keyboard and smashing out a bunch of ideas really quickly, trying them out, then deleting the code, re-writing it, and rinse and repeat? Yeah, with TDD that doesn't work anymore. (_But is this secretly a pro in disguise?_ 😉😜)

## Side Note about "Arrange, Act, Assert (AAA)" test structure

A very common approach to structuring your tests is using the AAA syntax. AAA is a way of structuring your test and can be applied to any testing framework or tools. You start by arranging your variables (defining them), then you pass them to your method under test, run your method under test (Act) and verify that the requirements of your test were met (Assert).

A basic example might be;

```javascript
it("should multiply two numbers", () => {
  // Arrange
  const first = 2
  const second = 2
  const expectedResult = 4

  // Act
  const result = multiplyTwoNumbers(first, second)

  // Assert
  expect(result).toEqual(expectedResult)
})
```

Why structure tests in this way? Well, I'll be honest with you..., I'm lazy. Structuring tests like this make it a lot easier to duplicate the test and tweak the variables to test for some other outcome. Instead of my having to visually scan through the entire test looking for magic values, I just know that all the variable values are at the top of the test.

If I want a test to ensure that the `multiplyTwoNumbers` method works with a different set of numbers, I can duplicate test and update the values without having to update the rest of the test.

```javascript
it("should multiply two numbers", () => {
  // Arrange
  const first = 4
  const second = 4
  const expectedResult = 16

  // Act
  const result = multiplyTwoNumbers(first, second)

  // Assert
  expect(result).toEqual(expectedResult)
})
```

It's quicker and easier to reason about, especially when we get more complex tests with more going on. It's up to you but I have found this approach to work well and be very effective.

## React, React Testing Library, and Jest Starter Project

I don't want to spend any time in this post discussing how to set up your project for Jest and related tooling, perhaps there will be a dedicated post for that.

If you need a test project that is already configured for React, React Testing Library, and Jest, you can [check out my seed project on GitHub](https://github.com/jpreecedev/tdd-from-scratch). Follow along with me.

## How to get started with Test Driven Development (TDD) using React, React Testing Library, and Jest

A business requirement has just come in. We need a button.

The wider team had a conversation about using a standard HTML `<button />`, but instead it has been decided amongst the team to create a component library, which offers a layer of abstraction, making it easier to make site wide changes later.

If you're using the starter project, note that the CSS has already been provided for you. The purpose of this tutorial isn't to discuss styling but the process of writing a React component using TDD.

We're following TDD principals of _Red, Green, and Refactor_, so we start by creating a failing test.

Open `src` and create a new folder called `components`, and a new folder within called `Button`. The `Button` folder will be the home of all the code, tests, and Storybook stories (we will discuss this later) for this `Button` component.

Create three new files, `Button.tsx`, `Button.test.tsx` and `index.tsx`. `index.tsx` will only export our `Button` component. This makes our `import` statements a little tidier later when we consume the component.

I highly recommend using a split view. In your code editor, place `Button.tsx` on the left, and `Button.test.tsx` on the right. This will prevent us from having to change tabs frequently, which helps with concentration.

![Visual Studio Code Split View - Perfect For Writing Tests](/assets/vs-code-testing-split-view.png)

We start with a failing test. In `Button.test.tsx` add the following code;

```javascript {63,64}
import React from "react"
import { render } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"

describe("<Button /> tests", () => {
  it("should render as default button", () => {})
})
```

On line 5 we described this suite of tests, and on line 6 we spec'd out our first test. Update as follows;

```diff
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('<Button /> tests', () => {
-  it('should render as default button', () => {})
+  it("should render as default button", () => {
+    const { container } = render(<Button />)
+    expect(container.firstChild).toMatchSnapshot()
+  })
})
```

You can run the test by calling `npm test` in your terminal. The test should fail because there is no component called `Button`.

![First Failing Test - React Testing Library](/assets/react-testing-library-failing-test.png)

**Note:** the project I am using here already has some passing tests in it.

Now that we have a failing test, we need to write the minimum amount of code to get the test passing (green).

Open `Button.tsx` and add the following code;

```javascript
import * as React from "react"

const Button = () => {
  return <button></button>
}

export { Button }
```

In `Button.test.tsx`, be sure to add a named `import` for `Button`;

```diff
import React from "react"
import { render } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
+import { Button } from "./Button"

describe("<Button /> tests", () => {
  it("should render as default button", () => {
    const { container } = render(<Button />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
```

The test should now pass, and we're free to move on to the next test. The component is not terribly useful right now, so we refer to the spec/designs for guidance.

The design spec says there will be two variants of a button; `primary` and `secondary`. Let's add a test that passes in `variant=primary`, add an assertion to check the variant, and see that sweet sweet 🍬 failing test.

Open `Button.test.tsx` and add the following spec underneath the first spec;

```javascript
// Code omitted for brevity

it("should render a primary button", () => {
  // Arrange
  const variant = "primary"

  // Act
  const { container } = render(<Button variant={variant}></Button>)

  // Assert
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass(`button-${variant}`)
})
```

We don't even need to run the test to see it failing. As this is a TSX file, good guy TypeScript tells us right in the editor that something is not right;

```plaintext
Type '{ variant: string; }' is not assignable to type 'IntrinsicAttributes'.
Property 'variant' does not exist on type 'IntrinsicAttributes'.ts(2322)
```

Re-running Jest will result in the same error. Let's fix this first. Open `Button.tsx` and make the following changes;

```diff
import * as React from "react"

+interface Button {
+  variant?: "primary"
+}

-const Button = () => {
+const Button: React.FunctionComponent<Button> = ({ variant = "primary" }) => {
-  return <button></button>
+  return <button className={`button button-${variant}`}></button>
}

export { Button }
```

We have made a few changes here, so let's digest.

1. **TypeScript interface** on line 3,4,5. We have used a TypeScript `interface` to define the properties that our component can accept. Our first property, `variant`, is optional and can only be of the value `primary`. If the user passes in any other value, this will result in a compile time error. Perfect.
2. **React.FunctionComponent** on line 7. As this is a functional component (rather than a `class` based component), we need the `React.FunctionComponent` interface passing in our new `Button` interface.
3. **variant="primary"** on line 7. This is the property we have added, and we have defaulted it to `primary`, so that if the user does not provide any other value here, we give them a sensible default. UX forgot to mention that in their design document, but they did mention it verbally 👂.
4. **className** on line 8. We already have a CSS framework, and we already know that we will need to add the `button` class to opt-in to some basic `button` styles. We also need the `-primary` modifier to set the default background color/foreground color for the button.

Notice that we haven't talked once about spinning up the app, loading the component, viewing it in the browser, or anything like that. For now, we just focus on the behavioural logic, and we can make design alterations later.

We have modified the `button` (we added at two CSS classes to the `className` object), so our snapshots are out of date. To update the snapshots, run `npm run test -- --update` (note the extra `--` in the middle. When using NPM this is required to forward the arguments on to the underlying bin command. The extra dashes are not required when using Yarn).

Now, as noted earlier, there are two variants, `primary` and `secondary`. Let's create a new spec for `secondary`. This ensures that we have tests that verify the correct behaviour when either `variant` is used.

```javascript
// Code omitted for brevity

it("should render a secondary button", () => {
  // Arrange
  const variant = "secondary"

  // Act
  const { container } = render(<Button variant={variant}></Button>)

  // Assert
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass(`button-${color}`)
})
```

Once again, TypeScript should be first on the scene to highlight to use a problem;

```plaintext
Type '"secondary"' is not assignable to type '"primary"'.ts(2322)
Button.tsx(4, 3): The expected type comes from property 'variant' which is declared here on type 'IntrinsicAttributes & Button & { children?: ReactNode; }'
```

This is a rather wordy error message (you'll get used to TypeScript being a bit chatty like this). What this error is saying is _you gave me "secondary", but I was only expecting "primary"_. We can easily resolve this by updating our `Button` interface in `Button.tsx` as follows;

```diff
import * as React from "react"

interface Button {
-  variant?: "primary"
+  variant?: "primary" | "secondary"
}

const Button: React.FunctionComponent<Button> = ({ variant = "primary" }) => {
  return <button className={`button button-${variant}`}></button>
}

export { Button }
```

Now we can pass in `primary`, or `secondary` as the `button` variant. Any other value will result in a compile time error. Sweet.

Another quick peruse of the UX design guide reveals that the `Button` component should have some text. There is currently no means to achieve this, so let's fix that.

Add the following test;

```javascript
// Code omitted for brevity

it("should render the button with some text", () => {
  // Arrange
  const text = "I am a button, I can be clicked"

  // Act
  const { getByText, container } = render(<Button>{text}</Button>)

  // Assert
  expect(container).toMatchSnapshot()
  getByText(text)
})
```

I had a quick think and decided the best way to pass the text for the `Button` was not via some new prop, but via `children` instead. This adds a degree of flexibility as it allows the consumer to pass through more than just a `string`. The consumer could pass in an icon, an image, or pretty much anything, as long as it makes sense for their use-case. We just position it and hope they know what they are doing 🙈.

Make the following changes to position content within `button`;

```diff
import * as React from "react"

interface Button {
  variant?: "primary" | "secondary"
}

-const Button: React.FunctionComponent<Button> = ({ variant = "primary" }) => {
+const Button: React.FunctionComponent<Button> = ({ variant = "primary", children }) => {
-  return <button className={`button button-${variant}`}></button>
+  return <button className={`button button-${variant}`}>{children}</button>
}

export { Button }
```

As `children` is already defined on `React.FunctionComponent`, there should be no complaints from TypeScript and no need to add `children` to your interface.

Notice that we have used a new function here that we have not previously used, `getByText`. This is the recommended way of getting a `button` when using `react-testing-library`, because this is how the user would interact with button, they would "see" it (possibly via a screen reader or other accessibility tool) and click it. The user would _probably_ not open the `console`, run a `document.querySelector` and then trigger a `click` event. Probably. I admit it's possible but that scenario is probably more of an edge case.

These tests are closer to integration tests than unit tests because they are testing the user interaction, rather than the implementation details.

Finally, the button does not do much. When the user clicks the button, nothing happens. We need to enrich the button by adding a click handler, so that the consuming component can run some kind of logic when the button is clicked. React Testing Library exposes a helper to simplify the event dispatch code, and Jest has built in assertions for this purpose. Let's explore.

Open `Button.test.tsx` and add the following;

```javascript
import React from "react"
import { render, fireEvent } from "@testing-library/react"
import { Button } from "./Button"
import "@testing-library/jest-dom/extend-expect"

// Code omitted for brevity

it("should call the click callback handler", () => {
  // Arrange
  const content = "Hello, World!"

  // Act
  const { getByTestId } = render(<Button>{content}</Button>)

  // Assert
})
```

Be sure to pay attention to line 2 specifically. Notice that now we have imported `fireEvent` from `@testing-library/react`, this is the helper function that takes care of creating an event and dispatching it. The API is super simple and powerful. If we want to dispatch a `click` event, then we just call `fireEvent.click`, and for `blur` it would be `fireEvent.blur`. [Many events are supported](https://github.com/testing-library/dom-testing-library/blob/master/src/events.js). The function takes a target element, and options (which we do not need). In our case, the target element is the `Button` element.

Currently, our test passes because there are no assertions. We need to start with a red first, so make the following changes;

```diff
it("should call the click callback handler", () => {
  // Arrange
  const content = "Hello, World!"
+  const onClick = jest.fn()

  // Act
-  const { getByTestId } = render(<Button>{content}</Button>)
+  const { getByText } = render(<Button onClick={onClick}>{content}</Button>)

+  fireEvent.click(getByText(content))

  // Assert
+  expect(onClick).toHaveBeenCalledTimes(1)
})
```

`Button` does not currently have an `onClick` function defined on its interface, so we should have a failing test now. Let's talk about what we changed here.

On line 4, we defined a fake function, using `jest.fn`. We created a fake function using `jest.fn`, rather than say an arrow function, because we need to make assertions against the number of times the button was clicked. With a mocked function, we can track the number of clicks, as well as more interesting information like what arguments were passed to the function, what the function returned (we can control this as well), and more.

On line 10, we trigger a `click` event, and then we assert that our `onClick` function was called exactly one time. We could assert on the arguments passed to `onClick` but this is not relevant to our use case, just that the function was called.

With our failing test, we now need to update `Button.tsx` to accept an `onClick` handler and wire it up to our actual `<button>` DOM element.

Open `Button.tsx` and make the following changes;

```diff
import * as React from "react"

interface Button {
  variant?: "primary" | "secondary"
+  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

-const Button: React.FunctionComponent<Button> = ({ variant = "primary", children }) => {
+const Button: React.FunctionComponent<Button> = ({ variant = "primary", children, onClick }) =>
-  return <button className={`button button-${variant}`}>{children}</button>
+  return <button className={`button button-${variant}`} onClick={onClick}>{children}</button>
}

export { Button }
```

Once again, let's discuss what we have changed here.

We added a `Function` called `onClick` to our TypeScript interface. The function has an `event` parameter object of type `React.MouseEvent<HTMLButtonElement, MouseEvent>` and a return type of `void`. This typing information is necessary to ensure that the TypeScript language service gives the correct auto-complete/type checking in the consuming code. We also added `onClick` to our props destructuring and attached the function to `onClick` on the button. We are simply passing through the click event directly to the consumer and not doing anything to it. There is no requirement to have any custom logic in the click handler.

And that's it, the component is complete. You have successfully TDD'd the `Button` component.

## My thoughts on Test Driven Development (TDD)

When starting out, writing code in this manner can be a bit tedious. It certainly feels slow going at first, especially if you are also new to TypeScript. TypeScript is very powerful and is becoming an essential tool for front-end development today. The learning curve for TypeScript, however, can be extremely steep. Its errors and warnings are often ambiguous and straight-up confusing. Couple this difficulty with TDD and you can get yourself into some really difficult places.

My recommendations are as follows;

1. **Grind it out**. When you encounter a problem, fix it with the correct fix. Take the time to research the problem, understand it, and fix it. No work arounds and temporary fixes.
2. **Don't give up**. Persistence is the key to success with TDD. Commit to sticking with it for a length of time, say 2 weeks, and then make an assessment at the end as to whether or not you want to continue with it.
3. **Pair or mob, where possible**. Two or more heads are better than one. Chances are somebody you work with has more knowledge about TDD than you do, so work with them and learn from them and then help others. This is the fastest way to accelerate your own learning.

From my own experience of following TDD principals at major UK companies, TDD results in higher quality code that has better test coverage. Following TDD principals, most importantly, gives the developer confidence to make change, and reassurance that the change hasn't broken code elsewhere in the system.

## How to use Storybook to review and style your React components in isolation

You can think of Storybook as an aide for both developers and non-technical people (marketers, product owners etc).

I love Storybook and use it every day for the following reasons;

1.  It helps me to write code in isolation.
2.  It has a concept of knobs, enabled via a plugin, which make it easy to change the state of a component using the UI.
3.  It means that I don't have to spin up my application, databases, docker images, or anything to see my component. My component is just there on screen and I can feed it sample data that accurately represents in real use-case.
4.  It makes styling easy. Storybook has built in Hot Module Reloading (HMR), which means that when I make changes to my CSS, that change is immediately reflected on screen. Time to develop is shorter.
5.  Automatic documentation
6.  **Arguably most important**, Storybook is completely static HTML / JavaScript / CSS, which means I can very quickly and cheaply deploy it to a server and pass the URL to the product owners/managers/marketers/ux/everybody else and let them see everything that has been built and is available to use. This helps them visualise the product better, helps them sell the product, helps with designing experiments, and helps with designing newer, better components. Often it helps with buy-in from the business as well because they have something tangible they can interact with (and they can see it being delivered over time).

Setting up Storybook in your project quite straightforward. Run the following automatic set-up script;

```shell
npx -p @storybook/cli sb init --type react
```

Then change `.storybook/config.js` as follows;

```javascript
import { configure } from "@storybook/react"
import "../src/global/styles.css"

const req = require.context("../src", true, /\.stories\.jsx$/)

function loadStories() {
  req.keys().forEach(req)
}

configure(loadStories, module)
```

All that has really changed here is the path to our stories, as well as importing of our global styles.

Now, create a new file in `.storybook` called `webpack.config.js` and add the following code;

```javascript
module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve("awesome-typescript-loader"),
      },
      // Optional
      {
        loader: require.resolve("react-docgen-typescript-loader"),
      },
    ],
  })
  config.resolve.extensions.push(".ts", ".tsx")
  return config
}
```

If you have any issues getting set up with TypeScript, have a [quick look at the official guide](https://storybook.js.org/docs/configurations/typescript-config/), which is very helpful and very detailed.

To enable knobs, make the following change to `.storybook/addons.js`

```diff
import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';
+import '@storybook/addon-knobs/register';
```

We can now go ahead and write our story.

Create a new file called `Button.stories.jsx` and add the following;

```javascript
import * as React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { withKnobs, text, select } from "@storybook/addon-knobs"

import { Button } from "./Button"

const stories = storiesOf("Components", module)
stories.addDecorator(withKnobs)

stories.add(
  "Button",
  () => {
    const options = {
      Primary: "primary",
      Secondary: "secondary",
    }

    return (
      <Button variant={select("variant", options)} onClick={action("onClick")}>
        {text("content", "I am a button")}
      </Button>
    )
  },
  { info: { inline: true } },
)
```

In the below screenshot we see our button, and we see a list of options underneath (variant and content). We can change each of these options and see the result on screen immediately.

![React component in Storybook](/assets/react-component-in-storybook.png)

Most of the code is just boilerplate and you will find yourself adding this over and over to every story you write. The important take-aways are the following;

1. Create a story called `Button`
2. Allow the user to select `primary` or `secondary` from a select list control
3. When the user clicks the `Button`, add a record to the `Actions` tab
4. Allow the user to change the text content of the button using an input text field

I highly recommend taking the time to [familiarise yourself with Storybook](https://storybook.js.org/) as I think tools like this (if not Storybook itself) will be the default going forward, especially for bigger business.

## Summary

As always, we covered a lot of ground in this post. We discussed what Test-Driven Development (TDD) is, what some of the pros and cons are, and how to structure our tests using the AAA test structure. Then we got practical and dove in to writing our first component in the TDD style using React, React Testing Library and Jest. We saw a few simple scenarios and then we moved on to fake a click event and test that our callback was being called. We discussed good practices along the way and my personal thoughts on TDD and the benefits it can bring. Finally, we wired up a Storybook story so we could see it in the browser and interact with it using knobs.
