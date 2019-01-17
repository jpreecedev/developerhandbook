---
layout: post
title: How to create a RESTful web service using WCF (Part 1 of 3)
description: This is a comprehensive 3 part tutorial that discusses how to create a RESTful web service using WCF. This is the introductory post to get you set up.
date: 2014-04-02
categories: ['WCF']
tags: ['c#', 'rest', 'wcf', 'WCF']
---

RESTful (Representational State Transfer) web services use HTTP verbs to map CRUD operations to HTTP methods. RESTful web services expose either a collection resource (representational of a list) or an element resource (representational of a single item in the list).HTTP verbs are used as follows;

- Create (POST) > create a new resource.
- Read (GET) > retrieve one or many resources.
- Update (PUT) > update an existing resourπce.
- Delete (DELETE) > delete an existing resource.

This tutorial demonstrates to how implement a simple RESTful web service using WCF, and how to query it using various jQuery methods (at a high level). Entity Framework code first will be used for data persistence. The program we will create will be for reading, editing and updating a list of blog posts... what else?! By the way, throughout this tutorial I will use the terms RESTful service, web service, and WCF service interchangeably...which is fine for this tutorial (but not in the wild).

## Project Structure

I think its very important to establish the correct project structure before developing a solution, as it can often be hard to change later.

![Solution](solution1.png)

Add three new projects; **Data**, **Service** and **Web** (as shown to the left). We want to define clear boundaries in our solution, which would (if this were a real project) make future maintenance easier. The data project will contain our entities, and all (surprisingly little) logic required to persist and retrieve data from an external data store. In this case, for simplicity, I have used Entity Framework code first approach. The service layer will contain our WCF RESTful service definition, all associated configuration, and each of our CRUD methods. Finally, the Web project will be the client. Again for simplicity, I simply added a HTML file (index.html) and jQuery to pass requests to the service. We will not dive too much into how this works, because its relatively straightforward. All associated source code for this solution is available on [GitHub](https://github.com/jpreecedev/RESTfulTutorial). Add each project using the following templates;

- **Data** > standard C# class library
- **Service** > WCF Service library
- **Web** > Empty ASP .NET Web application (completely empty).

### Cross Origin Request Service (CORS)

I found that CORS requires quite a bit of additional code to work correctly. In case you don't know, CORS enables us to make requests to the web service across domains. By default, Visual Studio will spin up the WCF service and the IIS Express instance on different ports, so basically nothing will work out of the box (CORS is strictly disabled by default). To make your client and WCF service run on the same ports, follow these steps;

- When we define an endpoint for our service (a little later on) set the port number to 8085. This is an arbitrary number.
- Right click on your **Web** project, and click properties.
- Click the **Web** tab.
- Set the project Url to; [http://localhost:8085](http://localhost:8085 'http://localhost:8085') (or whatever port number you have decided to go with). What matters is that they are the same.

![Web](web1.png)

So now your WCF service and client run on the same port number, all the extra agony that comes with CORS is avoided.

## Data persistence using Entity Framework Code First

I find Entity Framework code first to be one of the best and fastest ways to rapidly prototype a SQL server database, fill it with data, and query that data. Perhaps not an approach you would want to use in a production environment, I find the whole concept of migrations to be a little clunky, but great for getting up and running quickly. I'm assuming that you have a good working knowledge of Entity Framework code first. If not, then have a look at my tutorial on [Entity Framework code first in 15 minutes](/entity-framework/entity-framework-code-first-in-15-minutes/). And by the way, if you also need to scrub up on code first migrations, have a look at [Entity Framework code first migrations](/entity-framework/wpf-entity-framework-code-first-migrations-in-a-production-environment/) tutorial. A blog post, for this tutorial at least, consists simply of an `Id`, `Title` and `Url` property. Add **BlogPost.cs** to your **Data** project as follows;

```csharp
public class BlogPost
{
    public int Id { get; set; }
    public string Title { get; set; }

    [Column("Url")]
    public string UriString
    {
        get { return Url == null ? null : Url.ToString(); }
        set { Url = value == null ? null : new Uri(value); }
    }

    [NotMapped]
    public Uri Url { get; set; }
}
```

As you may know, Entity Framework can only deal with simple types so we need a wrapper property to retrieve and set the value of the actual property for us. We have used the `ColumnAttribute` to indicate the name of the column that the property is to be mapped to, and used the `NotMappedAttribute` to explicitly tell Entity Framework not to use said `Url` property. (By default Entity Framework tries to map all public properties). We will revisit this class later and tidy it up for WCF and so that it can be consumed properly by the client. Next, add a **BlogContext.cs** as follows;

```csharp
public class BlogContext : DbContext
{
    public BlogContext()
        : base("BlogContext")
    {
    }

    public DbSet<BlogPost> BlogPosts { get; set; }
}
```

And finally, add a database initializer and define some seed data;

```csharp
public class BlogInitializer : DropCreateDatabaseAlways
{
    protected override void Seed(BlogContext context)
    {
        context.BlogPosts.AddRange(
            new[]
        {
            new BlogPost { Id = 0, Title = "Resilient Connection for Entity Framework 6", Url = new Uri("/entity-framework/resilient-connection-for-entity-framework-6/") },
            new BlogPost { Id = 1, Title = "How to pass Microsoft Exam 70-486 (Developing ASP.NET MVC 4 Web Applications) in 30 days", Url = new Uri("/career/pass-microsoft-exam-70-486-in-30-days/") },
            new BlogPost { Id = 2, Title = "5 easy security enhancements for your ASP .NET application", Url = new Uri("/.net/5-easy-security-enhancements-for-your-asp-net-application/") },
            new BlogPost { Id = 3, Title = "10 things every software developer should do in 2014", Url = new Uri("/career/10-things-every-software-developer-should-do-in-2014/") },
            new BlogPost { Id = 4, Title = "15 reasons why I can't work without JetBrains ReSharper", Url = new Uri("/career/15-reasons-why-i-cant-work-without-jetbrains-resharper/") }
        });
    }
}
```

I went with the `DropCreateDatabaseAlways` initializer so that I can add whatever dummy data I like and just reset everything by simply restarting the application.

## Summary

We've set the important groundwork for developing our RESTful WCF service. In the subsequent parts of this tutorial we will look at creating a WCF service contract, and how to invoke it using various HTTP verbs. Stay tuned!
