---
layout: post
title: C# Writing unit tests with NUnit and Moq
date: 2013-08-30
tags: ["c#","moq","nunit","Unit Testing"]
---

I'm assuming that you have seen the light, and that you are sold on the benefits (and indeed the drawbacks) of unit testing. I have read literally dozens of blog posts, watched many videos, and read several books about unit testing and the various approaches and frameworks. I have worked with several of these frameworks in both small and enterprise level applications, and I have found that (in my opinion at least) NUnit and Moq are great for helping to get simple tests written quickly and to a decent standard. The purpose of this blog post is to get you up and running writing your first unit tests with NUnit and Moq quickly. If you want to go further and learn unit testing in depth using mocking frameworks such as Moq, FakeItEasy and Typemock Isolator, I highly recommend checking out [The Art of Unit Testing: with examples in C#](http://www.amazon.co.uk/gp/product/1617290890/ref=as_li_tf_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=1617290890&linkCode=as2&tag=jprecom-21)![](ir?t=jprecom-21&l=as2&o=2&a=1617290890) by Roy Osherove. [About Moq](https://code.google.com/p/moq/ "Moq")

> Moq (pronounced "Mock-you" or just "Mock") is the only mocking library for .NET developed from scratch to take full advantage of .NET 3.5 (i.e. Linq expression trees) and C# 3.0 features (i.e. lambda expressions) that make it the most productive, type-safe and refactoring-friendly mocking library available. And it supports mocking interfaces as well as classes. Its API is extremely simple and straightforward, and doesn't require any prior knowledge or experience with mocking concepts.

### Getting Moq

