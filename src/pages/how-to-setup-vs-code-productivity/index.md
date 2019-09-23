---
layout: post
title: How to set up Visual Studio Code (VSCode) for next level productivity
description: I use VSCode every day for React development and its one of my favourite power-tools.  Here are my pro-tips for take productivity to the next level.
date: 2019-09-23
categories: ['React', 'JavaScript']
group: 'Software Development'
featuredImage: './vscode-react.png'
---

On a day-to-day basis, both inside and outside of work, I spend most of my time writing front-end code (specifically, React.js) using VS Code. Productivity is very important, as I am usually under pressure to get work done quickly and to the highest standards. Having the right editor set-up goes a long way to ensuring that I am not wasting time on menial tasks like code formatting and instead spend that time focusing on the problem at hand.

My editor and project should be correctly configured and ready for the problem at hand.

1. **Linting and formatting** should be largely based on some open source/community agreed upon standard. Compliance should be verified on save and commit and should be automatic. Almost no time should be spent manually linting any file I touch.
2. The **terminal** should be pre-configured and set up with the right fonts, colours, and plugins. I expect to have multiple terminals working concurrently, so split/tab view is essential.
3. **Extensions**. VS Code has a lot of great functionality out-of-the-box, but there are some key extensions that take that functionality to the next level (and fill the gaps).
4. **Keyboard shortcuts**. It is very much worth taking the time to learn some of the most important shortcuts in VS Code so you do not have to waste valuable seconds searching through menus with the mouse.
5. **Pre-commit/push hooks**. Linting should run automatically on pre-commit, and tests should run on pre-push, so that I do not accidentally push broken code to the repo.

## How to configure Prettier, ESLint and Stylelint

Prettier, ESLint and Stylelint are essential tools for helping you and your team write cleaner, more maintainable code.

Prettier is an opinionated code formatter. Prettier takes your code, and moves it around and "tidies" it up in a standard way. Prettier works in conjunction with ESLint. Stylelint essentially is ESLint and Prettier for CSS and SCSS.

EditorConfig attempts to override user settings (tabs vs spaces, indent size etc) on a per project basis to ensure consistency between machines and developers.

I highly recommend installing in VS Code the official extension for each tool, so that you can configure VS Code to run them automatically instead of having to rely solely on NPM scripts.

<div class="alert alert-primary">
<strong>VS Code Extensions Gallery</strong><br/><a href="https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode">Prettier - Code formatter</a>, <a href="https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint">ESLint for VSCode</a>, <a href="https://marketplace.visualstudio.com/items?itemName=shinnn.stylelint">stylelint</a> and <a href="https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig">EditorConfig for VS Code</a>.
</div>

With all the extensions installed, you can configure your project with various dot files and NPM scripts.

### How to set up and configure ESLint

ESLint is configured using a dot file. Create a `.eslintrc` file at the root of your project and add the following;

```json
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
    "browser": true
  },
  "extends": ["airbnb", "prettier"],
  "rules": {
    "react/prop-types": "off",
    "react/jsx-filename-extension": [1, { "extensions": [".js"] }]
  }
}
```

