---
layout: post
title: Every developer must be proficient at these 7 things...
date: 2015-02-21
categories: ["Career"]
tags: ["Career","career","software development"]
---

In 2015, it is as important as ever for developers of all levels of expertise and experience to re-train and update their skills.  In the fast moving world of technology, failure to do so can result in career stagnation and ultimately not reaching your full earnings potential. This post is an update to the popular post [10 things every software developer should do in 2014](https://www.developerhandbook.com/2014/01/18/10-things-every-software-developer-should-do-in-2014/).  All of the points made in that post are still relevant and valid so I recommend you take a look. **This post is entirely based on my own opinion** and I highly recommend you use this to figure out your own learning plan, based on your own level of skills an expertise.

### 1\. Source Control

Lets start simple.  You must be using source control.  There is literally no excuse. 99% of companies today are using some form of source control, and its becoming expected that you have at least a basic understanding of how source control works.  Most source control systems have the ability to create branches, view history, merge changes, and display differences between revisions.  You should be familiar at least at a high level, how to perform each of these actions in at least 2 different solutions. As a minimum, I strongly recommend that you learn how to use the basics of Git and TFS Version Control (TFSVC), as these seem to be the most popular in most circles today (especially if you are a .NET developer. You may also want to learn more about SVN and Mercurial just to ensure that you have most bases covered.

### 2\. CSS Pre-processors

There is a lot of debate on the web about CSS pre-processors and if you should/shouldn't be using them. Lets rewind a second. A CSS pre-processor is [basically a scripting language](https://drupalize.me/videos/what-css-preprocessor?p=1175) that is complied down into plain old CSS by some external tool.  The scripting language is typically an abstraction that can reduce the complexity of the underlying CSS and add additional features.  The scripting language compiles into plain CSS, which a web browser can understand. The general argument about CSS pre-processors between developers is that CSS should be simple and if your CSS is not simple, then your doing it wrong.  If your CSS is simple, then a pre-processor should be redundant. My argument is that whilst this is generally true for very small applications, once you start working in a team where everybody has their own way of doing things, or the application generally starts getting larger, then this breaks down.  You usually end up with super long CSS files full of duplication and even worse, inconsistencies. There are three main CSS pre-processor players; LESS, SASS, Stylus.  The main goals of each of these projects is as follows;

1.  Reduce length and complexity of CSS files.  Usually through partials that are merged together at compile time.
2.  Reduced maintenance through less duplication.
3.  To organise your CSS through nesting.
4.  To introduce variables and operators for calculating sizes etc.

I personally am I big fan of both LESS and SASS, and I'm currently migrating from the former to the latter.  I highly recommend that you have at least a high level of understanding of one or the other.

### 3\. JavaScript Supersets/Trans compilers/Pre-processors

Fundamentally the same as CSS pre-processors.  A JavaScript pre-processor is a tool that provides you with some higher level language that ultimately compiles back down to JavaScript. I'm particularly fond of [TypeScript](http://www.typescriptlang.org/ "TypeScript") right now.  TypeScript has a slightly steeper learning curve than something like [CoffeeScript](http://coffeescript.org/ "CoffeeScript") or [LiveScript](http://livescript.net/ "LiveScript"). Some features of TypeScript;

1.  Static typing...l types are known or inferred, so compile time checking informs you of any errors.
2.  Strong typing...prevents incompatible types from being passed between functions.
3.  Familiar constructs such as classes and interfaces.
4.  Reduced complexity compared to plain JavaScript.
5.  Decent IntelliSense (if you are a Visual Studio developer), even for third party libraries.

At this point, I feel that JavaScript pre-processors are still in their infancy.  I would still strongly recommend learning JavaScript in its pure form as it will no doubt still be around for at least the next 10 years, but if you can, have a look at TypeScript or CoffeeScript.  I suspect both will grow exponentially over the next year.

### 4\. Your primary (code) language

This (might) be a slight generalisation, but most people feel most comfortable when writing one or two languages.  That doesn't mean they're not very good at other languages, but that generally they learnt to write one or two languages in particular before branching out. Personally my first programming language was VB 6 way back in the day, but since then I've spent most of my time writing C#.  Whether it be Windows Forms, WPF, ASP .NET or just general back end development.  I know that I can achieve anything I want with C# with relative ease.  When I'm having a conversation with peers, or interviewers, or whomever I'm talking to at that time I'm secretly hoping that they will ask me questions about C# so that I can demonstrate my knowledge.  I have completed many Microsoft exams and gained a tonne of accreditation in the subject.  More importantly I have completed dozens of projects for customers, clients, colleagues and friends so I know how to see it through to completion. My point is, you should have your own C#.  It doesn't have to be C# it can be whatever language you want.  JavaScript, HTML, Ruby, Java, C++, or anything you like.  The point to take away is that you should know a language inside out, including its strengths, weaknesses, and especially when you _should and shouldn't_ use it. Probably the best way you can really master a language is to start teaching it to others.  You might want to write a blog, give presentations to your colleagues, or attend local user groups and share your knowledge to strangers.  Teaching forces you to look at something thoroughly and in-depth to broaden your understanding, mostly because of the fear that if you don't you will be caught out by a tricky question from an audience member.

### 5\. How to interview well and how to make your CV stand out

This one is so obvious, I almost didn't include it. You would be amazed at how many developers submit CVs to potential employers littered with spelling mistakes, incomplete or untrue information, and just plain messy by design. I don't claim to be an expert in this field.  I have been for a lot of interviews and I have sent my CV to many, many employers.  I have also had a lot of feedback from friends, family, recruiters and indeed interviewers too. Here are my top tips for a solid CV;

*   Get the basics right.  Ensure you CV is 100% free of spelling and grammatical errors.  Even the smallest mistakes will guarantee your CV is relegated to the bottom of the pile.
*   Keep the design simple.  Personally I use only a single font face, with 2-3 different sizes and minimal formatting. If you are more design oriented, you might want to do something a little more creative, and that's fine too...but don't be **too** creative.
*   Don't tell lies.  You will be found out.
*   If you are including links to your portfolio, make sure those links are appropriate to the job your interviewing for.  No potential employers want to see your Geocities website from the late 1990's.  (Yes I've seen somebody actually do this! Needless to say, they didn't get hired)

As for interviewing, again its all in the basics.  Make sure you prepare well before the interview, read the job description thoroughly and think about what skills/experience you have that the company are specifically looking for.  And as you are a developer, you'll probably want to brush up on your technical skills too, and read some common interview questions so that you aren't caught by surprise. For more information on how to boost your career, I highly recommend checking out an awesome book by [John Sonmez](http://simpleprogrammer.com), [Soft Skills: The software developer's life manual](http://www.amazon.co.uk/gp/product/1617292397/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=1617292397&linkCode=as2&tag=jprecom-21&linkId=KAKXXF5Y5DXRMOLQ).

### 6\. Relational database alternatives

I've touched on this previously in a related post, [8 things every .NET developer must understand](https://www.developerhandbook.com/2014/09/19/8-things-every-net-developer-must-understand/).  However, I cannot emphasise the point enough. Relational databases are not the be-all-and-end-all.  Its not sufficient in todays world to only having an understanding of Microsoft SQL Server or MySQL databases and how they work.  More and more companies are relying on No-SQL databases to improve performance of persisting and retrieving highly volatile data. No-SQL databases typically lack any formal structure and typically consist of some sort of list of key-value pairs.  At first this may seem a bit bizarre, but there are many benefits to structuring data like this;

*   Easy to develop with.  Either no or few joins.  No complex new language to learn.
*   Horizontal scaling
*   Schema-less
*   Supports large objects
*   Low or no licensing costs.

For a more comprehensive look at the benefits of No-SQL databases, take a look at [Adam Fowlers blog post on the subject](https://adamfowlerml.wordpress.com/2013/01/04/why-use-a-nosql-database-and-why-not/). RavenDB, MongoDB, and Windows Azure Blob Storage are the big players at the minute.  Each has a relatively low learning curve and are becoming widely adopted by companies.  I would suggest you take a look at each.

### 7\. DevOps

Another industry buzz word that seems to be confusing people, myself included. What is DevOps? Simply put, an effort to improve collaboration between the software development and IT support teams (referred to as operations). Traditionally, the role of the software development team within a company is to develop new functionality and generally "make changes" to a system.  That system might be internal or external, and it might be desktop or web based software. The role of operations is to ensure stability of systems.  The biggest risk to stability is change. DevOps is a concerned effort to improve the way in which the two teams communicate with each other to ensure continuous deployment whilst minimizing disruptions.  We have in the past, myself very much included, typically taken the attitude that once we make a change or develop a new feature and commit to source control then its "done".  Its then becomes operations responsibility to deploy the change and "handle that side of things". You should at least know what DevOps is, and how you can get more involved in it within your own company.  If your company does not currently employ a DevOps mentality, perhaps you could introduce it.  Get rid of the "them vs. us" culture and gain some respect in the process. I highly recommend look at [What is DevOps by Damon Edwards on Dev2Ops](http://dev2ops.org/2010/02/what-is-devops/) for more information.

### Summary

2015 is yet another year of rapid change for our industry and developers alike.  There are clear trends towards pre-processors, non-relational databases, JavaScript frameworks, cross platform development should not be ignored.