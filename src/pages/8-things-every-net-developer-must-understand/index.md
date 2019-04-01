---
layout: post
title: 8 things every .NET developer must understand
description: After interviewing a lot recently, I've found that some employers are asking the same questions. Here are 8 things every .NET developer must understand.
date: 2014-09-19
categories: ["Career"]
featuredImage: ''
---

You've been in your current job for a while now, and you're really starting to get good at what you do. You're perhaps thinking about finding something new, and you're wondering what sort of questions a potential new employer might ask. I've been interviewing a lot recently and I have noticed there are 8 questions that get asked a lot. Spend some time and make sure that you understand each point in turn, doing so will help make that dream job become a reality.

## SOLID Principals

The ultimate acronym of acronyms. You've heard of it, but do you know what it stands for? Do you really understand what each principal means? Yeah thought so. This awesome video by Derick Bailey will clear things up a lot for you;

<iframe width="560" height="315" src="https://www.youtube.com/embed/TAVn7s-kO9o" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Garbage Collection & IDisposable

One of the best features of developing with any .NET language is the lack of effort you have to put in to garbage collection. You generally don't have to care too much about 1st/2nd/3rd gen collection cycles, de-allocating memory or anything like that. Its still a very important topic, however, and every .NET developer should understand how it works. Once you become a more experienced developer (and I'm _especially_ talking to WPF developers here) you quickly learn that memory management isn't a forgotten topic. Failure to unsubscribe from events, failure to close streams, and keeping hold of large objects (say instantiating them in a loop that never ends) is a sure-fire way to balloon up your apps memory usage eventually resulting in a crash (commonly referred to as Memory Leaks). A useful way of ensuring that managed resources are correctly cleaned up in a timely manner is to implement the IDisposable interface (and actually use it within a using block) on your objects. Make sure you understand how this works how to implement it. Example:

```csharp
private Boolean disposed;
protected virtual void Dispose(Boolean disposing) {
  if (disposed) {
   return;
  }
  if (disposing) {
   //TODO: Managed cleanup code here, while managed refs still valid }
   //TODO: Unmanaged cleanup code here disposed = true; }
   public void Dispose() {
    Dispose(true);
    GC.SuppressFinalize(this);
   }
   ~Program() {
    Dispose(false);
   }
```

