---
title: What I learnt from using TypeScript "for real"
description: I completed my first commercial Greenfield project using TypeScript over plain old JavaScript throughout, and there were some frustrations along the way.
pubDate: 2015-05-25
categories: ["TypeScript"]
group: "Software Development"
---

I completed my first commercial Greenfield project using TypeScript over plain old JavaScript throughout, and there were some frustrations along the way.

## TL;DR

- TypeScript is awesome, for sure, but there needs to be improvements to tooling to streamline the experience.
- TypeScript is strongly typed of course, but it doesn't force you to code in this manner, which can result in shoddy code.
- Tweaking is required to make bundling work properly.

## Tooling Frustrations

When I started the project, I was using Visual Studio 2012 Update 4 with TypeScript 1.0 pre-installed. I was brought in to work on this project on a short term basis, and this is how the machine was set up when I arrived. Normally I wouldn't choose to use Visual Studio 2012 (I like to use the latest tools where possible) but I decided to just go with it and make do. Once deficiencies in tooling became clear, I did eventually push for an update to Visual Studio 2013 Update 4, which in fairness resolved most of my frustrations. I have a license for JetBrains ReSharper, which has support for TypeScript 1.4 (and indeed that is the default setting when using ReSharper 9). This was actually my first tooling problem. When using Visual Studio 2012, you are using TypeScript 1.0 (unless you have proactively updated to version 1.4). Naturally 1.0 is an older version and doesn't support language features such as protected methods or ECMAScript 6 template strings. ReSharper, however, does understand these features and offers suggestions to use them. Trying to use these features results in build errors, which of course was confusing because I didn't understand that I was actually using version 1.0 at the time (does it say anywhere? not to my knowledge). Also, due to the aforementioned old version of TypeScript, I also encountered an issue with TypeScript definition files.

These files are designed to not only provide IntelliSense in Visual Studio when working with third party libraries such as AngularJS, but also are used during the build process for compile time checking. Because the TypeScript definition files (sourced using NuGet via GitHub) were based on TypeScript 1.4, again hundreds of errors at compile time. Interestingly, however, with version 1.0 it was actually possible to ignore these build errors and still generate the compiled JavaScript files. Only once upgrading to version 1.4 later on did it become mandatory to fix these build issues. Compile on save does what it says on the tin. You write some TypeScript code, click Save, and the JavaScript file is generated automatically. Well, actually, no. There were dozens of occasions when this just didn't work. I had to literally open the scripts folder, delete the JavaScript files manually, re-open Visual Studio, and save the TypeScript file again before it would actually recompile the JavaScript file. This was tedious and boring and didn't seem to be resolved by upgrading to Visual Studio 2013 Update 4 (although it did become less frequent). I have Web Essentials installed, which gives you a side by side view of the TypeScript and JavaScript files which I originally turned off. I did eventually turn this back on so I could see if the files were being recompiled at a glace before refreshing the web browser. On a side note, the tooling provided by Google Chrome developer tools is excellent. You can debug the actual TypeScript source directly in the browser, and if you inadvertently set a breakpoint on a JavaScript file, Chrome will navigate you back to the TypeScript file. Nice.

## Bundling in MVC

The project I was working on used some features of ASP .NET and Web API. One such feature was bundling and minification, which I always use to improve performance and reduce server load. I wrote many based files and interfaces as you would expect, as both are fully supported in TypeScript. However, what I later realised (perhaps I should have realised at the start, but hey) was that order is important. The MVC bundler doesn't care about order, so there's a big problem here. After switching on bundling, I went from 0 runtime errors to at least 20. There are two approaches I could have taken to resolve the problem;

1.  Create two separate bundles, one for base classes, the other for derived classes (I don't care for this)
2.  Create a custom orderer and use naming conventions (prefix base class files with the name "Base") to ensure order.

I went for the latter option. This involved having to rename all my base class files and interfaces (granted interfaces don't actually generate any JavaScript, but I wanted to keep the naming consistent) and writing a custom convention based orderer. Neither of these things were challenging, just time consuming.

## TypeScript is inconsistent

I can only speak from my own experiences here. I don't claim to be a TypeScript or JavaScript master, I'm just a normal developer as experienced as anybody else. I love the strongly typed nature of TypeScript, that's the feature that appeals most to me. I do however have the following qualms;

### TypeScript does not force you to use the language features of TypeScript

This is either a good thing, or a bad thing. I can't decide. To be honest, I wish TypeScript did force you to use its own paradigm. You can easily write pure JavaScript inside a TypeScript file and it will all compile and "just work". This is a bit of a downfall for me because I've always found JavaScript to be frustrating at best (can you think of an application you've written in JavaScript that hasn't eventually descended into mayhem?). What I mean is this, I can create a local variable and assign it a type of Element;

```typescript
var element: Element = angular.element(".myelement")
```

The type constraint is redundant, and ReSharper makes a song and dance about the fact and basically forces you to get rid of it (yeah, I know I could turn this off but at the end of the day ReSharper is right). I can assign function parameters type declarations, but I don't have to. (I did eventually go back in fill these in where I could). I know that I _should_ use type declarations and to be honest I wish I did use this feature more, but I'm lazy. Next time I'll be sure to do this from the start as I think it adds further structure to the code.

### TypeScript doesn't know it all

The project I was developing was built in conjunction with AngularJS. I've had an up-down relationship with AngularJS to say the least, but I decided to fully embrace it this time and not switch between jQuery and Angular (yeah I'm aware that Angular uses jQuery lite under the hood, I'm referring to not switching between using `$()` and `angular.element()`). I made heavy use of Angular Scope and I often had a dozen or more child scopes running on any one page. So as a result, I had lots of code that looked roughly like this;

```javascript
var scope = angular
  .element(".myselector")
  .first()
  .children(".mychildren")
  .scope()
```

That's perfectly valid code. Even though I have already added the appropriate type definition files and referenced appropriate at the top of the file, TypeScript still insists that scope() is not valid in this context and I get a compilation error. So I'd have to exploit the dynamic functionality of JavaScript to get around this;

```javascript
var children = angular.element(".myselector").first().children(".mychildren")
var scope = children.scope()
```

Ok its not a big deal. The scope variable is now of type `any`, so there's no IntelliSense and no compile time checking. But hey, wait, isn't that the main point of using TypeScript in the first place? Now if I pass scope to another function, I'll exacerbate the problem (due to the fact that the parameter will have to be of type `any`) and before you know it, I'm just writing JavaScript again. Fail.

## Positive note

I've ranted about what I don't like about TypeScript, and the frustrations I've encountered so far, but honestly I can't sign its praises enough. I estimate that so far TypeScript has saved me at least 3 million hours of effort. Ok, perhaps a slight exaggeration, but you get the point. Writing TypeScript is easy and familiar because I am comfortable with JavaScript and strongly typed languages such as C#. I did spend perhaps a few hours reading the documentation and experimenting in the excellent TypeScript playground (both of which are excellent by the way), but generally thanks to previous experience with the aforementioned languages, I found that I "just know" TypeScript and it has a very smooth learning curve.

## Summary

TypeScript is awesome, there is no doubt in my mind about that. TypeScript saves all the pain that naturally comes with JavaScript and its only going to get better over time. The tooling issues and inconsistencies are relatively insignificant, once you get used to them.