ESLint uses rules to decide how to lint your code. ESLint can be configured manually or using a pre-existing ruleset. Configuring ESLint manually can be a huge undertaking, so many people use open source rulesets instead. In this case, we have used the popular [Airbnb styleguide](https://github.com/airbnb/javascript), with a couple of customisations.

Install ESLint and its dependencies using the following command;

```shell
npm install --save-dev babel-eslint eslint eslint-config-airbnb eslint-config-import eslint-config-jsx-a11y eslint-config-node eslint-config-promise eslint-config-react
```

I highly recommend [having a look at the official documentation to understand how ESLint works](https://eslint.org/docs/user-guide/getting-started) and how to configure it.

### How to set up and configure Prettier

Prettier is configured using a dot file. Create a `.prettierrc` file at the root of your project and add the following;

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

Install Prettier and its dependencies using the following command;

```shell
npm install --save-dev eslint-config-prettier eslint-config-prettier prettier
```

For a full explanation of what exactly each of these options means, [have a look at the documentation](https://prettier.io/docs/en/options.html). Most should be self-explanatory. You can adjust these settings on a project-by-project basis.

### How to set up and configure Stylelint

Stylelint helps with consistency and to avoid common CSS errors. Stylelint uses rules to decide how to organise and format code. Stylelint can be configured manually or using a pre-existing ruleset.

Personally I use [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard) for all my projects and I never override it. If you want to choose a different ruleset, [have a look at the documentation](https://github.com/stylelint/stylelint#extend-a-shared-configuration).

Create a new file called `.stylelintrc` in the root of your project, and add the following;

```json
{
  "extends": "stylelint-config-standard"
}
```

Install Stylelint and its dependencies using the following command;

```shell
npm install --save-dev stylelint stylelint-config-standard
```

Next time you work on a CSS or SCSS file and save changes, your code should be automatically tidied and organised.

### Format on save

You can turn on **Format On Save**, so that Prettier/ESLint and Stylelint run automatically on every save, as follows;

- In VS Code, click `Main Menu > Preferences > Settings`.
- In **Search settings**, type **Format On Save**
- Ensure option is selected as shown

Now each time you press save, or the file you are working on auto saves, Prettier will run automatically and tidy your code. This is great because it completely eliminates the _need to care about formatting ever again_. 👍

### How to set up and configure EditorConfig for VS Code

EditorConfig is configured using a dot file. Create a `.editorconfig` dot file at the root of your project and add the following;

```text
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
end_of_line = lf
# editorconfig-tools is unable to ignore longs strings or urls
max_line_length = null
```

I prefer 2 spaces, no trailing whitespace, and a new empty line at the end of each file. If you want to understand what each of these options does, [have a look at the documentation](https://editorconfig.org/).

### NPM Scripts

You can run Prettier and ESLint directly from NPM scripts (if you prefer not to use the extensions). Add the following scripts to your `package.json` file.

```diff
"scripts": {
+  "lint": "./node_modules/.bin/eslint --ext .js,.jsx --ignore-pattern public .",
+  "prettier": "prettier \"./src/**/*.{js,jsx,json,yaml,yml,md}\" --write",
}
```

The added benefit is that you _could_ call these scripts directly from your pre-commit hooks, which we will look at shortly.

## Font ligatures in VS Code

You might not exactly _need_ font ligatures, but they are cool and they certainly do improve code readability. Only specific fonts support ligatures.

![VS Code - Fira Code Ligatures](fira-code-vscode-ligatures.jpg)

The graphic shows code on the left with ligatures, and code on the right without. ([Borrowed from Fira Code GitHub repo](https://github.com/tonsky/FiraCode)). Ligatures are purely visual and do not impact the code you write/commit.

To set up, do the following;

1. Install [FiraCode](https://github.com/tonsky/FiraCode/wiki/Installing).
2. Open `Code > Preferences > Settings` from the menu bar (`File > Preferences > Settings` on Windows).
3. Under **Commonly Used**, expand the **Text Editor** settings and then click on **Font**. In the **Font Family** input box type Fira Code, replacing any content. Tick the check box **Enabled/Disables font ligatures** under **Font Ligatures** to enable the special ligatures.

You may need to restart VS Code to see the change.

## How to configure VS Code to use iTerm2 and Oh-my-zsh

You will spend a lot of time in the terminal so I highly recommend taking some time to add a decent terminal. The terminal built in to Mac and Windows are decent enough, but iTerm and Oh-my-zsh have many power-tools and are easy to extend with community built plugins.

![VS Code - iTerm2 - Oh-My-Zsh](vs-code-terminal-ohmyzsh-iterm2.png)

Personally, I use iTerm2 with Oh-My-Zsh and the Agnoster theme, which gives a really nice visual style and indicative icon set that gives me more information about the repo I am working on and the success of executing the previous command.

First, [download iTerm2](https://www.iterm2.com/), then follow this [very precise tutorial on how to set up Oh-My-Zsh](https://gist.github.com/480/3b41f449686a089f34edb45d00672f28) with VS Code. When done, be sure to go ahead and install the [Zsh Autosuggestions plugin](https://github.com/zsh-users/zsh-autosuggestions). This little plugin is a real timesaver, as it shows you autocomplete options based on commands you have ran in the past.

## The best productivity extensions for VS Code

When starting out, I recommend these extensions to boost your productivity.

- [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer). This makes finding matching brackets easier, especially when working with others.
- [ES7 React/Redux/GraphQL/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets). This has many built in snippets that save tedious repetitive typing.
- [Indent Rainbow](https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow). This helps with readability and nesting.
- [Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest). Runs your unit/integration test directly in VS Code and shows a little green or red icon next to the test to indicate the passing status of the test. Saves having to run a watcher in a separate terminal window.
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens). Saves having to type out every Git command in the terminal, instead adds useful commands directly into VS Code itself, as well as displaying details about the last edits made to each file.

Not strictly an extension. VS Code has built in support for Emmet, which I highly recommend learning to a good level. [Emmet is a text expander](https://code.visualstudio.com/docs/editor/emmet), so you can save time on typing long repetitive code.

Finally, if you find yourself typing out the same repetitive code over and over, consider making a custom snippet. There is an [excellent official user guide](https://code.visualstudio.com/docs/editor/userdefinedsnippets) that explains how to do this.

## VS Code best shortcuts cheat sheet

Repeating an action over-and-over and using the mouse every time? Using a keyboard shortcut is probably more efficient.

<table class="table table-striped table-bordered"><thead><tr><th>Key</th><th>Description</th></tr></thead><tbody><tr><td>⌘ S</td><td>Save</td></tr><tr><td>⌘ P</td><td>Go to file</td></tr><tr><td>⌘ F</td><td>Find in file</td></tr><tr><td>⌘ ⇧ F</td><td>Global search</td></tr><tr><td>⌘ ⇧ P</td><td>Open command pallete</td></tr><tr><td>⌘ ⇧ Up</td><td>Move line up</td></tr><tr><td>⌘ ⇧ Down</td><td>Move line down</td></tr><tr><td>⌘ ⇧ Right</td><td>Select line to the end</td></tr><tr><td>⌥ ⇧ Drag</td><td>Multi cursor one per line</td></tr><tr><td>F12</td><td>Go to definition</td></tr></tbody></table>

This is a non-exhaustive list of shortcuts within VS Code that I use on a regular basis (probably many dozens of times a day). It is worth taking some time to memorise these, or perhaps print them out and put them somewhere visible to you.

## How to use Husky for on pre-commit/pre-push

Husky is a commonly used tool for performing actions on `git commit` and `git push`. Typically, Husky is used for linting staged files and running automated tests. Linting is typically performed and committed immediately on commit. Tests are often run on pre-push, meaning just before you push your changes to the repo, all tests are run and if any fail, the push fails. This can prevent you pushing a broken build to your CD/CI pipeline where it may take longer to resolve or cause problems for other team members who may pull in your changes.

Setting up your repo with Husky is easy. First, ensure you have Prettier installed;

```shell
npm install --save-dev prettier
```

Then install Husky, and Lint-Staged using the following command;

```shell
npx mrm lint-staged
```

The necessary packages will be added to your `package.json` and a new section will be added. Exactly what gets added will depend on the code in repo. You will probably end up with something as follows;

```diff
{
+ "husky": {
+   "hooks": {
+     "pre-commit": "lint-staged"
+   }
+ },
+ "lint-staged": {
+   "*.{js,css,json,md}": [
+     "prettier --write",
+     "git add"
+   ],
+   "*.{js,jsx}": [
+     "eslint --fix",
+     "git add"
+   ],
+   "*.css": [
+     "stylelint --fix",
+     "git add"
+   ]
+ }
}
```

You can modify this config as you see fit. I like to add the `pre-push` hook to run my tests automatically, as follows;

```diff
{
 "husky": {
   "hooks": {
-     "pre-commit": "lint-staged"
+     "pre-commit": "lint-staged",
+     "pre-push": "npm run test"
   }
 },
 "lint-staged": {
   "*.{js,css,json,md}": [
     "prettier --write",
     "git add"
   ],
   "*.{js,jsx}": [
     "eslint --fix",
     "git add"
   ],
   "*.css": [
     "stylelint --fix",
     "git add"
   ]
 }
}
```

Now any file you work on, stage, and commit will be automatically linted, and your tests will run automatically so no more accidental broken commits!

## Summary

We covered a lot of ground in this post. We looked at how to set up and configure Prettier, ESLint, and Stylelint in VS Code. We also discussed how to run Prettier and ESLint automatically, via NPM scripts, and via pre-commit hooks using Husky and Lint-Staged. We also discussed how to install the popular open source coding font Fira Code, and turn on font ligatures. We briefly touched on how to configure VS Code to use iTerm2 and Oh-my-zsh (with plugins), and how to boost your productivity by installing several third-party extensions. Finally, I highlight some of the most common keyboard shortcuts to speed up repetitive tasks that are slow when using a mouse.
