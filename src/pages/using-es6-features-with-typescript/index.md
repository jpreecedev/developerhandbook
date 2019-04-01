---
layout: post
title: Using ES6 features with TypeScript
description: TypeScript is a transpiler, this allows you to utilize ES6 features today and have them transpiled into ES5, which is fully compatible with legacy browsers
date: 2015-09-18
categories: ['TypeScript']
featuredImage: ''
---

## TypeScript is a transpiler

The TypeScript compiler converts your code from TypeScript, which is a subset of JavaScript, to TypeScript.

### Compiler vs. Transpiler

There is some confusion about the difference between a compiler and a transpiler. A compiler takes your code and turns it into something very different, a whole new language. A good example is with a high level language such as C# or Visual Basic. When you write code and build it, the compiler (either csc.exe [C# compiler] or vbc.exe [Visual Basic compiler] in this case) takes your code and turns it into Intermediate Language (IL). Example C# code;

```csharp
private static void Main(string[] args)
{
    Console.WriteLine("Hello, World!");
}
```

And the compiled code (as seen using ILDasm.exe);

```csharp
.method private hidebysig static void  Main(string[] args) cil managed
{
  .entrypoint
  // Code size       13 (0xd)
  .maxstack  8
  IL_0000:  nop
  IL_0001:  ldstr      "Hello, World!"
  IL_0006:  call       void [mscorlib]System.Console::WriteLine(string)
  IL_000b:  nop
  IL_000c:  ret
} // end of method Program::Main
```

The above code is certainly not C#. The C# has been changed into a whole new language. A transpiler takes your code and changes it. But it's still in the same language that you started out with. TypeScript is JavaScript, infact, TypeScript is a subset of JavaScript. When the TypeScript compiler runs over your code, it reads in TypeScript (which is JavaScript) and outputs JavaScript. The end resulting language is the same as what you started out with. The following TypeScript code is completely valid;

```javascript
;(function() {
  console.log('Hello, World!')
})
```

And the resulting transpiled JavaScript code;

```javascript
;(function() {
  console.log('Hello, World!')
})
```

Its the same! This is an oversimplification, but the point is correct. Take the following example, which uses classes (a feature of ECMAScript 6);

```javascript
'use strict'
class Hello {
  constructor() {
    console.log('Hello, World!')
  }
}
var hello = new Hello()
```

And the resulting JavaScript transpiled code;

```javascript
'use strict'
var Hello = (function() {
  function Hello() {
    console.log('Hello, World!')
  }
  return Hello
})()
var hello = new Hello()
```

