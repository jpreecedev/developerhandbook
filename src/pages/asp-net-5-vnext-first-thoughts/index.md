---
layout: post
title: ASP .NET 5 (vNext), first thoughts
description: Microsoft ASP .NET 5 is a major shift from traditional .NET methodologies, this is a high level post about the great and no so great things on the horizon
date: 2015-08-21
categories: ['C#', '.NET', 'Career']
group: 'Software Development'
---

Microsoft ASP .NET 5 is a major shift from traditional ASP .NET methodologies. Whilst I am not actively developing ASP .NET 5 applications at the minute, .NET has always been my bread and butter technology. When I look at industry trends here in the UK, all I see is .NET .NET .NET, therefore it is important to have one eye on the future. I've watched all the [introduction videos on the ASP .NET website](http://www.asp.net/vnext/overview/aspnet-vnext), but I also wanted to take a look at what ASP .NET 5 means to _me_.

This is not meant to be a fully formed post. This will come later down the line. Right now, I think ASP .NET 5 is evolving too quickly to be "bloggable" fully.

## Version disambiguation and terminology

Lets take a second to disambiguate some terminology. Microsoft's understanding of versioning has always been different to everybody else. This tweet from [Todd Motto](https://twitter.com/toddmotto) really sums it up;

> Bill Gates on counting to ten. 1, 2, 3, 95, 98, NT, 2000, XP, Vista, 7, 8, 10.
>
> - Todd Motto (@toddmotto) [August 3, 2015](https://twitter.com/toddmotto/status/628124608999329792)

Looks like versioning is not going to get any simpler for the time being

### ASP .NET 5 (ASP .NET 4.6 is the current version)

Previously known as ASP .NET vNext, ASP .NET 5 is the successor of ASP .NET 4.6\. In the past, versions of ASP .NET have followed the .NET Framework release cycle. It looks like that is coming to an end now. ASP .NET should not be confused with MVC. ASP .NET is a technology, MVC is a framework.

ASP .NET 5 is currently scheduled for release in the first quarter of 2016, as per this tweet from [Scott Hansleman](https://twitter.com/shanselman); (I suspect this date will slip though)

> [@jpreecedev](https://twitter.com/jpreecedev) getting it right and making sure it runs on all three platforms is a big undertaking
>
> - Scott Hanselman (@shanselman) [July 20, 2015](https://twitter.com/shanselman/status/623227525682991104)

The ASP .NET team would rather "get it right" and take longer, than rush the product and get it wrong (which would spell long term disaster for the platform)

### MVC 6

This is the new version of Microsoft's Model-View-Controller framework. There is a nice post on StackOverflow that describes the [new features of MVC 6](http://stackoverflow.com/questions/24533380/what-are-the-asp-net-mvc-6-features). Here are a few of the best;

- "Cloud optimization" ... so better performance.
- MVC, WebAPI and Web Pages are now unified.
- Removed dependency on System.Web, which results in more an 10x reduction in request overhead.
- Built in dependency injection, which is pluggable, so it can be switched out for other DI providers.
- Roslyn enables dynamic compilation. Save your file, refresh the browser. Works for C# too. No compilation required.
- Cross platform.

### DNX (.NET Execution Environment)

The [.NET Execution Environment, DNX,](https://github.com/aspnet/dnx) is a cross platform _thing_ that will run your .NET applications. DNX is built around the .NET Core, which is a super lightweight framework for .NET applications, resulting in drastically improved performance thanks to a reduce pipeline. Dependency on the dinosaur assembly **System.Web** has gone, but in return you are restricted to more of a subset of features. This is a good thing, my friend. **System.Web** has every featured imagined over the last 13 years, 75% of which you **probably** don't even care about.

## Interesting new features and changes

- Use of data annotations for things that would previously have been HTML helpers (Tag helpers)
- Environment tag on \_Layout. Enables a simple means to specify which resources to load depending on the application configuration (Debug mode, release mode etc)
- Bower support
- Gulp out of the box (interesting that they chose Gulp over Grunt, I think its [Gulps superior speed](http://tech.tmw.co.uk/2014/01/speedtesting-gulp-and-grunt/) that has won the day.)
- .NET Core. Drastically reduced web pipeline, could result in 10x faster response in some cases (remains to be seen!).
- Noticeably faster starting up.
- Save to build. With Roslyn, it is now not necessary to build every time you make a change to a CSharp (.cs) code file. Just save and refresh. Compilation is done in memory.
- Intellisense hints that assembly is not available in .NET Core (nice!)
- Built in dependency injection, which can be switched out for a third party mechanism.
- Web API is now no longer a separate component. Web API was originally a separate technology from MVC. The two were always very alike, and it makes sense that the two should be merged together.

## Deleted stuff

- Web.config has finally been removed and exchanged for a simpler JSON formatted file. Parties have been thrown for less.
- packages.config has gone, seems redundant now that things are in line with how the rest of the web develop, i.e. using package.json

## Bad points

- Still heavy use of the Viewbag in default projects. I'd like to see the ViewBag removed entirely, but I suspect that will never happen.
- The default project template is still full of "junk", although it is now a bit simpler to tidy up. Visual Studio automatically managers bower and npm packages, so removing a package is as simple as deleting it from the package.json file.

## Summary

I am very keen to get cracking with ASP .NET 5 (vNext), although at the time of writing I feel that it still a little bit too dynamic to start diving in to at a deep level. The introduction of .NET Core, a cross platform, open source subset of the .NET framework is awesome... I can't wait to see the benefits of using this in the wild (reduced server costs!!! especially when running on a Linux based machine, although it remains to be seen). The `ViewBag` still exists, but we can't have it all I suppose. At this point, we're at least 5-6 months away from a release, so develop with it at your own risk!
