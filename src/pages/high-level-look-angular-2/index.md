---
layout: post
title: A high level look at Angular 2
date: 2016-09-03
categories: ['Angular','TypeScript']
tags:
  [
    'angular',
    'Angular',
    'javascript',
    'software development',
    'TypeScript',
    'typescript',
  ]
---

Developed by Google, Angular 2 is the newest version of the popular Single Page Application (SPA) framework. Angular 2 is a step in a new direction compared to previous versions, but has keep all the best characteristics and "lessons learnt" to deliver a fast, fully featured and rich ecosystem.

## About Angular 2

Angular 2 impacts your whole application, or at the least, a section of it, rather than specific pages. Angular 2 is best suited to new ("greenfield") development, as it can be relatively tricky to migrate legacy code (Angular 1.x code) to the new version. Angular 2 has new concepts, syntax, methodologies, and opinions, but is comparable to as previous versions in the way it works.

If you have been following Angular development since "the early days" of beta 1, then its been a very rocky road for you. Even now (this post was written around the release of RC5), the API is still evolving and new features are being added. Whilst this experience has been hard for early adopters, I believe the end result will be a fantastic, easy to use, and performant framework with a lower barrier to entry for all.

## Overview

The purpose of this post is to discuss the core concepts of Angular 2\. We're not looking to dive into the details at this point, a follow up post on that will come later. We will discuss; pre-processors, build tools, components, dependency injection, interpolation, pipes, directives, event bindings, two way data binding, lifecycle hooks, routing, services and the HTTP client.

