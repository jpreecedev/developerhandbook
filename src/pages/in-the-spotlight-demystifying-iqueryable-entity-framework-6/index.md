---
layout: post
title: In the spotlight: Demystifying IQueryable (Entity Framework 6)
date: 2013-11-24
tags: ["Architecture","c#","entity framework","Entity Framework"]
---

I'm not afraid to admit it. I can't be the only one who has been confused by [IQueryable](http://msdn.microsoft.com/en-us/library/system.linq.iqueryable(v=vs.110).aspx "IQueryable") when working with Entity Framework or LINQ to SQL. When using the web to research the topic, I have seen many conflicting blog posts and contradicting answers on StackOverflow. I have read various posts on MSDN about the subject, and I find them difficult to understand and incomplete. I seek to at least attempt to clarify the subject a little with this post. Entity Framework has become such a powerful object rational mapper (ORM) that performance of desktop and web applications seems to be drifting towards the back of developers minds. Personally, I'm so used to doing things the "traditional way" (using ADO.NET `SqlConnection`, `DbCommand` etc and testing/optimizing using a combination of SQL Server Management Studio and SQL Profiler) that I find it hard to "write code and forget". So naturally, I keep a close eye on what queries are being ran against my database. The purpose of this blog post is to have a closer look at `IQueryable`, see how it is implemented in Entity Framework, what happens to our code at compile time, and understand what impact `IQueryable` has on our repositories. All code samples in this post use [Entity Framework 6](http://entityframework.codeplex.com/wikipage?title=specs "Entity Framework 6") (although all versions behave the same) and use the [Adventure Works 2012 database](http://msftdbprodsamples.codeplex.com/releases/view/55330 "Adventure Works 2012"). Just for reference, I am also using Visual Studio 2013 and SQL Server 2012 but all should hold true with any past version. The code has not been tested with MySQL or any other database provider. Code can be downloaded at the end of this post.

### **Deferred execution**

Before we do anything, lets get one thing straight so that we are absolutely clear on this. BOTH `IQueryable` and `IEnumerable` code expressions are deferred (lazily) executed. This means that the expression itself is created immediately, but it isn't executed until needed (invoked or evaluated). Example:

    using (AdventureWorks2012Entities context = new AdventureWorks2012Entities())
    {
        var result = context.SalesPersons.OrderByDescending(p => p.Bonus).Take(10);
        foreach (var item in result)
        {
            Console.WriteLine(item.Bonus);
        }
    }

Before running the above code, set a breakpoint on line 4 and start running SQL profiler. Step through the program and you will see that `result` doesn't become populated until the first iteration of the loop. If `result` never gets used/invoked, then the query will never be executed. Virtual navigation properties are also lazy loaded, and lazy loading can also be turned off. Both these topics are out of the scope of this post.

### **LINQ to Objects**

First things first... so that we prevent any confusion, this post takes aim at Entity Framework and LINQ to SQL but not LINQ to Objects. Why? Well simply because (as far as I can tell) all LINQ to Objects queries return [IEnumerable](http://msdn.microsoft.com/en-us/library/system.collections.ienumerable(v=vs.110).aspx "IEnumerable") or a derivative of `IEnumerable`, such as [IOrderedEnumerable](http://msdn.microsoft.com/en-us/library/bb534852(v=vs.110).aspx "IOrderedEnumerable") or [IEnumerable<IGrouping<TKey,TElement>>](http://msdn.microsoft.com/en-us/library/bb344977(v=vs.110).aspx "IEnumerable<IGrouping<TKey,TElement>>") to name just a couple. `IEnumerable` expressions and executed in memory against the full dataset. Example;

    string[] colours = new[] { "Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet" };
    IOrderedEnumerable<string> alphabetical = colours.OrderBy(t => t);

    foreach (var colour in alphabetical)
    {
        Console.WriteLine(colour);
    }

In the above example, the entire collection of data (in this case, a series of colours) is loaded into memory (`string[] colours`) and then ordered, which creates a new collection of type `IOrderedEnumerable<string>`. The only way of returning `IQueryable<string>` instead of `IOrderedEnumable<string>` is to use the `AsQueryable()` extension method. There generally wouldn't be much point in doing this, as the expression would likely never be executed by a query provider.

### **IQueryable, a simple example**

Lets have a look at some simple code that uses `IQueryable`;

    using (AdventureWorks2012Entities context = new AdventureWorks2012Entities())
    {
        IQueryable<SalesPerson> top10SalesByBonusQueryable = context.SalesPersons.OrderByDescending(p => p.Bonus).Take(10);
        foreach (var salesPerson in top10SalesByBonusQueryable)
        {
         Console.WriteLine(salesPerson.Bonus);
        }
    }

The code first orders all the sales people by the amount of bonus they have received, and then takes the top 10\. Well almost but not quite. IQueryable uses a `DbQueryProvider` ([IQueryProvider](http://msdn.microsoft.com/en-us/library/system.linq.iqueryprovider(v=vs.110).aspx "IQueryProvider")) to translate the expression (the chained extension methods) into a **single** database query (in this case, it generates T-SQL to run against the database). Once the query is invoked (by say, enumerating it), the query is executed against the database and the results are returned back to be consumed. The above code generates the following T-SQL;

    SELECT TOP (10) 
        [Extent1].[BusinessEntityID] AS [BusinessEntityID], 
        [Extent1].[TerritoryID] AS [TerritoryID], 
        [Extent1].[SalesQuota] AS [SalesQuota], 
        [Extent1].[Bonus] AS [Bonus], 
        [Extent1].[CommissionPct] AS [CommissionPct], 
        [Extent1].[SalesYTD] AS [SalesYTD], 
        [Extent1].[SalesLastYear] AS [SalesLastYear], 
        [Extent1].[rowguid] AS [rowguid], 
        [Extent1].[ModifiedDate] AS [ModifiedDate]
        FROM [Sales].[SalesPerson] AS [Extent1]
        ORDER BY [Extent1].[Bonus] DESC

This query is very efficient. Only 10 rows are selected (`Take(10)`) and the result set is ordered (`OrderByDescending(p => p.Bonus)`). The same query using `IEnumerable` would have required the entire dataset, which could consist of thousands of rows, to be preloaded into memory. Granted with servers getting evermore powerful, this isn't as big a deal as it used to be. However, when your website or application grows or indeed you are using a service such as Windows Azure that bills you for CPU time/database usage etc, this is going to become an issue ... a potentially costly one at that. Decompiling the code (using a fantastic tool called [dotPeek](http://www.jetbrains.com/decompiler/ "dotPeek")) reveals an interesting insight;

    using (AdventureWorks2012Entities works2012Entities = new AdventureWorks2012Entities())
    {
        DbSet<SalesPerson> salesPersons = works2012Entities.SalesPersons;
        Expression<Func<SalesPerson, Decimal>> keySelector = (Expression<Func<SalesPerson, Decimal>>) (p => p.Bonus);
        foreach (SalesPerson salesPerson in (IEnumerable<SalesPerson>) Queryable.Take<SalesPerson>((IQueryable<SalesPerson>) Queryable.OrderByDescending<SalesPerson, Decimal>((IQueryable<SalesPerson>) salesPersons, keySelector), 10))
            Console.WriteLine(salesPerson.Bonus);
    }

Specifically notice that the `Take` extension method is not coming from the `System.Linq.Enumerable` extensions file, but instead from the `System.Linq.Queryable` extensions file. A small detail that is easily overlooked. Hence `Queryable.Take<SalesPerson>` rather than `Enumerable.Take<SalesPerson>`. The conclusion we can make from the above code sample, is that Entity Framework (or indeed LINQ to SQL) is going to attempt to write the most efficient query to run against our database. By efficient, I mean a query that is going to return the smallest amount of data needed to fulfil the request.

### **IQueryable in Entity Framework**

As part of getting to grips with `IQueryable`, I downloaded the Entity Framework source code from [CodePlex](http://entityframework.codeplex.com/ "Entity Framework") and started examining it. All of your queries for data when using Entity Framework are written against `DbSet`. For example, in the above code we are querying against the SalesPerson entity, which is exposed on our `DbContext` as a `DbSet`;

    public DbSet<SalesPerson> SalesPersons { get; set; }

Closer examination of DbSet reveals that it implements `IQueryable` (generic and non generic). No real surprises there. You may be intrigued to know that DbSet also implements `IEnumerable` (generic and non generic) as well.

    public class DbSet<TEntity> : DbQuery<TEntity>, IDbSet<TEntity>, IQueryable<TEntity>, IEnumerable<TEntity>, IQueryable, IEnumerable where TEntity : class
    {

    }

First things first, as you might expect ... if you remove the `IQueryable` interface and implementation (generic and non generic) all your code is compiled with the `IEnumerable` provider/extensions. Naturally your code won't actually _do_ anything, as there is no query being ran against the database. But, how does the compiler decide to use `IQueryable` over `IEnumerable`? Well sorry to disappoint, but its just a case of the order in which the interfaces appear on `DbSet`. It's very hard to test this theory with Entity Framework itself as `IEnumerable` lives in `System.Collections`, which I do not have the actual source code for. A simple code sample can confirm this;

    public class Program
    {
        static void Main(string[] args)
        {
            var myTest = new MyTest();
            myTest.DoSomething();
        }
    }

    public class MyTest : IMyTest, IYourTest
    {
    }

    public static class Extensions
    {
        public static void DoSomething(this IYourTest obj)
        {
        }

        public static void DoSomething(this IMyTest obj)
        {
        }
    }

Granted the code doesn't actually compile due to the ambiguity, but switching around the interfaces on `MyTest` and looking at the IntelliSense for `myTest.DoSomething()` proves the point.

### IQueryable vs IEnumerable in your Repository

One of the hottest Entity Framework related topics on the web over the past few months has been about weather or not to use `IEnumerable` or `IQueryable` on your repositories. Hopefully this analysis will help clear things up a bit. First things first, one important goal when designing your project is to have a clear boundary between each of the areas. Your view logic should be in the view, the business logic should be in its own project, and data access code should only care about retrieving and saving data from/to the database. Its considered bad practice to have code bleed between these areas. Take the following unit of work;

    public class QueryableUnitOfWork : IDisposable
    {
        private AdventureWorks2012Entities _context = new AdventureWorks2012Entities();

        public IQueryable<SalesPerson> GetTopSalesPeople()
        {
            return _context.SalesPersons.OrderByDescending(p => p.Bonus).Take(10);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public void Dispose(bool isDisposing)
        {
            _context.Dispose();
        }
    }

The purpose of this code is quite simply to get the top sales people based on the amount of bonus they were paid. The method returns `IQueryable`, meaning that an expression will be written and translated to T-SQL later. Now the consumer of this code can influence the final expression that is generated under the hood, so to speak, by chaining on extension methods. Take the following code;

    public static void Run()
    {
        using (QueryableUnitOfWork unitOfWork = new QueryableUnitOfWork())
        {
            var topSalesPeople = unitOfWork.GetTopSalesPeople();
            Console.WriteLine(topSalesPeople.Take(3).Sum(p =>; p.Bonus));
        }
    }

The above code only actually cares about the top 3 sales people not the top 10\. The resulting T-SQL is as follows;

    SELECT 
        [GroupBy1].[A1] AS [C1]
        FROM ( SELECT 
            SUM([Limit1].[Bonus]) AS [A1]
            FROM ( SELECT TOP (3) [Extent1].[Bonus] AS [Bonus]
                FROM [Sales].[SalesPerson] AS [Extent1]
                ORDER BY [Extent1].[Bonus] DESC
            )  AS [Limit1]
        )  AS [GroupBy1]

The expression provider did a great job of interpreting the expression. It returned just the sum of the top 3 sales peoples binuses, without looking at the top 10 first .. great stuff. So if the expression query is generating the most efficient T-SQL, whats the problem? Well, our data access logic has bled into our business logic area. The business logic changed the original intention of the data access method. Bad news. So how to fix this? Your first thought might be to change `IQueryable` to `IEnumerable`, lets take a look at that first;

    public IEnumerable<SalesPerson> GetTopSalesPeople()
    {
        return _context.SalesPersons.OrderByDescending(p => p.Bonus).Take(10);
    }

Its very important to understand what actually happens here. Even though your method returns `IEnumerable`, `SalesPersons` still implements `IQueryable`, so this part of the method is still interpreted by the expression provider into an efficient query and then the results are cast and returned as `IEnumerable`. Here is the compiled code;

    public IEnumerable<SalesPerson> GetTopSalesPeople()
    {
      return (IEnumerable<SalesPerson>) Queryable.Take<SalesPerson>((IQueryable<SalesPerson>) Queryable.OrderByDescending<SalesPerson, Decimal>((IQueryable<SalesPerson>) this._context.SalesPersons, (Expression<Func<SalesPerson, Decimal>>) (p => p.Bonus)), 10);
    }

And the resulting T-SQL;

    SELECT TOP (10) 
        [Extent1].[BusinessEntityID] AS [BusinessEntityID], 
        [Extent1].[TerritoryID] AS [TerritoryID], 
        [Extent1].[SalesQuota] AS [SalesQuota], 
        [Extent1].[Bonus] AS [Bonus], 
        [Extent1].[CommissionPct] AS [CommissionPct], 
        [Extent1].[SalesYTD] AS [SalesYTD], 
        [Extent1].[SalesLastYear] AS [SalesLastYear], 
        [Extent1].[rowguid] AS [rowguid], 
        [Extent1].[ModifiedDate] AS [ModifiedDate]
        FROM [Sales].[SalesPerson] AS [Extent1]
        ORDER BY [Extent1].[Bonus] DESC

The take top 3 operation is then done in memory against the resulting `IEnumerable` collection of 10 sales people then the sum is performed. This, naturally is slightly less efficient than using `IQueryable` because you're working against a larger collection of data. At least our original repository method executed in the way we intended. So you may be thinking, 'What's the big deal? A little boundary bleed never hurt anybody...'. Well for the most part you are right, but its important to know that not _every_ expression can be interpreted by the expression provider. The more complicated a query becomes, the more likely it'll be that it cannot be interpreted. There is a simple way to see this behaviour. Take the following code;

    public static void Run()
    {
        using (QueryableUnitOfWork unitOfWork = new QueryableUnitOfWork())
        {

            var topSalesPeople = from p in unitOfWork.GetTopSalesPeople()
                                    select new
                                    {
                                        Modified = string.Format("Modified on " + p.ModifiedDate.ToShortDateString())
                                    };

            foreach (var person in topSalesPeople)
                Console.WriteLine(person.Modified);
        }
    }

Pretty straight forward code right? You simply want to tell the consumer when the top sales people were last modified (date/time). Running the above code results in the following exception;

<pre>An unhandled exception of type 'System.NotSupportedException' occurred in mscorlib.dll

Additional information: LINQ to Entities does not recognize the method 'System.String Format(System.String, System.Object[])' method, and this method cannot be translated into a store expression.</pre>

Simply put, there is not a T-SQL method thats mapped to `String.Format`. This problem does not exist when your repository returns `IEnumerable` because the query is ran in memory against the dataset rather by ran by the query provider. On a final note, you could return the entire dataset as `IEnumerable` as follows;

    public IEnumerable<SalesPerson> GetTopSalesPeople()
    {
        return _context.SalesPersons;
    }

Keep in mind though, that this will cause the entire dataset to be returned and stored in memory, which will probably be expensive in terms of CPU time and Memory usage.

### **Summary**

`IQueryable` works to translate your code into the most efficient queries it can, and for the most part it does a great job. When working with the repository/unit of work pattern, you should think very hard about returning `IQueryable` to your consuming code, because this results in boundary bleed and can also result in exceptions, as each query interpreter cannot translate every single expression you throw at it. [Download the source code](https://dl.dropboxusercontent.com/u/14543010/Demystified.zip "Download source code").