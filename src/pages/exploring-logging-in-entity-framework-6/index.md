---
layout: post
title: Exploring logging in Entity Framework 6
description: One of the most compelling features of Entity framework is the new logging (SQL Interception) functionality that ships out of the box.
date: 2013-11-13
categories: ['Entity Framework', 'C#', '.NET']
featuredImage: ''
---

A project I am working on at the minute was recently upgraded to use Entity Framework 6.0.1\. There were many reasons why we wanted to do this, but one of the most compelling reasons was the [new logging (SQL Interception) functionality](http://entityframework.codeplex.com/wikipage?title=Interception 'Entity Framework 6 SQL Interception') that ships out of the box. A colleague demonstrated this new functionality and I immediately noticed a problem (limitation if you will) that I foresaw becoming a bigger issue when the time comes to performance tune the application.

### Implementing simple logging

Take the very simple code below. We tell Entity Framework about our initializer (which adds some seed data for us) and then use our context as normal (in this case simply outputting the number of customers, and then exiting). This is pretty standard stuff, except for one simple difference (notice line 20).

```csharp
class Program {
 static void Main() {
  Database.SetInitializer(new MyInitializer());

  using(LoggerDbContext context = new LoggerDbContext()) {
   Console.WriteLine(context.Customers.Count());
  }

  Console.ReadLine();
 }

}
public class LoggerDbContext: DbContext {
 public LoggerDbContext() {
  Database.Log = Console.WriteLine;
 }

 public DbSet<Customer> Customers {
  get;
  set;
 }

}
public class MyInitializer: DropCreateDatabaseAlways<LoggerDbContext> {
 protected override void Seed(LoggerDbContext context) {
  base.Seed(context);

  context.Customers.Add(new Customer {
   FirstName = "Jon",
    LastName = "Preece"
  });

  context.Customers.Add(new Customer {
   FirstName = "Sian",
    LastName = "Preece"
  });

  context.Customers.Add(new Customer {
   FirstName = "Oliver",
    LastName = "Preece"
  });
 }

}
public class Customer {
 public int Id {
  get;
  set;
 }
 public string FirstName {
  get;
  set;
 }
 public string LastName {
  get;
  set;
 }
}
```

`Database.Log = Console.WriteLine` is somewhat helpful to us. If you run the above code, you will see various SQL statements outputted to the console window, as well as execution time and/or any error information. At first glance this is all useful information, but what about when your application grows and/or becomes more complex? Well the importance of having this information stays very high, but the raw nature of the humble `System.String` is very restrictive. I really want a complex object that gives me the actual `DbCommand` that was executed, and associated information (such as execution time) in their raw formats. I want this information so I can easily filter what information I output to my logs, say using the execution time as a filter (only log transactions taking > 50 ms). I really want to avoid having a clunky method that strips out the execution time from the `System.String` itself.

### Writing a custom formatter

Looking at the one and only formatter, [DatabaseLogFormatter](http://entityframework.codeplex.com/SourceControl/latest#src/EntityFramework/Infrastructure/Interception/DatabaseLogFormatter.cs), that ships with Entity Framework 6, we can see that all we need to do is implement the [IDbCommandInterceptor](http://entityframework.codeplex.com/SourceControl/latest#src/EntityFramework/Infrastructure/Interception/IDbCommandInterceptor.cs) interface. This is then passed to Entity Framework (shown shortly), which in turn calls the appropriate methods when appropriate. This is known as an interceptor, because it, for lack of a better word, intercepts various actions performed by the framework so that we can do some custom work. The default formatter, `DatabaseLogFormatter`, simply takes the `DbCommand` and extracts the raw SQL and outputs it as a `System.String`. Also, it uses an `System.Threading.Tasks.Stopwatch` object to time how long was required to execute the command. Whilst this isn't an exact science, its certainly a very good means of seeing how well our queries (and ultimately our application) are performing. Here is an example formatter, called `LogFormatter`;

```csharp
public class LogFormatter: IDbCommandInterceptor {
 private readonly Stopwatch _stopwatch = new Stopwatch();

 public void NonQueryExecuting(DbCommand command, DbCommandInterceptionContext<int> interceptionContext) {
  _stopwatch.Restart();
 }

 public void NonQueryExecuted(DbCommand command, DbCommandInterceptionContext<int> interceptionContext) {
  _stopwatch.Stop();
  Log(command, interceptionContext);
 }

 public void ReaderExecuting(DbCommand command, DbCommandInterceptionContext<DbDataReader> interceptionContext) {
  _stopwatch.Restart();
 }

 public void ReaderExecuted(DbCommand command, DbCommandInterceptionContext<DbDataReader> interceptionContext) {
  _stopwatch.Stop();
  Log(command, interceptionContext);
 }

 public void ScalarExecuting(DbCommand command, DbCommandInterceptionContext<object> interceptionContext) {
  _stopwatch.Restart();
 }

 public void ScalarExecuted(DbCommand command, DbCommandInterceptionContext<object> interceptionContext) {
  _stopwatch.Stop();
  Log(command, interceptionContext);
 }

 private void Log<TResult> (DbCommand command, DbCommandInterceptionContext<TResult> interceptionContext) {
  Logger.Log(command, _stopwatch.ElapsedMilliseconds, interceptionContext.Exception);
 }

}
public static class Logger {
 public static void Log(DbCommand command, long elapsedMilliseconds, Exception exception) {
   //Do something useful here with the raw data
  }
}
```

To begin using your formatter, simply call the static `System.Data.Entity.Infrastructure.Interception.DbInterception.Add` method and pass in a new instance of your formatter.

```csharp
DbInterception.Add(new LogFormatter());
```

And, in case you're wondering ... you no longer need that pesky `Database.Log` code shown above, your logger will still work just fine without it. Of course there is no better substitute for profiling the performance of a large application than using a tool such as SQL Profiler, but this is certainly a step in the right direction.

### Summary

We can write our own logger (Interceptor) to format the results of on action performed by the Entity Framework (reading from, saving to the database etc) however we like, simply by implementing the `IDbCommandInterceptor` interface on a vanilla C# class and then passing it to the Entity Framework using the static method `DbInterceptor.Add` Hopefully you will find this useful. Feel free to leave any comments/feedback below.