Installing Moq these days is a breeze. You can either [download Moq from GitHub](https://github.com/Moq/moq4 "Moq on GitHub") and add the appropriate references to your project, or you can install it using nuget;

<pre>Install-Package Moq</pre>

### Naming your unit tests

How to correctly name your unit tests is always a very controversial topic, and I have seen conversations about this become quite heated in the past. My advice to you would be to name your tests in a way that makes them descriptive. The name should accurately reflect what you are trying to achieve. Don't worry at all about the length on your unit test method signatures, making them descriptive is the important goal here. Some possible naming conventions include; Pascal case;

    public class WhenACustomerIs
    {
       public void AddedAndCustomerIsNullAnExceptionIsThrown()
       {
       }
    }

Each word separated by an underscore;

    public class When_A_Customer_Is
    {
        public void Added_And_Customer_Is_Null_Exception_Is_Thrown()
        {

        }
    }

MethodName_StateUnderTest_ExpectedBehaviour

    public class Customer
    {
        public void Add_CustomerIsNull_ThrowsInvalidOperationException()
        {

        }
    }

Personally, I prefer the latter two approaches. And which one I use largely depends on what project I am working on. Feel free to use whichever you feel most comfortable with, and if you want to come up with your own naming convention, that's fine too.

### Mocking and Verification

A great definition of Mocking from [Wikipedia](http://en.wikipedia.org/wiki/Mock_object "Mock Object");

> In object-oriented programming, mock objects are simulated objects that mimic the behavior of real objects in controlled ways. A programmer typically creates a mock object to test the behavior of some other object, in much the same way that a car designer uses a crash test dummy to simulate the dynamic behavior of a human in vehicle impacts.

Moq provides us with an easy way of creating mock objects;

    Mock<IContainer> mockContainer = new Mock<IContainer>();
    Mock<ICustomerView> mockView = new Mock<ICustomerView>();

To access the actual instance of the object, we can access the `Object` property, which is strongly typed;

    Mock<ICustomerView> mockView = new Mock<ICustomerView>();
    ICustomerView view = mockView.Object;

Moq provides you methods to confirm that particular actions took place on your mock object. For example, you may want to confirm that a method was called, a property getter or setter was called, or that a particular method was called a particular number of times. To verify that a method was called, use the Verify method on the mock object;

    mockCustomerRepository.Verify(t => t.Add(It.IsAny<Customer>()));

The above code tests that the `Add` method was called on the mock repository object, and that it was called with "Any customer". You could tighten this up and say that you want a particular `Customer` object to be passed in by using the `It.Is` method;

    mockCustomerRepository.Verify(t =>; t.Add(It.Is<Customer>(t => t.Name == "Jon")));

### The AAA Syntax (Arrange, Act, Assert)

A very common approach to structuring your unit tests is using the AAA syntax. The AAA syntax is only a way of structuring your unit tests, and is supported by any framework. The basic idea is that you create all the dependencies required by your method under test (Arrange), run your method under test (Act) and verify that the requirements of your test were met (Assert). A simple example;

    [Test]
    public void Save_CustomerIsNotNull_GetsAddedToRepository()
    {
        //Arrange
        Mock<IContainer> mockContainer = new Mock<IContainer>();
        Mock<ICustomerView> mockView = new Mock<ICustomerView>();

        CustomerViewModel viewModel = new CustomerViewModel(mockView.Object, mockContainer.Object);
        viewModel.CustomersRepository = new CustomersRepository();
        viewModel.Customer = new Mock<Customer>().Object;

        //Act
        viewModel.Save();

        //Assert
        Assert.IsTrue(viewModel.CustomersRepository.Count == 1);
    }

### Exceptions

A nice feature provided by the NUnit framework is the ability to test for an exception. To do this, you set up the Arrange and Act parts of your code, and add the `ExpectedException` attribute to your test method;

    [Test]
    [ExpectedException(ExpectedException = typeof(InvalidOperationException))]
    public void When_Adding_Null_Customer_Should_Throw_Invalid_Operation_Exception()
    {
        ICustomerViewModel viewModel = new CustomerViewModel(_mockView.Object, _mockContainer.Object);
        viewModel.CustomersRepository = _mockCustomerRepository.Object;

        //Act
        viewModel.Save();

        //Assert
    }

In the above code sample, if an `InvalidOperationException` is thrown at some point in the test, the test will pass. Otherwise, the test will fail.

### Recursive mocking

Often you will encounter scenarios where you want to Mock complex types on complex types. Moq is smart enough to recognised this and automatically mock nested complex types for you. Take the following situation; Say you have a `Customer` object, which has a complex type of `Address`, which has a complex type of `GeoCoordinate`, which has several properties such as; `Altitude`, `Latitude`, `Longitude` etc. You may want to specify a return value for `Latitude`. Some mocking frameworks would require you to mock each object (Customer, Address, GeoCoordinate), but Moq can deal with this automatically for you. Simply use the `Setup` method as normal;

    mockCustomerRepository.Setup(t => t.Customer.Address.Geocoordinate.Longitude).Returns(13.92);

### Returning different objects each time a method is called

There are many scenarios when you may want to return a different object or value each time a mocked method is called. Say, for example, you are mocking your data access layer and every time the `GetId()` method is called, you want to return a new Id;

    var i = 1;
    _mockCustomerRepository.Setup(t => t.GetId()).Returns(() => i).Callback(() => i++);

The `Returns()` method is called the first time the `GetId()` method is called, when subsequent calls are made, the logic in the `Callback()` is executed.

### Mock Repositories

When you have multiple mock objects in your test, and you have multiple `Setup` methods, your verification code may look something like this;

    mockCustomerRepository.Verify();
    mockView.Verify();
    mockContainer.Verify();
    mockCustomerRepository.Verify();

There is nothing particularly wrong with this code, other than the fact that it is pretty messy. You could use a `MockRepository` to tidy things up;

    [Test]
    public void Customer_Should_Be_Added_To_The_Repository()
    {
        var factory = new MockRepository(MockBehavior.Loose);
        var mockView = factory.Create<ICustomerView>();
        var mockContainer = factory.Create<IContainer>();
        var mockCustomerRepository = factory.Create<IRepository<Customer>>();

        //Arrange
        ICustomerViewModel viewModel = new CustomerViewModel(mockView.Object, mockContainer.Object);
        viewModel.CustomersRepository = mockCustomerRepository.Object;

        //Act
        viewModel.Save();

        //Assert
        factory.Verify();
    }

You can declare the behaviour of each `MockObject` created by the `MockRepository` in the repository constructor, or you can set this by passing in the desired `MockBehavior` to the `MockRepository.Create` method.

### Summary

Moq is a powerful, extremely flexible mocking framework. When used in conjunction with NUnit, you have all the tools you need to write fast, useful unit tests that can improve the reliability of your code.