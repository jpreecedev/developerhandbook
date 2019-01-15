---
layout: post
title: How I use ESLint and Prettier for a consistent coding environment
description: ESLint and Prettier are tools that can help your team write better quality code that is consistent with your teams/company's code style.
date: 2019-01-03
categories: ['JavaScript']
tags: ['javascript', 'eslint', 'prettier']
---

I work independently, as part of small teams, and as part of teams that consist of hundreds of individuals. Many developers will have a different idea of how they want to format their code, and what standards they would like to adhere to. Some teams might not have any guidelines in place at all, which will often lead to preventable problems further down the road.

Tooling today exists that can make enforcing coding style and standards a breeze.

I just used the word _enforcing_, but tools like ESLint and Prettier were never designed to _force_ people to write code in a certain way. Linting tools are best thought of as _helpers_ that tidy your code automatically, or point out common errors or pitfalls that you may be accidentally falling into.

ESLint and Prettier are the good guys, helping you and your team write cleaner, more maintainable code.

## What is ESLint

ESLint is an open source JavaScript linting utility. Linting is the process of running a program that will analyse code for potential errors as well as code that does not adhere to the preferred style.

ESLint has some default rules built in, but can be extended and configured however you like. There are many popular open source plugins (which we will see later) that enhance the existing ruleset or change it completely.

Your project retains full control over all rules, even if you are using an open source plugin, enabling endless customisation possibilities!