The TypeScript compiler has taken your ECMAScript 6, and converted it to use the [IFFE pattern](http://benalman.com/news/2010/11/immediately-invoked-function-expression/), which is a pattern well supported in all browsers. By the way, the original class based code shown above is perfectly valid ES6 code. You can drop the code into a JS file and load it into your browser and it will work, but [ES6 is not as widely supported as ES5](https://kangax.github.io/compat-table/es6/) at this time.

## TypeScript < 1.5 - Useful ES6 transformations

There are many new features in ECMAScript 6 (ES6) as described in this [very good write-up](https://github.com/lukehoban/es6features) by Luke Hoban on GitHub. I've narrowed it down for you to what I think are the most useful and common transformations that you can use right now. **Note**: At the time of writing, not all ES6 features can be transpiled. Promises, for example, require browser support and cannot be transpiled to an ES5 equivalent. I don't expect that trying to fudge in functionality into a browser will ever become a feature of TypeScript, this is something that is best left to a [polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill).

### Template strings

Arguably the simplest transformation that TypeScript offers, template strings are simply a way of using variables as part of a string. Template strings use back-ticks `` to denote that a string contains variables. Usage;

```javascript
'use strict'
class Hello {
  constructor() {
    var hello = 'Hello'
    var world = 'World'

    console.log(`${hello}, ${world}!`)
  }
}
var hello = new Hello()
```

and the transpiled output;

```javascript
'use strict'
var Hello = (function() {
  function Hello() {
    var hello = 'Hello'
    var world = 'World'
    console.log('' + hello + ', ' + world + '!')
  }
  return Hello
})()
var hello = new Hello()
```

At compile time, TypeScript replaces all template strings with simpler string concatenation (which has been around forever!). So you get the niceness of easier to read code without losing the cross browser support. Personally, I didn't exactly like this syntax at first, and at the time of writing some JavaScript linters get confused by the lack of spaces around variable names (Web Essentials, I'm looking at you!). But generally this syntax is clean and relatively easy to read.

### Classes

We've touched on classes several times already at this point, and if you have done any object oriented programming at all there's no doubt you have already stumbled across classes. Classes are simply containers, they contain information about the functionality the object (an instantiated class) such as methods, members etc. In TypeScript/JavaScript, classes are no different. Usage;

```typescript
'use strict'
class Hello {
  public id: number
  private arbitraryValue: boolean

  constructor() {
    this.id = 42
    this.arbitraryValue = true
    this.sayHello()
    this.saySomething('Goodbye, world!')
  }
  sayHello(): void {
    console.log('Hello, World!')
  }
  saySomething(message: string): void {
    console.log(message)
  }
}
var hello = new Hello()
```

and the transpiled output;

```javascript
'use strict'
var Hello = (function() {
  function Hello() {
    this.id = 42
    this.arbitraryValue = true
    this.sayHello()
    this.saySomething('Goodbye, world!')
  }
  Hello.prototype.sayHello = function() {
    console.log('Hello, World!')
  }
  Hello.prototype.saySomething = function(message) {
    console.log(message)
  }
  return Hello
})()
var hello = new Hello()
```

You can use the following access modifiers to state the accessibility of your methods and variables;

* public
* protected
* private

Note that these access modifiers are only used at compile time, and don't affect the transpiled JavaScript.

### Arrow functions

Also known as "Fat arrow functions", because of the use of the equals operator (=>), are inline functions, similar to lambda expressions in C# and Java. Usage;

```typescript
'use strict'
class Hello {
  constructor() {
    var sayHello = () => console.log('Hello, World!')
    var saySomething = (what: string) => console.log(what)

    sayHello()
    saySomething('Goodbye, world!')
  }
}
var hello = new Hello()
```

and the transpiled output;

```javascript
'use strict'
var Hello = (function() {
  function Hello() {
    var sayHello = function() {
      return console.log('Hello, World!')
    }
    var saySomething = function(what) {
      return console.log(what)
    }
    sayHello()
    saySomething('Goodbye, world!')
  }
  return Hello
})()
var hello = new Hello()
```

Arrow functions in TypeScript allow you to write cleaner, more reusable code without having a bunch of ugly inline functions staring at you.

## TypeScript >= 1.5 - Useful ES6 transformations

TypeScript version 1.5 adds support for additional transformations (some of which are shown below). You have to have version 1.5+ installed to take advantage of these features.

### "for...of" operator

The concept of a `for...of` loop is pretty simple. You have an array of objects, and you want to iterate through each item in the array. With a `for...of` loop you can also `break` and `continue` in the same way as you could with a standard `for` loop. A `for...of` loop, putting aside [small differences in performance when dealing with large arrays](https://jsperf.com/fastest-array-loops-in-javascript/24) (and having to increment a counter to keep the position in the array), is effectively syntactical sugar. And as such, a browser has to have native support for it. TypeScript, however, transforms a `for...of` loop to a standard ES5 `for` loop; Usage;

```javascript
'use strict'
class Hello {
  constructor() {
    var a = ['a', 'b', 'c']
    for (var n of a) {
      console.log(n)
    }
  }
}
var hello = new Hello()
```

and the transpiled output;

```javascript
'use strict'
var Hello = (function() {
  function Hello() {
    var a = ['a', 'b', 'c']
    for (var _i = 0; _i < a.length; _i++) {
      var n = a[_i]
      console.log(n)
    }
  }
  return Hello
})()
var hello = new Hello()
```

### let

`let` in ES6 is a scope version of `var`. In a nutshell, `var` is function scoped and `let` scoped to the enclosing block. There are already lots of good write ups that describe the ins and outs of `let` vs `scope`, an especially good one can be found on the [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let]). The following code, due to the way that closures work in ES5, is valid;

```javascript
'use strict'
var Hello = (function() {
  function Hello() {
    var array = ['a', 'b', 'c', 'd']
    for (var index = 0; index < array.length; index++) {
      var element = array[index]
      console.log(element)
    }
    index = 0
  }
  return Hello
})()
var hello = new Hello()
```

The `index` variable is scoped to the function, not the block. Changing `var index` to `let index` results in the `index` variable only being accessible inside the block. The following code is invalid;

```javascript
'use strict'
class Hello {
  constructor() {
    var array = ['a', 'b', 'c', 'd']
    for (let index = 0; index < array.length; index++) {
      var element = array[index]
      console.log(element)
    }
    index = 0
  }
}
var hello = new Hello()
```

TypeScript allows you to use the `let` keyword and get all the compile time checking that comes with the feature, whilst maintaining support for older browsers by simply replacing all usages of `let` with `var`. The code shown above transpiles to the following;

```javascript
'use strict'
var Hello = (function() {
  function Hello() {
    var array = ['a', 'b', 'c', 'd']
    for (var index = 0; index < array.length; index++) {
      var element = array[index]
      console.log(element)
    }
    index = 0
  }
  return Hello
})()
var hello = new Hello()
```

### const

Constants in ES6 are the same concept as in most other programming languages. Traditionally you define a variable using the `var` keyword. Its value can be read and written at any time. Also, as we're talking JavaScript (a dynamic language), the type can also be changed at runtime. For example, the following code is perfectly valid JavaScript;

```javascript
'use strict'
class Hello {
  constructor() {
    var a = 'Hello!'
    console.log(a) //Writes 'Hello!'
    a = 123
    console.log(a) //Writes 123
  }
}
var hello = new Hello()
```

A constant in ES6 allows you to set a value and know that value cannot be changed. Take the following code;

```javascript
'use strict'
class Hello {
  constructor() {
    const a = 'Hello!'
    console.log(a) //Writes 'Hello!'
    a = 'World!'
    console.log(a)
  }
}
var hello = new Hello()
```

Running this code results in a runtime error (in Chrome and Firefox, which support the construct);

<pre>Uncaught TypeError: Assignment to constant variable.</pre>

As `const` is a native ES6 feature, the ES5 fallback is simply to use a var. This is the transformation TypeScript applies to your code;

```javascript
'use strict'
var Hello = (function() {
  function Hello() {
    var a = 'Hello!'
    console.log(a) //Writes 'Hello!'
    a = 'World!'
    console.log(a)
  }
  return Hello
})()
var hello = new Hello()
```

### Enhanced object literals

More syntactic sugar in the ES6 standard, and this one is especially sweet. Instead of having to define your objects using key value pairs, you can now use a more concise syntax. Classic ES5 code;

```javascript
var firstName = 'Jon'
var lastName = 'Preece'
var person = {
  firstName: firstName,
  lastName: lastName,
  speak: function(what) {
    console.log(firstName + ' ' + lastName + " said '" + what + "'")
  }
}
```

You define a couple of variables/functions etc and create an object using keys for property names and values for the value of that property. Functions were also expressed using the `function` keyword. The enhanced object literal syntax in ES6 allows you to define keys/values in a single pass;

```javascript
var firstName = 'Jon'
var lastName = 'Preece'
var person = {
  firstName,
  lastName,
  speak(what) {
    console.log(firstName + ' ' + lastName + " said '" + what + "'")
  }
}
```

And as you might expect, TypeScript transforms this into the long form ES5 format shown above. (Class ES5 code).

## Summary

TypeScript is a transpiler, not to be confused with a compiler. A transpiler takes your code and converts it into a similar format, typically the same language you are working in (in this case, JavaScript). A compiler takes your code and converts it into something completely different (think C# to IL for example). TypeScript allows you to utilize new language features that are appearing in newer revisions of the ECMAScript standard (6 at the time of writing) and have them transpiled into a form that is widely supported across browsers (ES5 in this case). Today you can take full advantage of Template String, Classes, Arrow functions, the 'for...of' loop, let + const, enhanced object literals, and more without having to worry if they will work in legacy browsers.
