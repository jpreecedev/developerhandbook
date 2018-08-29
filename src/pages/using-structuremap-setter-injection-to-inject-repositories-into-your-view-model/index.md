---
layout: post
title: Using StructureMap setter injection to inject repositories into your View Model
date: 2013-08-09
categories: ['WPF MVVM']
tags: ['c#', 'dependency injection', 'ioc', 'mvvm', 'structuremap', 'wpf', 'WPF MVVM']
---

This short post is a follow on from an earlier series of posts that discussed how to achieve MVVM purity in WPF using Structure Map. You may want to check out those posts first before reading this post. However, if you just generally want to know how to do setter injection using Structure Map, you are in the right place!

### A Scenario

It is very common in modern applications to have a repository that does the job of retrieving and saving data from/to your database. Your repository may look like this;

```csharp
public interface IRepository<T> {
 int Count {
  get;
 }
}
public class CustomersRepository: IRepository<Customer> {
 private readonly Random _random = new Random();

 public int Count {
  get {
   return _random.Next(3, 10);
  }
 }
}
```

In the above sample we are simulating retrieving the number of customers that currently exist in our database. Our view model logic may look something like this;

```csharp
public class ChildViewModel: BaseViewModel, IChildViewModel {
 public ChildViewModel(IChildView view, IContainer container): base(view, container) {}

 public IRepository<Customer> CustomersRepository {
  get;
  set;
 }

 public int CustomerCount {
  get;
  set;
 }

 public override void Load() {
  CustomerCount = CustomersRepository.Count;
 }
}
```

When the view model has finished loading, we want to retrieve the number of customers from the repository and display this number to the user. How do we get an instance of `CustomersRepository`? Well there are two approaches, this is the first;

```csharp
public override void Load() {
 CustomersRepository = ObjectFactory.GetInstance<IRepository<Customer>>();
 CustomerCount = CustomersRepository.Count;
}
```

You can use the static `ObjectFactory.GetInstance()` method to get an instance of the repository and set the public property to that value. Don't get me wrong, this approach works... but it is widely considered to be an anti-pattern. The second approach is to use setter injection, which basically means that StructureMap will inject a value for that property automatically for you at runtime, so that you don't have to worry about it.

### Bootstrapper

All StructureMap based applications begin with a bootstrapper. Your bootstrapper class will typically be a public static class that calls the `ObjectFactory.Initialise()` method passing an `IInitializationExpression` object. We will need to add our repository to the container so that it can be used thoughout the application;

```csharp
public static class Bootstrapper {
 public static void Initialise() {
  ObjectFactory.Initialize(OnInitialise);
 }

 private static void OnInitialise(IInitializationExpression x) {
  //Omitted for brevity

  //Add the repository
  x.For<IRepository<Customer>>().Use<CustomersRepository>();

  //Tell StructureMap to automatically inject an instance, whenever it comes across a public property of type IRepository<Customer>
  x.SetAllProperties(y => y.OfType<IRepository<Customer>>());
 }
}
```

To make StructureMap take care of the setter injection for us, we simply needed to call the `SetAllProperties` method. When StructureMap resolves an instance of our view model (or any class for that matter), it inspects it, identifies all the public properties in that class, and looks inside the container to see if it has any matching instances. If it does, it simply injects them for us.

### Summary

We can use StructureMap to inject instances of objects into the public properties on our view models simply by calling the `SetAllProperties` method when initialising the container and telling it what type we want injecting.