For a detail explanation of how to get started with ESLint, see the [Getting Started With ESLint](https://eslint.org/docs/user-guide/getting-started) guide.

### An example

In a nutshell, ESLint will analyse your code, check it against known common problems, and against your own style rules. When a violation is found, ESLint can let you know either in your editor (if you have a plugin for your editor installed) or in the console;

Take this rather auspicious looking code;

```javascript
document.write('Hello, World!')
```

When I run ESLint against this code, I get the following;

```shell
Jons-MacBook-Pro:eslint-scratch jonpreece$ ./node_modules/.bin/eslint index.js

/Users/jonpreece/source/eslint-scratch/index.js
  1:16  error  Strings must use singlequote  quotes
  1:32  error  Extra semicolon               semi

✖ 2 problems (2 errors, 0 warnings)
  2 errors and 0 warnings potentially fixable with the `--fix` option.
```

ESLint has identified issues with my code based on my own style preferences. I prefer my code to not require `semi-colons` and to prefer `single-quotes` over `double-quotes`.

ESLint is also telling me that were I to run the same command again, passing in the `--fix` flag, I could have those issues resolved automatically.

```javascript
document.write('Hello, World!')
```

And this is the end result. Exactly how I like it.

### A word of caution

Many teams are building ESLint into their CI/CD pipelines, or on pre-commit hooks, so that they can verify that code being checked-in to their repositories meets their quality guidelines. This is something I would recommend you experiment with as well.

I would, however, advise caution and take steps to ensure that the team is happy and on-board... and be prepared to make changes to your rules to accommodate others preferences for one style over another.

**Also**, you definitely could write your own rules. You can configure ESLint to behave exactly as you want, and you can do it all from scratch. You might, however, want to use a popular open source predefined ruleset and then tweak it to meet your own personal needs. That is exactly what I do and we will cover that shortly.

## What is Prettier

Prettier is an opinionated code formatter. Prettier takes your code, and moves it around and "tidies" it up in a standard way. A way that has been agreed by those in the open source community.

Prettier aims to stop all debates about how code should be displayed and formatted, and "just does it".

There are few options to configure Prettier. The configuration file itself is checked-in to your code repository and applies to the entire project and every developer working on it. Prettier can be ran from the command line, but is most useful when integrated to run on save when you are making changes to code.

There is a detailed explanation about why you should adopt Prettier on their website, [Why Prettier](https://prettier.io/docs/en/why-prettier.html)?

So, why do I personally choose to use Prettier, even when working on solo-projects? The answer is simple. Prettier is so easy to use and so powerful that I barely have to think about how I write my code, I just let Prettier take care of it.

Take the following code;

```javascript
<footer className="text-center mb-5">
  Developed By{' '}
  <a href="https://twitter.com/jpreecedev" target="_blank" rel="noopener noreferrer">
    Jon Preece
  </a>
  , 2019
</footer>
```

I wrote this React code. At first glance, it looks pretty reasonable. I want to display some text with a link to my Twitter profile.

As soon as I hit save, this happens;

```javascript
<footer className="text-center mb-5">
  Developed By{' '}
  <a href="https://twitter.com/jpreecedev" target="_blank" rel="noopener noreferrer">
    Jon Preece
  </a>
  , 2019
</footer>
```

**What on earth just happened???**

Prettier has happened.

Prettier took my 3 lines of code, and turned it into 12. Feels bad. At first.

So what happened? Well the code was originally quite wide. Prettier broke the code down into multiple lines so that it fits on the screen better, becomes easier to scan top to bottom (glance at), and to eliminate any potential horizontal scrolling. As somebody who regularly has at least 2 horizontal code splits in my editor, I now find that I can see the code much easier at a glance. Prettier also in this case recognised that I had trailing whitespace and inserted an empty space inside JSX brackets to ensure the space does not accidentally get lost.

I strongly recommend giving Prettier a try if you want to automate the process of having a tidier, more maintainable, and most importantly, more consistent code base.

It will feel a bit weird at first, but stick with it. I do make some alterations to how Prettier is configured out-of-the-box for all my projects, we will discuss that shortly.

## How I configure ESLint

I could write my own ruleset but that would take an awful lot of effort, so I lean heavily on rules that have been configured and discussed at great length by the wider open source community, and then adjust based on my own personal needs.

Here is an example from my [Premium Property Finder](https://github.com/jpreecedev/premium-property-finder) code repo;

```javascript
{
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "modules": true
    }
  },
  "env": {
    "browser": true,
    "jest/globals": true,
    "cypress/globals": true
  },
  "plugins": ["jest", "cypress"],
  "extends": [
    "airbnb",
    "prettier",
    "plugin:jest/recommended",
    "plugin:cypress/recommended"
  ],
  "rules": {
    "react/prop-types": "off",
    "react/jsx-filename-extension": [1, { "extensions": [".js"] }],
    "jsx-a11y/label-has-for": "off",
    "jsx-a11y/label-has-associated-control": "off"
  }
}
```

Here is a rough description of what is going on;

- I am using `babel-eslint` so that I can validate new syntax that I might be using that is not yet supported by ESLint natively
- I am targeting the browser primarily, but I also have rules for Jest and Cypress that are probably all different to each other
- I rely primarily on [Airbnb's JavaScript style guide](https://github.com/airbnb/javascript) as it is very closely aligned with my own coding styles
- I use Jest and Cypress plugins so I can be consistent with their preferred coding styles. Cypress, for example, is very opinionated and I only want Cypress's style to be applied to my Cypress tests
- I have some overrides as well;
  - I do not like `prop-types` in React, so I turn that off all together. I do not feel that `prop-types` brings much to the table.
  - I want my JSX code to live in files with a `.js` file extension. The Airbnb guide prefers the `.jsx` file extension, so I override this
  - I turn off some rules around accessibility because they do not seem to work properly with that semantics of this project

I roughly stick with this sort of configuration across many projects, but the real beauty is that I can commit this file to the repository and make whatever changes I want on a project by project basis. I can also have many of these in a single project and apply overrides on a folder-by-folder basis if required. Very flexible indeed!

## How I configure Prettier

My Prettier configuration is not that controversial. 👀

```json
{
  "printWidth": 90,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid"
}
```

Here is what is happening;

- I _increase_ the max-width of a line from the default `80` to `90`. That is because I find `80` is a touch narrow, and `90` feels like a good balance between too narrow and too wide.
- I prefer 2 spaces over 4 tabs
- I do not like semi-colons, I remove them where possible (99% of the time)

You can get a very good overview of all the options available on the [Prettier documentation site](https://prettier.io/docs/en/options.html).

You can run Prettier directly from the command line.

```shell
prettier --single-quote --trailing-comma es5 --write "{app,__{tests,mocks}__}/**/*.js"
```

This is particularly helpful when you want to run Prettier as part of a pre-commit hook, or as part of your CI/CD process.

For a full explanation of running Prettier from the CLI, see the [documentation](https://prettier.io/docs/en/cli.html).

## VSCode ESLint and Prettier extensions

As I want to basically forget all about things like code formatting and consistency, I always ensure that I have the ESLint and Prettier extensions installed in my editor of choice, VSCode, so I do not have to run the CLI commands every time I want to check that my code is formatted correctly and matches my style guide.

I use [ESLint for VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and always keep them enabled and up to date on every project.

## Summary

ESLint and Prettier are tools that can help your team write better quality code that is consistent with your teams/company's code style. ESLint is highly flexible and configurable, and there are many popular open source projects to help you get this done quickly. Prettier is a very opinionated code formatting tool that has minimal configuration, but is ideal for enforcing formatting consistency. A word of caution, using tools like this can be controversial in team environments, so it is important to have honest, open discussions with your team to ensure buy in.
