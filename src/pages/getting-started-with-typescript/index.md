---
layout: post
title: Getting started with TypeScript
date: 2015-09-11
categories: ["TypeScript"]
tags: ["TypeScript","typescript"]
---

This is the 101 tutorial which describes getting started with TypeScript using either the [TypeScript Playground](http://www.typescriptlang.org/Playground), [Node.js](https://nodejs.org/) or [VS Code](https://code.visualstudio.com). At its simplest, TypeScript is a programming language that provides optional static typing for JavaScript.  TypeScript is JavaScript.  Any valid JavaScript is valid TypeScript.  The beauty of TypeScript is that you can define types for your JavaScript variables and functions, and get compile time error checking and error reporting.  This tutorial focuses on getting started with TypeScript and demostrates the basics to get up and running quickly.

## TypeScript Playground

The quickest, easiest way to get started with using TypeScript is to experiment with the [TypeScript playground](http://www.typescriptlang.org/Playground/).  The TypeScript playground enables you to write TypeScript code in the browser, and see the resulting compiled JavaScript alongside. First things first, TypeScript doesn't try to force you to write code in a particular style.  In fact, you can write 100% pure JavaScript code in get the same code out at the other end. Try entering the following code in the TypeScript pane on the left;

    (function(){
    	console.log("Hello, world!");
    })()

See the output?  Identical.  You can take advantage of TypeScript is much or as little as you please. Refactor the code a little bit, introducing a log function as follows;

    (function () {

    	function log(message: string) {
    		console.log(message);
    	}

    	log("Hello, World!");

    })();

Click the "Run" button on the top-right hand side and press <kbd>F12</kbd> to bring up the developer tools in your browser. Click on the "Console" tab and you should see the message "Hello, World!". [![Hello World!](http://www.typescriptguy.com/wp-content/uploads/2015/07/HelloWorld.png)](HelloWorld.png) What happened? Well, not a lot (or so you might think!).  Take a look at the compiled JavaScript code;

    (function () {
        function log(message) {
            console.log(message);
        }
        log("Hello, World!");
    })();

JavaScript is a dynamic language, it has no concept of types (that's what TypeScript provides!).  TypeScript uses the type information to catch coding errors at compile time and provide other IDE functionality.  TypeScript generates 100% vanilla JavaScript code that is fully cross browser/cross operating system compatible.  By default, TypeScript will generate ECMAScript 5 (ES5) compliant code, although at the time of writing it is possible to generate ES3 and ES6 code too (and no doubt support will be added for ESx on a yearly basis). Change the code as follows (changing the log message from a string to a number); [![TypeScript Compile Time Behaviour](http://www.typescriptguy.com/wp-content/uploads/2015/07/CompileTimeBehaviour.png)](CompileTimeBehaviour.png) Three very interesting things have happened here, and this is the perfect demonstration of the general attitude of TypeScript. Looking at the red arrows, in order from left to right

1.  You get compile time checking.  TypeScript recognizes that you have supplied a value to the **log** method that is not a string, and highlights the erroneous code to you.
2.  You get a detailed error message that explains in simple terms what the error was, and the type of value that the calling method was expecting (this is typical behaviour regardless of the complexity of code you are writing).
3.  The JavaScript code is generated regardless of these compile time errors.  TypeScript does not force you to adhere to its paradigm.

## Node.js

You might be surprised to see Node mentioned on this page.  TypeScript is a Microsoft product right? Traditionally tools like this might have been constrained to Microsoft IDE's or operating systems, but today's modern Microsoft is moving away from that traditional stance and moving towards being more open. TypeScript is not only completely free, open source, cross browser, cross operating system, but it is also community driven and [actively accepts pull requests directly from community members](https://github.com/Microsoft/TypeScript).  In fact, the tooling is so good that its becoming widely adopted in many IDE's including (but not limited to);

*   [PhpStorm](https://www.jetbrains.com/phpstorm/help/typescript-support.html), [WebStorm](https://www.jetbrains.com/webstorm/help/typescript-support.html)
*   [Atom](https://atom.io/packages/atom-typescript)
*   [Cloud9 IDE](https://github.com/lennartcl/cloud9-typescript)
*   [Eclipse](https://github.com/palantir/eclipse-typescript)
*   [Sublime Text](https://github.com/Microsoft/TypeScript-Sublime-Plugin)
*   Visual Studio 2012/13/15
*   [VS Code](https://code.visualstudio.com/)

If you already have Node and Node Package Manager (npm) installed, open a **Node.js command prompt** and enter the following command to globally install TypeScript;

<pre>npm install -g typescript</pre>

This will install the TypeScript compiler onto your machine and into your PATH environment variable so you can call it directly.  Change directory to your desktop, and create a file called **helloworld.ts**.  Add the following code;

    (function () {

    	function log(message: string) {
    		console.log(message);
    	}

    	log("Hello, World!");

    })();

Now enter the following command;

<pre>tsc -w helloworld.ts</pre>

The **watch** flag (denoted by the -w) tells the TypeScript compiler to watch your file.  Meaning that, if you make some edits and save your changes, TypeScript will automatically recompile the file for you each time. Open the helloworld.ts file in Notepad, make a small change, save the file.  You should notice the JS gets updated automatically. [![TypeScript compilation completed](http://www.typescriptguy.com/wp-content/uploads/2015/07/CompilationCompleted.png)](CompilationCompleted.png)

## VS Code

VS Code, at the time of writing at least (they may or may not streamline this process in the future), requires a little more leg work to get TS files to compile (almost) automatically.  You can find a more [comprehensive tutorial over on MSDN](http://blogs.msdn.com/b/typescript/archive/2015/04/30/using-typescript-in-visual-studio-code.aspx), but this is how you get up and running quickly;

*   Create a new folder on your desktop and create a new file called helloworld.ts (or use the one you created for the Node.js part of this tutorial).
*   Add the code shown above, named **Log function with string type definition.**
*   Open VS Code, click **File > Open Folder...** and point to the new folder you just created.
*   Add a new file called **tsconfig.json**, and add the following;

    {
        "compilerOptions": {
        "target": "ES5"
        }
    }

Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> on your keyboard.  This would normally kick off the task runner built into VS code.  However, we haven't configured the task runner yet, so a small toolbar will appear at the top telling us there is no task runner configured.  There is a handy button on the right that says "Configure Task Runner".  Click the button. [![Configure VS Code Task Runner](http://www.typescriptguy.com/wp-content/uploads/2015/07/ConfigureTaskRunner.png)](ConfigureTaskRunner.png) VS Code will now generate a bunch of TypeScript specific configuration for us.  This will be covered in detail in a future post.  For now, however, just accept that TypeScript is ready to go. Switch back to your **helloworld.ts** file, click Save and open the equivalent JavaScript file (helloworld.js).  You  should see the compiled output.  It can be helpful to put the two files side by side you that you can see the updated changes every time you click Save. [![Side By Side View](http://www.typescriptguy.com/wp-content/uploads/2015/07/SideBySide.png)](SideBySide.png)

## Wait, there's more!  TypeScript is a transpiler too...

A transpiler is a method of converting code from one language to another.  So what does this mean for us? TypeScript allows us to utilize more modern language constructs, which will be transpiled into a more widely supported form.  The simplest example is [string interpolation](http://tc39wiki.calculist.org/es6/template-strings/) (also known as template strings), which is a feature of the ECMAScript 6 (ES6) standard. Take the following ES6 code (1 - String Interpolation - template strings);

    (function () {

    	var hello = "Hello";
    	var world = "World";

    	var message = `${hello}, ${world}!`;

    	console.log(message);

    })();

    (function () {
        var hello = "Hello";
        var world = "World";
        var message = hello + ", " + world + "!";
        console.log(message);
    })();

Template strings are not supported in ES5, they are an ES6 feature only.  TypeScript knows this and automatically converts the code into a ES5 compliant form, the process of which is called Transpiling.  We will discuss this in more depth in future posts.

## Summary

TypeScript is a free, open source, cross-browser, multi-OS tool from Microsoft that enables (but doesn't force) static static typing.  TypeScript generates 100% vanilla JavaScript code that is fully cross browser/cross operating system compatible.  Tooling exists for a wide variety of editors/IDE's include Node, Visual Studio, VS Code, Sublime Text and many more.  As an additional bonus, TypeScript is also a transpiler, meaning you can write code using modern ECMAScript 6 constructs and the resulting code will be ECMAScript 5 compliant.