Code snippet taken from [SideWaffle](http://sidewaffle.com/). Its not enough to simply implement IDisposable, you have to take it a step further by adding a second Dispose method to ensure that both managed and unmanaged resources are properly disposed.

**Useful resources:** [Three Common Causes of Memory Leaks in Managed Applications](http://blogs.msdn.com/b/davidklinems/archive/2005/11/16/493580.aspx) (DavidKlineMS) [Garbage Collector Basics and Performance Hints](http://msdn.microsoft.com/en-us/library/ms973837.aspx) (MSDN) **[Writing High-Performance .NET Code](http://amzn.to/1uH0TMx)** (Ben Watson)

## Explain why you might use MVC over WebForms?

Another curve ball that employers might throw at you is "Why might you decide to use ASP .NET MVC over something like WebForms". I stuttered for a good 30 seconds before I eventually came up with a decent answer to this one, because simply saying "because MVC is better" is not a good enough argument. Here are some things that come to mind;

* MVC generates much simpler HTML code, which will be easier to style and maintain over time.
* MVC arguably has a smaller learning curve, because Razor is very intuitive and developers get to reuse their existing knowledge of HTML/CSS without having to learn how specific user controls work.
* Due to MVC's simplified page lifecycle, overhead on the server is reduced potentially resulting in better performance.

There is endless argument about this on the web ([the only example you need](http://programmers.stackexchange.com/questions/95212/when-to-favor-asp-net-webforms-over-mvc)). I think in reality the employer is trying to establish two things here;

* How well do you know your frameworks
* **But more importantly**, can you assess the benefits and drawbacks of different frameworks and make an informed, unbiased decision regarding which one to use. I.e. don't just use it because everybody else is.

## No-SQL databases

If you think that SQL server is the be-all-and-end-all, then its time to wake up! Its the year 2014 and the tech world has moved on. I'm not suggesting for a second that companies are abandoning SQL Server, I believe that it will continue to play a major role in our industry for at least the next 5 years. However, No-SQL databases are gaining massive traction because of their general speed, ease of use, and scalability benefits (not to mention the fact that SQL Server is [very expensive](http://msdn.microsoft.com/en-us/library/dn305848.aspx), whereas RavenDB and MongoDB are much more affordable). I'd recommend that you look at, and understand, each of the following;

* [RavenDB](http://ravendb.net/docs/article-page/2.5/csharp/intro/quickstart)
* [MongoDB](http://docs.mongodb.org/manual/core/introduction/)
* [Windows Azure Blob Storage](http://docs.mongodb.org/manual/core/introduction/)

## Boxing and Un-boxing

It simply amazes me just how many developers don't understand boxing and un-boxing. Granted, its been less of an issue since [generics was introduced in .NET 2.0](<http://msdn.microsoft.com/en-us/library/ms379564(v=vs.80).aspx>) but done wrong, your application's performance and memory usage will be seriously affected. **Useful resources:**

* [Six important .NET concepts: Stack, heap, value types, reference types, boxing and unboxing](http://www.codeproject.com/Articles/76153/Six-important-NET-concepts-Stack-heap-value-types) (Shivprasad Koirala)
* [Boxing and Unboxing](http://msdn.microsoft.com/en-GB/library/yz2be5wk.aspx) (MSDN)

Also note, when a prospective employer asks you to explain this problem, they may also ask you to explain the difference between reference types and value types. Reference types of course are classes, whereas value types are structs. A value type can be thought of as the actual value of an object, whereas a reference type typically contains the address of the actual value, or null (value types are not nullable).

## Hoisting and Closures

Developers now are required to have a broader range of skills than has typically been the case. Its usually not enough to have just SQL and C# on your CV, employers are increasingly looking for more well rounded developers, with a range of skills including (but not limited to); HTML, CSS, JavaScript, KnockoutJS, TDD, AngularJS and so on. You may never have realised it, but when writing JavaScript code variable scope is not exactly black and white. Take the following example ([pinched and adapted from here](http://www.w3schools.com/js/js_hoisting.asp))

```javascript
;(function() {
  x = 5
  alert(x)
  var x
})()
```

What is the value of x? No tricks here, the answer is of course 5, but why does this work? Because the variable declaration is pulled (hoisted) to the top of the current scope. So regardless of where you declare your variables inside a function, they will always be hoisted to the top. Be sure that you understand this, as its a basic concept but often misunderstood. Similarly, closures are another confusing concept of JavaScript that you may be asked about. In the simplest terms, when you have a function inside another function, the inner function has access to any declared variables in the outer function. Example:

```javascript
;(function() {
  var x = 'Hello'
  var f = function() {
    alert(x + ', World!')
  }
  f()
})()
```

What is the result? **Hello, World!** of course, again no tricks. The code in the inner function always has access to variables declared in the outer function. That explanation should pass the Albert Einstein test.

> If you can't explain it to a six year old, you don't understand it yourself.

## Is a string a reference type or a value type?

The one I used to dread the most, until I learnt it properly and understood it. A **string is a reference type**, but it behaves like a value type! Unlike most other reference types, a string is immutable, meaning that the object itself cannot be changed. When you call a method such as Remove or Substring, you are creating a copy of the string with the new value. The original string remains intact until it is de-referenced. The primary reason for this is because the size of strings means that they are too big to be allocated on the stack. As a side note, take the following code;

```csharp
string c = "hello";
string d = "hello";
Console.WriteLine(c == d);
```

Why is the result **true**? Well this is a .NET optimization to reduce the memory footprint. Under the hood each variable has the same pointer (0x021x15ec in this case) to the actual value. You should always use **String.Equals** when comparing strings to ensure that the actual value of each string is equality checked, instead of the pointer.

## Summary

We looked at 8 concepts that every decent .NET developer should understand, especially when interview for a new role. Whilst these may seem like simple concepts, they are often misunderstood and this will quickly be picked up by even the most inexperienced interviewer. It's important for .NET developers to know their language and their tools inside out to ensure that they have every chance of landing that next dream job.
