---
layout: post
title: TypeScript Tips and Tricks
description: The TypeScript compiler is flexible and configurable and has a wealth of flags that can be passed to it to change the transpiled output.
date: 2015-08-28
categories: ["TypeScript"]
featuredImage: ''
---

## Automatically compile TypeScript files when using VS Code

If you're writing TypeScript using Visual Studio, your files are automatically compiled when you save (assuming you haven't turned this off...the feature is found in the **Project Properties** > **TypeScript Build** screen). If you don't use Visual Studio, and instead are using a lightweight IDE such as [VS Code](https://code.visualstudio.com/) or [Sublime Text](https://github.com/Microsoft/TypeScript-Sublime-Plugin), you don't get this feature.

### Manual compilation

First things first, how would you normally compile a TypeScript file to JavaScript? VS Code doesn't do this out of the box (perhaps the will add this functionality in the future, I'm not sure). You use a [task runner](https://code.visualstudio.com/docs/tasks). To configure a task runner, open your project that has some TypeScript files, and press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>. A little notification to appear that tells you that no task runner is configured. Click **Configure Task Runner**. VS Code will create a directory called **.settings** and add a new JSON file called **tasks.json** to this directory. Open **tasks.json** and inspect the default configuration (the one that isn't commented out, VS Code will show you some other sample configurations that are commented out. Look for the following line;

```json
"args": ["HelloWorld.ts"]
```

Change this path to point at a TypeScript file in your project. Save changes. Now open your TypeScript file, and open in it in side by side view. Put the TypeScript file (.ts) on the left, and put the compiled JavaScript code (.js) on the right. Make a change your TypeScript file and press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> again. You should see the updated JavaScript file.

### Automatic compilation

Having to press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> every time you want to compile your TypeScript files gets really old, really fast. Lets say to make a change, you refresh your browser and the change hasn't been applied. You open the dev tools, start debugging, and hang on...where is your code? Oh right yeah, you forgot to run the task runner. Rinse and repeat. Instead of using a task runner to call the TypeScript compiler (tsc.exe), we can instead make tsc work for us, using the **-w** flag, called the watch flag.

#### Wrong Way

My first thoughts when trying to get this to work were to pass the **-w** flag to tsc using VS Code. Try opening **tasks.json** and changing the `args` option as follows;

```json
"args": ["-w", "test.ts"],
```

Yeah that doesn't work (even though other sample configurations shown in the same file pass commands to tsc in this manner).

#### Right Way

The best way to do this is via the command line. Open a **Node.js command prompt** window, and change directory (cd) to your project folder. Now run the following command;

<pre>tsc -w</pre>

This will listen for changes in the given directory, and all sub directories. Whenever a change is made, the file will be recompiled automatically. So now, pressing <kbd>Ctrl</kbd>+<kbd>S</kbd> on the keyboard will cause the file to be recompiled. We're almost there. If you want the file to automatically compile pretty much as you type (not quite that frequently, but almost as good), you can enable Auto Save in VS Code. Click **File** > **Auto Save** to turn it on. Success! All your TypeScript files will be automatically saved and compiled as your work on them, with no keyboard presses needed. I mentioned Sublime text at the beginning of this tip, because of course this isn't a VS Code specific feature. You can easily enable this regardless of the editor you are using.

## Source maps

Source maps are are means of rebuilding compiled and minified code back to its original state. When you write TypeScript, it is transpiled to JavaScript and can be minified to reduce bandwidth costs and improve page load times. This process, however, makes debugging virtually impossible due to the fact that all variable names are changed, all white-space and comments are removed etc. Browsers use source maps to translate this code back into its original state, enabling you to debug TypeScript code straight from the dev tools. Pretty neat huh?! Modern browsers (IE10, Chrome, Firefox) enable source maps by default. However, I have on many occasions encountered errors and inconsistencies when using source maps, [and it is not just me](https://www.google.co.uk/search?q=source+maps+are+wrong&oq=source+maps+are+wrong&aqs=chrome..69i57.2823j0j7&sourceid=chrome&es_sm=93&ie=UTF-8) who is encountering these issues. The dev tools might tell me, for example, the wrong value for `this`. TypeScript captures the value of `this` in a local variable, so that, in theory, you're always using the right `this` (it typically captures the instance of the class itself). Often, however, dev tools will incorrectly tell me that `this` is an instance of `window`... rendering the debugger useless.

### How to turn source maps off

There are a couple of ways to approach this.

#### Stop generating source maps

TypeScript is generating the source maps for you. If you are using Visual Studio, you can stop generating source maps by going to **Project Properties** > **TypeScript Build** and un-checking **Generate Source Maps**. Be sure to rebuild your project. For everybody else, you simply don't pass in the **--sourcemap** argument to tsc.

#### Disable source maps in the browser

Modern browsers have the ability to disable source maps. **Chrome** 1\. Open dev tools 2\. Settings 3\. Sources (middle column) 4\. Enable JavaScript source maps **Firefox** 1\. Open dev tools 2\. Debugger 3\. Settings 4\. Un-tick "Show Original Sources"

## Combine output in a single file

There are a bunch of tools available to take care of bundling and minification of JavaScript files. You've probably used either [ASP .NET Bundling & Minification](http://www.asp.net/mvc/overview/performance/bundling-and-minification), [Web Essentials bundler](http://vswebessentials.com/features/bundling), [Uglify](https://github.com/mishoo/UglifyJS) or something similar. These tools generally work well and I've only experienced minor problems with each tool. (The ASP .NET bundler is a bit more troublesome than most, to be fair). When using a task runner such as Grunt or Gulp, you pass in an array of all the file paths you want to include in the bundle. [Example](https://github.com/gruntjs/grunt-contrib-uglify#basic-compression);

```json
files: {
  'dest/output.min.js': ['src/input.js']
}
```

Generally I don't take this approach of passing in individual files, I prefer to pass in a recursive path, perhaps something like this;

<pre>"**/*.ts"</pre>

That aside, if you prefer to include your files individually in Grunt/GulpFile, TypeScript can help you out by combining all the compiled JavaScript into a single file.

### Using Visual Studio

If you're using Visual Studio, there is a simple user interface to set this up. Right click your project and select **Project Properties** > **TypeScript Build**. Under the **Output** header, there are two options of interest;

1.  **Combine JavaScript output into file:** - Name of the file to put the merged JavaScript.
2.  **Redirect JavaScript output to directory:** - The folder in which to put the merged file.

Typically you would use these two in conjunction with each other. You can then modify your Grunt/GulpFile to point at the merged file, rather than all your un-merged JavaScript files.

### Via command prompt

The flags you need are as follows;

<pre>--out FILENAME
    --outDir DIRECTORYPATH
</pre>

## Available from version 1.5

Version 1.5 of the TypeScript compiler (version 1.5.3 to be precise, use the **-v** flag to check you aren't using **1.5.0 beta**) adds a few additional features of some use (this is not an exhaustive list);

### -m KIND or --module KIND

Ok this isn't new, but TypeScript 1.5 has added support for **UMD** and **System**, so you can now pass the name through to use that module system. There is an updated UI in Visual Studio 2015 RTM for this feature.

### --noEmitOnError

Doesn't generate any JS files if any compile time errors are detected. You might want to turn this off if you want to ignore certain errors (like, incorrect or incomplete type declaration file).

### --preserveConstEnums

The default behaviour in past versions of tsc was to remove enumerations and replace them with te actual value of the enumeration. So if your enum was;

```typescript
enum DaysOfWeek{
    Monday,
    Tuesday
    ...
}

...

console.log(DayOfWeek.Monday)
```

The transpiled output would be;

```typescript
console.log(0 /*Monday*/)
```

Passing the `--preserveConstEnums` flag prevents this transformation from taking place, so the original code stays in act.

## Summary

The TypeScript compiler is flexible and configurable and has a wealth of flags that can be passed to it to change the transpiled output. Using Node.js tools, you can easily have your TS files automatically transpiled, you can have source maps for a better debugging experience, and you can have all the transpiled TS files merged into a single file for easier uglification. I'll update this post with new tips and tricks as I come across them. If you ave any good ones, let me know in the comments or get me on [Twitter](http://www.twitter.com/jpreecedev), and I'll update the post accordingly. If you're interested in learning about all the different [compiler flags that TypeScript accepts, you can find them in GitHub](https://github.com/microsoft/typescript/wiki/Compiler%20Options).
