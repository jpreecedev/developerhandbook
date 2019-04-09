---
layout: post
title: Resilient Connection for Entity Framework 6
description: You can have resilient connections in Entity Framework, I mean a connection that could retry a certain number of times automatically before giving up.
date: 2014-02-05
categories: ['Entity Framework', 'C#', '.NET']
group: 'Software Development'
---

> **Disclaimer**: I cannot take a shred of credit for the code you are about to see. I simply went over to the [Entity Framework source code repository on CodePlex](http://entityframework.codeplex.com/SourceControl/latest 'Entity Framework'), copied some code, butchered it, hammered it, and rolled it until it fitted nicely into the slot that was my requirements. Please direct your thanks to the [Entity Framework team](http://entityframework.codeplex.com/team/view 'Entity Framework Team').

I had a requirement whereby I needed a resilient Entity Framework connection, and by that I mean a connection that could retry a certain number of times automatically before giving up. After searching around I found a class, called [DbExecutionStrategy](http://entityframework.codeplex.com/SourceControl/latest#src/EntityFramework/Infrastructure/DbExecutionStrategy.cs 'DbExecutionStrategy'), which provided exactly the functionality I needed. The problem is, as far as I can tell, this class can only be used with the Code First approach. So it is all but useless to me, as the project I was working on was based on the database first approach. I directly copied the code provided in the aforementioned class, removed all the bits that didn't interest me, and then reworked the code into a simple extension method that can be used against any DbContext;

```csharp
public static class Extensions {
 #region Constants

 private const double DefaultExponentialBase = 2;
 private const double DefaultRandomFactor = 1.1;
 private const int MaxRetryCount = 5;

 #endregion

 #region Static Fields

 private static readonly TimeSpan DefaultCoefficient = TimeSpan.FromSeconds(1);
 private static readonly TimeSpan MaxDelay = TimeSpan.FromSeconds(30);

 private static readonly Random _random = new Random();
 private static int _attempts;

 #endregion

 public static void ExecuteWithRetry<T> (this T context, Action<T> operation)
 where T: DbContext {
  while (true) {
   TimeSpan? delay;
   try {
    operation(context);
    return;
   } catch (Exception ex) {
    delay = GetNextDelay();
    if (delay == null) {
     throw new RetryLimitExceededException("The maximum number of retries has been reached", ex);
    }
   }

   Thread.Sleep(delay.Value);
  }
 }

 public static TResult ExecuteWithRetry<T,TResult> (this DbContext context, Func<T,TResult> operation)
 where T: DbContext {
  while (true) {
   TimeSpan? delay;
   try {
    TResult result = operation((T) context);
    return result;
   } catch (Exception ex) {
    delay = GetNextDelay();
    if (delay == null) {
     throw new RetryLimitExceededException("The maximum number of retries has been reached", ex);
    }
   }

   Thread.Sleep(delay.Value);
  }
 }

 private static TimeSpan? GetNextDelay() {
  _attempts += 1;
  if (_attempts < MaxRetryCount) {
   double delta = (Math.Pow(DefaultExponentialBase, _attempts) - 1.0) * (1.0 + _random.NextDouble() * (DefaultRandomFactor - 1.0));
   double delay = Math.Min(DefaultCoefficient.TotalMilliseconds * delta, MaxDelay.TotalMilliseconds);

   return TimeSpan.FromMilliseconds(delay);
  }

  return null;
 }
}
```

So if you want resilient connections in your project, all you need is the following;

```csharp
using(AdventureWorks2012Entities context = new AdventureWorks2012Entities()) {
 var addresses = context.ExecuteWithRetry<AdventureWorks2012Entities,
  List<Address>>(c => c.Addresses.ToList());
 Console.WriteLine(addresses.Count());
}
```

The logic is simple to test, simply use SQL Server Management studio to take your database offline. The code will retry up to 5 times over a period of 30 seconds, each subsequent retry will wait slightly longer more making the next attempt. I will refine the code over time, but for now it more than serves its purpose. Let me know if you find this helpful!
