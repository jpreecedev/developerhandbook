---
layout: post
title: How to fix 'Project failed to build' error when adding an Entity Framework migration (add-migration)
date: 2013-09-06
tags: ["c#","entity framework","Entity Framework"]
---

I recently spent several hours tearing my hair out try to figure out why Entity Framework was preventing me from adding a migration to my project. I made some very simple changes to my existing model (I'm developing using the Entity Framework Code First approach) and when trying to add a migration, I was presented with the following error message;

[![Project Failed To Build](https://developerhandbook.com/wp-content/uploads/2013/08/projectfailedtobuild1.png)](projectfailedtobuild1.png)

But how can this be?  For you see, my project _does_ build... [![Build Succeeded](https://developerhandbook.com/wp-content/uploads/2013/08/buildsucceeded1.png)](buildsucceeded1.png) My project not only builds, but it runs and works just fine ... (up until the point where Entity Framework complains about the out of date model of course!).

### The solution

It was only after considerable head scratching, and tinkering, that I came across the solution.  My project specifically targets the x86  platform, as shown below; [![Configuration Options](https://developerhandbook.com/wp-content/uploads/2013/08/configurationoptions1.png)](configurationoptions1.png) If I go ahead and change the build configuration to 'Any CPU' ... I am greeted with a couple of dozen build errors, all relating to missing references! Once I resolved these issues, I was once again able to create migrations. Apparently Entity Framework builds your project in 'Any CPU' when creating migrations (and probably when issuing other commands as well). Hopefully this will help resolve your problem as well.