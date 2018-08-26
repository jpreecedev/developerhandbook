---
layout: post
title: WPF MVVM IoC containers - Part 1 of 2
date: 2013-07-26
tags: ["c#","dependency injection","ioc","mvvm","structuremap","wpf","WPF MVVM"]
---

The ultimate goal of MVVM is to achieve true separation of concerns, meaning that the various elements of your project know nothing about each other.  It's virtually impossible to achieve this in an elegant way in WPF without some outside help. For example, how to you tie the view model to a view?  Here are some ideas that spring to mind; 1) You could set the data context directly in the view;

    <Window.DataContext>
        <local:MainWindowViewModel />
    </Window.DataContext>

2) You could set the data context in the views code behind file;

    public partial class MainWindow : BaseWindow
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainWindowViewModel();
        }
    }

3) Or you could set the data context when the view is instantiated;

    View = new MainWindow();
    View.DataContext = new MainWindowViewModel();

    View.ShowDialog();

The problem with the first approach is that you are creating a relationship between the view and the view model. Admittedly its a dynamic relationship, but, a relationship none the less.  This is contrary to the MVVM concept. The second approach adds code behind, which is basically banned in MVVM, and the third approach would result in your writing lots of code that will become unmaintainable over time.

### Dependency Injection

Dependency injection is the idea that instances of required objects will be passed in to the class at some point.  I say some point because this could be via the constructor or through lookups (usually on getters/setters of public properties). Constructor injection;

    public class MainWindowViewModel
    {
        public MainWindowViewModel(Window mainWindow)
        {
            MainWindow = mainWindow;
        }

        public Window MainWindow { get; set; }
    }

    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            MainWindow = new MainWindow();
            MainWindow.DataContext = new MainWindowViewModel(MainWindow);
            MainWindow.ShowDialog();
        }
    }

Constructor injection is a step in the right direction, but taking this approach will become unmaintainable over time as the application grows.  This is where IoC containers really come into their own.

### A better way - Inversion of Control containers

Inversion of Control (IoC) containers take over the responsibility of two important aspects of your code; managing instances of your views/view models, and performing dependency injection automatically. There are many IoC containers available to use within your .NET applications.  I personally have worked directly with two; the [Unity Application Block from the Microsoft Patterns and Practices library](http://unity.codeplex.com/ "Unity Application Block"), and [Structure Map](http://docs.structuremap.net/ "Structure Map").  There are lots of blog posts that compare the intricacies of these containers, and many more, so I won't try and re-invent the wheel.  There is a [very good post on ElegantCode.com](http://elegantcode.com/2009/01/07/ioc-libraries-compared/ "IoC Libraries Compared") that goes in to a good level of detail. For the remainder of this blog post and the next in the series, we will focus on Structure Map - as its lightweight, quick to get started with, and highly configurable.

### **Structure Map - A crash course**

Getting started with Structure Map in Visual Studio 2010/2012 has never been easier, thanks to NuGet.  Fire up the package manager console and run the following command;

    install-package StructureMap

This will go and fetch the latest version of StructureMap, and add the appropriate references to your project (StructureMap.dll).

### Bootstrapper

Start by creating a bootstrapper class.  A bootstrapper class is just a simple class that will initialise our IoC container, and tell it about the types in our project.

    public static class Bootstrapper
    {
        public static void Initialise()
        {
            ObjectFactory.Initialize(x =>
            {
                x.For<IMainWindow>().Use<MainWindow>();
                x.For<IMainWindowViewModel>().Use<MainWindowViewModel>();
            });
        }
    }

Structure map has a kind of [fluent API](http://en.wikipedia.org/wiki/Fluent_interface "Fluent API") that basically describes to us what its doing. When a request is made for an instance of IMainWindow, the concrete type MainWindow is served up. Same goes for our view model.  Whenever you want instances of an object to be automatically managed for you, you must add them to this initialisation method. Lets revisit the constructor injection example from earlier. First though, we need to make sure we call the Initialise() method on our bootstrapper. A good place for this would be in the constructor for our application.

    public App()
    {
        Bootstrapper.Initialise();
    }

<span style="line-height:1.5;">Now, instead of creating instances of our objects directly, we make a call to the container and request an instance.</span>

    protected override void OnStartup(StartupEventArgs e)
    {
        IContainer container = ObjectFactory.Container;

        MainWindow = (Window)container.GetInstance<IMainWindow>();
        MainWindow.DataContext = container.GetInstance<IMainWindowViewModel>();
        MainWindow.ShowDialog();
    }

`ObjectFactory` is simply a static wrapper around our container.  Its important to note that accessing instances of objects via the [ObjectFactory within your view models is considered an anti-pattern](http://docs.structuremap.net/AutoWiring.htm "Structure Map - ObjectFactory Anti-pattern").  We will look at how to avoid this in the subsequent post.

### Summary

In this short post we have discussed what Dependency Injection is, and how a Inversion of Control (IoC) container goes a step further. An IoC container manages the instances of our objects automatically for us, and can take responsibility for injecting instances of any object that it knows about into the constructor of our view models. In the next post, we will look at fully implementing IoC containers in a WPF MVVM application. [Download source code](https://dl.dropboxusercontent.com/u/14543010/DI.zip "Download Source Code")