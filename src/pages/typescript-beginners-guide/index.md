---
layout: post
title: TypeScript beginners guide
date: 2015-10-02
categories: ["TypeScript"]
tags: ["TypeScript","typescript"]
---

TypeScript is a tool that enables you to write better JavaScript. You may have heard that TypeScript is a superset of JavaScript, but what does that mean? TypeScript is JavaScript. If you know JavaScript already, then you already know JavaScript. You can convert an existing JavaScript file to TypeScript simply by changing the file extension. TypeScript has a very low barrier to entry (you can easily write it using Notepad) and has a small learning curve.

TypeScript has a transpiler, called **tsc** which transforms (compiles, if you like) your code from TypeScript to JavaScript. If you use any TypeScript paradigms, then your code cannot be understood directly by a JavaScript execution engine ([V8](https://code.google.com/p/v8/) for example). You can, however, enable source maps and debug your TypeScript code directly.

## Developers: "Why should I bother using TypeScript?"

When I talk to developers about TypeScript, the first thing they ask me is "Why should I bother using TypeScript?" or "I already understand JavaScript and I've been using it for x years, so I don't feel the need to use it...".

This is a great platform to explain to people _why_ they should use TypeScript. Not because I'm on some personal mission or because I get paid by Microsoft (I don't, but that would be awesome by the way) ... it is because TypeScript can genuinely help developers write better code.

### TypeScript enables developers to write more robust code

TypeScript provides several out of the box features that enable you to write more robust JavaScript;

### 1. Static typing

Properties, fields, function parameters and more can be decorated (sprinkled) with type declarations, which act as hints to the compiler and ultimately result in compile time type checking.

You can start very simply, by, say, adding a `string` type to a function parameter.

```javascript
function print(message:string) {
    //Console log message here
}
```

This will ensure that any calling method passes a `string` value as a parameter. This means that should you attempt to pass, for example, a `number` you will get a compile time error.

If you think type checking can be a hindrance to the dynamic nature of JavaScript, read on.

### 2. TypeScript is optional, and it takes a back seat

Unlike most other programming paradigms, TypeScript is completely optional. If there is a feature you don't like, you don't have to use it. In fact, you can write 100% pure vanilla JavaScript inside a **.ts** file and never include any TypeScript paradigms and everything will work just fine. If you do encounter compile time errors, TypeScript will still emit your compiled JavaScript... you are not forced to fix the compilation error, unlike other compiled languages like C++ or C# for example.

In TypeScript 1.5+ there is a flag that stops compilation in the event that you encounter an error, should you choose to utilize this feature.

### 3. TypeScript is free, open source

Not only is TypeScript completely free and open source (even for commercial development), but there is also tooling for all the main operating systems (Linux, Mac, Windows) and is not just limited to the Microsoft stack. You can get TypeScript via NPM, NuGet, or you can download it from [GitHub](https://github.com/Microsoft/TypeScript).

### 4. TypeScript enables developers to write modern JavaScript

Good developers want to use the latest iteration of their tools. They use these tools everyday, so keeping up to date makes sense.

The single biggest frustration for web developers who write JavaScript is cross browser support (is your company still supporting IE8?). TypeScript enables developers to write code against emerging standards whilst maintaining backwards compatibility. TypeScript is technically a transpiler and not a compiler, and it has a bunch of useful transformations to make this possible.

It is fair to say that the ECMAScript standard (the standard from which JavaScript ultimately derives) hasn't evolved much over the last decade. There has been incremental updates, yes, but there has been a long gap between ES5 and ES6 (about 6 years to be precise). That's all changed now, as the [TC39 committee](http://www.ecma-international.org/memento/TC39.htm) have committed to releasing revised standards on a yearly basis. In fact, officially, the ES6 standard has been renamed to ES2015, ES7 has been renamed to ES2016, and there will be yearly releases going forward. TypeScript enables developers to utilise these new standards because it provides transformations for many of them.

Example; TypeScript 1.5 transforms the following ES6 string interpolation code;

```javascript
var name = "Jon Preece";
var a = "Hello, ${name}";
```

to ES5 friendly string concatenation;

```javascript
var name = "Jon Preece";
var a = "Hello, " + name;
```

Yes, you can use most ES6 features knowing with 100% confidence that the emitted code is widely supported by all decent browsers (IE 7+ at least).

In the interest of fairness, this isn't true for all ES6 features. For example [Promises](http://www.html5rocks.com/en/tutorials/es6/promises/) must be supported natively by the browser (or [polyfilled](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills#ecmascript-6-harmony)), there are many transformations available... resulting in a lot of developer feel-good. Check out my post [Using ES6 features with TypeScript](www.typescriptguy.com/getting-started/using-es6-features-with-typescript/) for more transformations.

Ultimately, however, I always recommend to developers that they use the right tools for the job, and that they use the tools that they themselves are most comfortable using. I recommend the same for you. Take the time to evaluate TypeScript, experiment with it, and see if it can be introduced into your daily development workflow. If you are developing a greenfield project, why not introduce it from the beginning?...after all, TypeScript really comes into it's own when used in a medium to large team environment.

## The Basics

### Converting a JavaScript file to TypeScript

As briefly mentioned, you can convert a JavaScript file to TypeScript by changing the file extension from **.js** to **.ts**. You will have to call upon the TypeScript compiler (known herein as **tsc**) to emit the resulting JavaScript file for you.

There are several approaches to using tsc depending on your operating system, IDE, and preferences. My operating system of choice, for example is Windows 8.1 with VS Code. You, however, might use Sublime Text on a Mac or Vim on Ubuntu (these are just examples).

### Add type declarations to function parameters

The simplest feature of TypeScript to use out of the box, and arguably the best feature, is type declarations, or static typing. You declare the type of a function parameter using the following syntax;

```javascript
function print(message:string) {
    //Console log message here
}
```

This is the same code as shown earlier. We want to log a message to the console window, or display a message to the user, or whatever the case is. It's reasonable to assume that the message will be a sequence or alphanumeric characters... a `string`.

It might not make any sense to do the following;

```javascript
//Print '123' to the screen
print(123);

//Print this object to the screen
print({message: "abc" });
```

The result of calling the function in this matter is unpredictable a best, and at worst could result in an error in your application. By applying the type declaration to the parameter, we can get a warning at compile time that there is a problem.

It is worth mentioning that type declarations are specific to TypeScript, nothing related to the type declaration will be emitted into the final JavaScript. They are a compile time hint.

#### Type declarations everywhere

Type declarations are not just limited to function parameters. You can include them on properties, fields, and the return value for a function too!

There are other places, like [Type Declaration files](http://www.typescriptlang.org/Handbook#writing-dts-files), but that is out of the scope of this post.

#### The 'any' type

Sometimes, a type isn't known until runtime. In situations where type isn't known, you could use the `any` type;

```typescript
print(message: any) : string { }
```

This tells TSC that type is "unknown" and that static analysis is not required or appropriate.

### Classes and Modules

By default, TypeScript does not use any sort of Asynchronous Module Defition (AMD) pattern. You may be familiar with [RequireJS](http://requirejs.org/) et al, but the default pattern is the IIFE pattern (you can change this if necessary).

Modules help with code organisation and reduce global scope pollution. Take the following code;

```typescript
module Printing {
    class Printer {
        constructor(private startingValue: number) {

        }
        print(message: string): string {
            //Do something

            return "";
        }
    }
}
```

TypeScript will generate a root object, named `Printing`. This object **will** be added to the global scope. This is the module, and you can have as many modules in your application as you like.

Anything nested inside a module will be added to it as an object. So in this case, the `Printer` object will be added to the `Printing` object. This is great because now only 1 object has been added to the global scope, instead of two (reducing conflicts with your code and other external dependencies).

### Constructors

Constructors are a feature of ES6, called when an object is instantiated. You can include your set up logic here for the specific instance. You can also pass values to the constructor and get full IntelliSense support;

```typescript
module Printing {
    class Printer {
        private startingValue: number;

        constructor(startingValue : number) {
            this.startingValue = startingValue;
        }
    }
}
```

#### Understanding constructor parameters

Constructor parameters are slightly different compared to other programming languages. In the above example, we have a private field named `startingValue`, and we set it's value to whatever the value of the `startingValue` constructor parameter is;

```typescript
this.startingValue = startingValue
```

This is unnecessary in TypeScript... TypeScript provides some syntactic sugar to sweeten this up.

The following code is valid TypeScript;

```typescript
module Printing {
    class Printer {
        constructor(private startingValue : number) {

        }
    }
}
```

This is valid because under the hood TypeScript created a variable on the class with the name `startingValue` inside the constructor and assigned the value automatically. Unless you explicitly apply an access modifier to the parameter, it is `public`. You can add the `private` access modified to make that parameter only accessible with the class itself and not externally.

## Summary

TypeScript is a tool that enables developers to write more robust, scalable, maintainable, team friendly JavaScript code. Large JavaScript applications tend to descend into a spaghetti, landmine-ridden battlefield that can only be maintained by a single developer who understands all the moving parts. With TypeScript, those days are over. Getting started with TypeScript is as simple as renaming a file, sprinkling on a few type annotations, and reaching out to **tsc** via the command-line or using your editor of choice (on the operating system of your choice!).