I have a side project on [Github, named Angular2Todo](https://github.com/jpreecedev/Angular2Todo), which is an Angular 2 todo application written with Angular 2, [Universal Angular](https://github.com/angular/universal), and [ASP .NET Core](https://docs.asp.net/en/latest/intro.html). If you're interested in server side rendered Angular, please check that out.

This post is based on my own experience with Angular 2, and most of the knowledge has come from developing real world applications, [including this one on Github](https://github.com/jpreecedev/WebcalConnectFrontEnd).

Going forward, we will refer to Angular 2 simply as "Angular". Old versions of Angular will be referred to by their version number explicitly.

## TypeScript, Babel, ES6/ES5

It is hard to talk about Angular 2 without discussing [TypeScript](https://en.wikipedia.org/wiki/TypeScript) (See [TypeScript playground](http://www.typescriptlang.org/play/index.html) for a live interactive demo). Angular was originally written using [AtScript](https://en.wikipedia.org/wiki/AtScript), which was an extension of TypeScript (TypeScript with additional functionality). However, after much collaboration between the Angular team and the TypeScript team, it was decided to use TypeScript exclusively instead.

Angular is written using TypeScript, however, you don't necessarily have to write you Angular code using TypeScript, you could use; Babel, ES5 or ES6 if you prefer. If you are familiar with [Google Dart](https://www.dartlang.org/), that is also supported.

I believe that Angular 2 applications are most commonly being developed using TypeScript, so I'll use TypeScript throughout this post. If you need a summary of TypeScript, check out my [TypeScript Beginners Guide](/typescript/typescript-beginners-guide/) on this website, DeveloperHandbook.com.

At a high level, TypeScript is JavaScript. You can convert all your existing JavaScript code to TypeScript as easily as changing the file extension from JS to TS. The most useful feature of TypeScript is its transpiler, which takes your TypeScript code (which is basically ES6), and converts it into ES5\. Why would you want to do this? Most developers will want to utilise the new language features of ES6, ES7 and beyond, whilst not having to worry about cross browser compatibility. Support for ES6 is shaky at best on the desktop ([Microsoft Edge, I'm looking at you](http://kangax.github.io/compat-table/es6/)), and very poor across mobile devices. TypeScript takes this pain away by converting your code to ES5, which is stable and does have excellent support.

## Build tools

As we're working with TypeScript, and potentially other tools as well, it makes sense to use build tools like [Webpack](https://webpack.github.io/) or [Gulp](http://gulpjs.com/). Build tools can automate repetitive tasks, such as; transpiling the code (TypeScript to ES5), bundling (taking all your individual assets and merging them into one big file), minification (compressing that file for faster delivery to the client), and injection (referencing the new resource in the HTML).

Build tools can also watch your changes, and automatically build and refresh the browser automatically, so that you can focus on writing code and developing your application.

The [Angular documentation](https://angular.io/docs/ts/latest/), [once you get beyond the absolute basics](https://angular.io/docs/ts/latest/tutorial/toh-pt5.html#!#dashboard-top-heroes), encourages you to split your components (we will discuss these more next) into individual concerns. Your JavaScript, styles (CSS) and markup (HTML) are to be placed in individual files (component.js, component.css, component.html). This results in a lot of "chatter" between the client and server and can slow down the user experience (particularly on slower, mobile devices). Build tools can solve this problem by automatically injecting the markup and styles into your JavaScript files at compile time. This is certainly not a task you would want to perform manually!

Personally I have worked with both Gulp and Webpack when developing Angular applications. I prefer Webpack for how well it works, but I do not like the configuration aspect. Gulp is much easier to configure, but not as powerful (my feeling) as Webpack.

I have an example [Gulp](https://github.com/jpreecedev/WebcalConnectFrontEnd/blob/ef138505579e45aed5ef5a8a964bd026e2b0b3d5/gulpfile.js) and [Webpack](https://github.com/jpreecedev/webpack-4-scratch) configuration file on GitHub, that have both been used in real world applications.

## Components

Components are the basic building blocks of all Angular applications. Components are small and have their own state per instance (meaning you can reuse the same component many times on a single page without it colliding with other instances). Components closely follow the [open standard for Web Components](http://webcomponents.org/), but don't have the same pain of cross browser support (the Web Components standard has not been finalised yet). Components are a group of directly related JavaScript (logic), CSS (style) and HTML (markup), which are largely self contained.

Components in Angular are defined using the `@Component` class decorator, which is placed on a `class`, and take "metadata" which describe the component, and its dependencies.

A component might look like this;

```typescript
import { Component } from '@angular/core'
import { ROUTER_DIRECTIVES } from '@angular/router'

@Component({
  selector: 'my-app',
  directives: [...ROUTER_DIRECTIVES],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
```

This is ES6/TypeScript code. We create a class, called `AppComponent` using the `class` keyword. The `export` keyword makes the class "public", so that it can be referenced elsewhere throughout the application.

The `@Component` directive takes an object that describes the component.

* Selector: This is used in your markup. The selector is how you refer to the component in HTML. In this example, the code would be; `<my-app></my-app>`
* Directives: These are other components that you want to utilise in the components markup
* TemplateUrl: The path on the file-system to the markup
* StyleUrls: A string array of all the CSS files used to style the component

There are many values that can be passed in here, the main values are displayed.

### About styling

Why does Angular load the styles in this manner? Take the following markup (I've trimmed this slightly for simplicity);

```html
<tr>
    <td>...</td>
    <td>{{asDate(calibrationDue.date) ' date}}</td>
    <td>{{asDate(calibrationDue.expiration) ' date}}</td>
    <td>{{calibrationDue.registration}}</td>
    <td>{{calibrationDue.technician}}</td>
    <td>{{calibrationDue.customer}}</td>
    <td>{{calibrationDue.vehicleManufacturer}}</td>
</tr>
```

This is pre-compiled markup. The compiled, rendered markup looks something like this (again trimmed for simplicity);

```html
<tr _ngcontent-dqf-10="" class="pointer">
    <td _ngcontent-dqf-10=""></td>
    <td _ngcontent-dqf-10="">Sep 29, 2014</td>
    <td _ngcontent-dqf-10="">Sep 29, 2016</td>
    <td _ngcontent-dqf-10="">AA11AA</td>
    <td _ngcontent-dqf-10="">John Smith</td>
    <td _ngcontent-dqf-10="">John Smith Transport</td>
    <td _ngcontent-dqf-10="">Ford</td>
</tr>
```

Notice this rather auto-generated looking attribute that has been added to the markup? Well, it was auto-generated by Angular. The same attribute was also injected into the CSS. Why? to scope the CSS, to prevent it from having any effect on any other aspect of the site outside of the component itself. Any CSS you write in your CSS file, which is referenced by a component, cannot affect any other component or any other part of the site. The styles only affect the component itself. This is tremendously powerful and will result componentized CSS, but CSS that effectively does not cascade.

### Angular 1.5+

Components were introduced in Angular 1.5 to help ease the transition (the upgrade path) from Angular 1 to Angular 2\. If you are writing Angular 1 code currently and are looking to migrate to Angular 2 in the future, then consider re-writing your existing controllers into components to make your migration simpler in the future.

## Dependency injection

Dependency injection in Angular is similar, in my experience, to dependency injection in many other languages/frameworks. Angular takes over managing the lifecycle of a components (or services) dependencies, and dependencies of those dependencies.

When you need to use a dependency, a service for example, you inject it into your component through the constructor. Dependency injection example;

```typescript
import { Component, OnInit } from '@angular/core'
import { TodoStore, Todo } from '../services/todo.service'

@Component({
  selector: 'app-footer',
  template: require('./footer.component.html')
})
export class FooterComponent implements OnInit {
  constructor(public todoStore: TodoStore) {}
}
```

In the above example, our component needs to ues the `TodoStore`. Rather than creating a new instance of it inside the `constructor`, we add it as a parameter to our `constructor`. When Angular initialises our component, it looks at these parameters, finds an instance, then supplies it to the component.

Dependency injection in Angular is hierarchical. When the component needs a dependency, Angular looks to the components ancestors (parents, grandparents etc) until an instance is found. Depending on how you construct you application, dependencies can be (and probably will be) singletons. However, as dependency injection in Angular is hierarchical, it is possible to have multiple instances of the same service. When dependencies are defined at the "root level" of the application, the service will always be a singleton.

Angular takes care of initialising the dependency, and the dependencies of the dependency, so you only need to worry about using the dependency and not worry about managing it.

In the above code example, we are "referencing" each dependency using its type, therefore we don't have to concern ourselves with making our code "minification safe". In Angular 1, we define all our dependencies in a string array (`$inject`) so that Angular knows the names of each dependency at run time even after the code has been mangled. This step is no longer necessary.

### Why?

Why would you want to handle dependencies in this way? Code complexity is reduced, and we can make our unit tests simpler. How? When using testing we can tell Angular to inject mock versions of our dependencies, to speed up the tests and ensure we're only testing our own code and not Angular itself.

If you inject `HttpClient` into a service, for example, you would not want to make real HTTP requests to the server when running your tests. Instead, you inject a mock version of the HTTP client and simulate the request/response, for faster, consistent results.

## Interpolation

Perhaps the most familiar concept in Angular, interpolation. Interpolation is the means of evaluating expressions, and displaying the results.

Take the following example;

```html
<div class="view">
  <input class="toggle" type="checkbox" (click)="toggleCompletion(todo)" [checked]="todo.completed">
  <label (dblclick)="editTodo(todo)">{{todo.title}}</label>
  <button class="destroy" (click)="remove(todo)"></button>
</div>
```

The interpolation code is on line 4, `{{todo.title}}`. There is an object on the component, called `todo`. The object is a complex object, so it has many properties (and functions). In this case, we want to display the `title` of the `todo` to the user. Angular looks at this expression, determines the value of `todo.title` and renders it on the view. Whenever the value changes, that change is evaluated and displayed automatically.

You can display the results of practically any expression. Take another example; `{{2+2}}`. The result is _4_, so _4_ will be displayed on the view.

It is also permitted to invoke functions in interpolation expressions. The following code is perfectly valid;

```typescript
'{{ getTheCurrentDate() }}'
```

As long as the component has a function called `getTheCurrentDate`, Angular will invoke it and display the result. You should avoid calling functions when possible as Angular will evaluate them more frequently than you expect, which can hurt performance when the functions do a lot of work. Instead, favour properties that do not change frequently.

Angular has a dependency on another open source project, called [Zone.js](https://github.com/angular/zone.js/). Zone.js handles change detection, and informs Angular when changes occur. Talking about Zone.js is out of scope of this post.

## Pipes

Pipes are usually used in conjunction with interpolation. Pipes, known as filters in Angular 1, are used to format data.

For example;

```html
<div>
    {{todoStore.todos | json}}
</div>
```

The above code takes the array of `todos`, and converts it to a string and displays that result in the view.

The following are pipes built in to Angular;

* `Async` - Automatically subscribe to observables, which are used extensive in Angular (Angular has a dependency on [RxJS](https://github.com/Reactive-Extensions/RxJS)).
* `Date` - Used to format a date object. For example; _Sunday 21st August 2016_.
* `Percent` - Used to display a number as a percentage, can pass in the number of decimal places to show.
* `JSON` - Used to "toString" JavaScript objects
* `Currency` - Format numbers as currencies ($10.99 or £10.99)

Notice there is no OrderBy pipe in the list, like there was in Angular 1\. That is because ordering was a particular pain point in Angular 1\. Because of the way that Angular 1 detected changes, the ordering would often occur multiple times, which when working with large data sets killed performance. The Angular team have excluded the OrderBy pipe in favour of ordering being done by your code, within the component or service.

There are some other [less important pipes](http://voidcanvas.com/angular-2-pipes-filters/#all-predefined-pipes), but generally there is significantly less built in pipes than in previous versions. This was a deliberate choice to keep the code base lean and clean.

## Structural Directives

Structural directives directly affect the structure, or the elements within, the DOM (Document Object Model). Structural directives can add DOM elements, remove them and modify them.

The most commonly used structural directives are;

* `ngFor`, which is used to loop through items in an array
* `ngIf`, which adds/removes an element to/from the DOM depending on the result of an expression

The syntax for structural directives is different from the norm. Structural directives are prefixed with an asterisk (\*). Take the following code;

```html
<footer class="footer" *ngIf="todoStore.todos.length > 0">
  <span class="todo-count">
    <strong>{{todoStore.getRemaining().length}}</strong>
    {{todoStore.getRemaining().length == 1 ? 'item' : 'items'}} left
  </span>
  <button class="clear-completed" *ngIf="todoStore.getCompleted().length > 0" (click)="removeCompleted()">
    Clear completed
  </button>
</footer>
```

The structural directive is shown on line 1\. `*ngIf="todoStore.todos.length > 0"`. If the expression evaluates to true, then the `footer` is rendered, and all expressions within are rendered too. When the expression evaluates to `false`, the DOM element and all of its children are thrown away, removed from the DOM. This is to save Angular from having to evaluate code that the user is never going to see.

Below is an example of `ngFor`;

```html
<ul class="todo-list">
    <li *ngFor="let todo of todoStore.todos">
        <app-todo [todo]="todo"></app-todo>
    </li>
</ul>
```

On our component, we have a collection of `todo`, which contains zero, one or more items. For each `todo` in the collection, a new `<li>` is created. Angular scopes the `<li>` with the `todo`, so that any child element within the `<li>` can make use of the `todo`. In this example, the `todo` is passed to another component, called `TodoComponent`, whose responsibility is rendering single `todo`'s to view.

In a nutshell, `ngFor` is a loop. Each iteration of the loop creates a new element which "knows" about the current item.

## Attribute Directives

Next, we have Attribute Directives, which are responsible for changing the appearance of DOM elements. When using this square-brackets syntax, it "feels" like manipulating the DOM in JavaScript.

Consider the following code sample;

```html
<div>
    <p [style.background]="backgroundColor">Hello, AO.com!</p>
</div>
```

The `backgroundColor` is a property on the component. In code, we can set the value of `backgroundColor` to be a color (yellow, or #ffff00 for example). The end result will be an inline style being applied, with the background property set to yellow.

Here is a screenshot on the compiled code at run time;

![Angular 2 - Attribute directive run time example](attributedirective.png)

You are not limited to manipulating the style of the element, you can change just about any property of the element.

Take another example;

```html
<li *ngFor="let todo of todoStore.todos" [class.completed]="todo.completed" [class.editing]="todo.editing">
    <app-todo [todo]="todo"></app-todo>
</li>
```

In this example, we are adding the CSS classes _completed_ and _editing_ to the element when `todo.completed` or `todo.editing` is true. Likewise, when false, the classes are removed.

Again, we could control the `checked` state of a Check Box (`input` field with a type of `checkbox`).

```html
<input class="toggle" type="checkbox" (click)="toggleCompletion(todo)" [checked]="todo.completed">
```

When `todo.completed` is true, the Check Box is checked, otherwise, it is not checked.

## Event Bindings

Event bindings are used to listen for user interactions, or events that get raised when the user interacts with the page or an element. Some events you may be interested in responding to; clicks, mouse moves, focus, blur, etc.

Event bindings are added to DOM elements and are denoted with brackets. Angular keeps an internal list of all the events it understands. If you try to listen for an event that it doesn't map, Angular will look to your code instead (you can define your own custom events).

When an event occurs, typically a function on your component is invoked. You can pass arguments to the calling fuction, such as state, the event object, DOM elements, arbitrary values and more. It is also possible to pass state from one component to another using this mechanism.

Take the following example;

```html
<label (dblclick)="editTodo(todo)">{{todo.title}}</label>
```

When the user double clicks on the label, the `editTodo` function is invoked. In this example, this element has a `todo` in scope, which is passed as an argument to the function.

Another example;

```html
<input class="edit" *ngIf="todo.editing" [(ngModel)]="todo.title" (blur)="stopEditing(todo, todo.title)" (keyup.enter)="updateEditingTodo(todo, todo.title)"
  (keyup.escape)="cancelEditingTodo(todo)">
```

In this example, we are responding to the `blur` event (when the control loses focus) and key-presses (enter, escape) so we can perform an appropriate action when the user presses these keys on their keyboard.

## Two way data binding

Two way data binding is primarily used when binding `input` controls to properties on the component. When using a two-way data binding, when a user interacts with a form (types data into a text field) that change is automatically reflected on the component. Likewise, if a property that is bound to an `input` field is changed in code (either by the component itself, or by something else, say an `Observable` being resolved) that change is reflected in the view immediately. Two way data binding is a mechanism for synchronising data between the view and the component.

To utilise two way data binding, you use `ngModel`. The syntax for correct use of `ngModel` is known as the [banana in a box syntax](http://www.bennadel.com/blog/3008-two-way-data-binding-is-just-a-box-of-bananas-in-angular-2-beta-1.htm) (click the link for a full explanation as to how the name came about).

In reality, the banana in a box syntax is an amalgamation of and attribute directive and an event binding (and combination of the two). Banana in a box syntax is syntactic sugar for two mechanisms being used together, which helps you write less code.

Take the following example;

```html
<input class="new-todo" placeholder="What needs to be done?" autofocus="" [(ngModel)]="newTodoText" (keyup.enter)="addTodo()">
```

When the value entered into the input field changes, the property `newTodoText` is automatically updated.

Now consider the long hand version of the same code;

```html
<input class="new-todo" placeholder="What needs to be done?" autofocus="" [ngModel]="newTodoText" (ngModelChange)="newTodoText=$event" (keyup.enter)="addTodo()">
```

A separate event is needed to assign the new value to the property on the component (`$event`).

By combining the attribute directive and event binding, the code is more readable. The less code we can write, the easier our application will be to maintain over time.

## Lifecycle Hooks

Lifecycle hooks can be thought of as events that get raised at key points during your components lifecycle. Lifecycle hooks are callback functions that are invoked by Angular when the component is in various transitional events.

Put another way, lifecycle hooks help you to execute code at the right times during the initialisation and destruction of your components.

Lets say your component needed to request some data from a HTTP endpoint. Where do you put code like that? In the `constructor`? No, ideally the `constructor` should be kept as clean as possible and should only initialise variables at the most. Having your constructor do a bunch of work will probably make your application run more slowly. Ideally what you need is a "load event". Lifecycle hooks provide this. Lifecycle hooks help you execute code at the right time.

The most commonly used lifecycle hooks; _ `ngOnInit`: The "load event" _ `ngDoCheck`: Raised when Angular is running its internal change detection _ `ngAfterViewInit`: Raised when the component view has finished initialising _ `ngOnDestroy`: Called when the class is being destroyed/cleaned up

**Side note**; TypeScript has a construct called interfaces. If you come from a .NET background, interfaces in TypeScript are the same as what you already know. For everybody else, interfaces can be best thought of as "contracts", which promise that the `class` that implements the interface also implements all the properties/functions defined on the interface. If a `class` implements an interface, and that interface has a function defined called `ngOnInit`, then the compiler can guarantee that function has been implemented on the `class`. (If not, a compile time error is emitted). Angular exposes an interface, called `OnInit`, that has a single function defined, called `ngOnInit`. Implementing this interface is best practice, but not mandatory. Just having the function in your `class` is good enough.

Example usage:

```typescript
import { Component, OnInit, Input } from '@angular/core'
import { TodoStore, Todo } from '../services/todo.service'

@Component({
  selector: 'app-todo',
  template: require('./todo.component.html')
})
export class TodoComponent implements OnInit {
  ngOnInit() {
    //"load" logic goes here
  }
}
```

Some time after the instance of the component has been created, Angular will invoke the `ngOnInit` function, assuming it exists, enabling you to run custom logic (and call that HTTP endpoint, if that is what you need to do).

## Routing

Routing is how the user gets around your Angular application. Routing is navigation between views/components. State, in the form of parameters, can be passed between views and can be injected into your components. A route is a combination of a path and a component. Routes are referred to by their path in your markup using the `routerLink` attribute directive.

Example usage;

```html
<a routerLink="home" routerLinkActive="active">Home</a>
<a routerLink="about" routerLinkActive="active">About</a>
```

The above code sample also shows the use of the `routerLinkActive` attribute directive. This directive applies a CSS class to the element it is applied to when that route is active. The `routerLinkActive` directive works in conjunction with the `routerLink` directive, so that when the route referenced by the directive is active, the custom CSS class (in this case, called `active`) is applied to the element. Typically, you would want to change the visual appearance of the DOM element to indicate to the user that they are on a particular page.

Routing in Angular has been on a roller-coaster ride of changes throughout the alpha, beta and release candidate (RC) phases. The current iteration of the router uses a hierarchical router configuration approach to define routes, child routes, and to enable deep linking. For the sake of simplicity, we won't discuss hierarchical routing/deep linking in this post, but be aware that it can be achieved by having multiple route configuration files at different levels of your applications. Child routes are extensions of their parents route.

### Router configuration

To define the main routes of the application, we create a `RouterConfig` object, which is an array of routes. Most routes consist of a `path` and `component`. Other routes can have additional properties, like wildcard routes, which decide what to do when the user navigates to a path that does not exist (using the `redirectTo` property).

Example usage;

```typescript
import { RouterConfig } from '@angular/router'
import { HomeComponent } from './components/home/home.component'
import { AboutComponent } from './components/about/about.component'

export const routes: RouterConfig = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: 'home' }
]
```

Here we have four routes defined;

* Default route: No `path` is defined, so when the user hits the page with no route parameters, they are redirected to 'home' (defined next).
* Home route: Displays the `HomeComponent`.
* About route: Displays the `AboutComponent`.
* Wildcard route (\*\*): When the route is not recognised, the user is redirected to the 'home' route. This is a catch-all.

The `RouterConfig` object is then referred to in the applications bootstrapper (loads the application and its component parts, called `bootstrap`).

Example usage (some code omitted for brevity);

```typescript
import { provideRouter } from '@angular/router'
import { routes } from './routes'

bootstrap(AppComponent, [
  ...HTTP_PROVIDERS,
  FormBuilder,
  TodoStore,
  provideRouter(routes)
])
```

The `provideRouter` function is exposed by the Angular router, and takes the `RouterConfig` object we just created.

### More router directives

Angular also helps control navigation with several additional directives.

* `routerOutlet`: Tells Angular where to put the view/component (used within the application shell, typically the `AppComponent`).
* `CanActivate`: Allows navigation to be cancelled (useful for restricting access to certain pages under certain circumstances, like trying to access a page when the user is not logged in).
* `CanDeactivate`: Runs before the route is changed, and can also cancel navigation (useful when, for example, prompting the user to save changes they have made to a `form`).

Angular does not "just know" about these directives, as everything router related lives within its own module. You must `import` the directives into your `AppComponent`'s `directives` array;

```typescript
import { Component } from '@angular/core'
import { ROUTER_DIRECTIVES } from '@angular/router'

@Component({
  selector: 'app',
  directives: [...ROUTER_DIRECTIVES],
  template: require('./app.component.html'),
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
```

The `ROUTER_DIRECTIVES` constant is a shortcut (an array, which includes all the directives previously discussed) to keep the code a bit cleaner.

## Services

To end on a lighter note, services a reasonably straightforward in Angular. Services are classes that have the `@Injectable` decorator applied to them. The `@Injectable` decorator tells Angular that the class can be injected into components/directives/other services etc.

Services are used to share and abstract common functionality between one or more components. Services can help reduce code complexity and duplication. Depending on the configuration of your application, (remember the hierarchical dependency injection?), services can be singletons and maintain state over the lifetime of the application. Services can also have their own dependencies, which is handled the same way as how dependencies for your components are handled.

Example usage;

```typescript
@Injectable()
export class TodoStore {
  //Implementation omitted
}
```

I like to use services to add additional abstraction to some built in Angular services. Why? If the Angular API changes (and it has changed a bunch in the past), I have a single place where I have to make changes and get back up and running quicker.

## Summary

Angular 2 is an opinionated web application framework for developing single page applications (SPA's), and is actively developed by Google. Angular 2 is a move away from the original framework, it introduces and syntax's and a "new way of doing things". Important problems with past versions have been overcome (change detection/dirty checking was a major flaw of Angular 1) and the framework is taking a new direction. Whilst it is possible to write Angular 2 code in many ways, the preferred approach is to use TypeScript. There is a learning curve involved, the tooling especially is very much in its infancy, but once over the initial hump Angular 2 can be a fantastic framework when used in the manner it was intended for.
