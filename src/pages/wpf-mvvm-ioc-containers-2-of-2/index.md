---
layout: post
title: WPF MVVM IoC containers - Part 2 of 2
date: 2013-08-02
tags: ["c#","dependency injection","ioc","mvvm","structuremap","wpf","WPF MVVM"]
---

The ultimate goal of MVVM is to achieve true separation of concerns, meaning that the various elements of your project know nothing about each other.  It's virtually impossible to achieve this in an elegant way in WPF without some outside help. You are reading the second part of this blog post where we will discuss how to use an IoC container properly in a WPF MVVM application.  It is assumed you have either read the first post, or are familiar with the concept of IoC/dependency injection with StructureMap.

### Part 0

It's worth noting just before we get started that you will need to invest a little time to get this set up initially.  That investment will pay off almost immediately as your application begins to scale. Please take the time to, if you haven't already, install [PropertyChanged.Fody](http://nuget.org/packages/PropertyChanged.Fody "PropertyChanged.Fody") and [StructureMap](http://nuget.org/packages/structuremap/ "StructureMap") from NuGet.

### **Core Classes**

Start by creating some core classes for use within the rest of your application.  Getting these in a good state early will make architecting the rest of the application a lot easier. I like to have all my classes inherit from a class called BaseNotification, so that I (thanks to PropertyChanged.Fody) get all the change notification functionality added for free to all my derived classes.

    public class BaseNotification : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChangedEventHandler handler = PropertyChanged;
            if (handler != null) handler(this, new PropertyChangedEventArgs(propertyName));
        }
    }

Before we can continue, we must add a couple of interfaces to our Core folder. An interface is needed for the actual View (IView) and the View Model (IViewModel) so that we can maintain loose coupling from the Main Window (described later).

    public interface IView
    {
        object DataContext { get; set; }
    }

    public interface IViewModel
    {
        IView View { get; set; }
    }

Note that each view model will have a reference back to the actual view (which is a user control) so as to make finding controls in the visual tree possible, freeing up the parameter on our delegate/relay commands. Now we need to create our BaseViewModel. Add the following code;

    public class BaseViewModel : BaseNotification, IViewModel
    {
        public BaseViewModel(IView view, IContainer container)
        {
            View = view;
            View.DataContext = this;

            Container = container;
        }

        public IContainer Container { get; set; }

        public IView View { get; set; }
    }

Lets take a second to review what we have here. The constructor is very important as whatever parameters we defined here are going to be injected automatically by the IoC container. We want to pass in an instance of the actual view and a reference back to the IoC container itself. Why? because this gives a means for derived view models to access instances of objects without having to use `ObjectFactory.GetInstance`, which (as previously discussed) is an anti-pattern. Inside the constructor we set the views data context, which is itself, so as to make data binding possible. This removes the direct relationship between the view and the view model, whilst keeping our code neat, maintainable, and adherent to the [DRY principle](http://net.tutsplus.com/tutorials/tools-and-tips/3-key-software-principles-you-must-understand/ "DRY principle"). Now over to the window. In this tutorial we are only going to have a single Window, but typically in larger applications you will have multiple windows so its a good idea to get off on the right foot. We need 2 new interfaces, `IWindow` and `IWindowViewModel`. `IWindow` will represent the Window (MainWindow) and IWindowViewModel is for the windows view model.

    public interface IWindow
    {
        object DataContext { get; set; }
    }

    public interface IWindowViewModel
    {
        IWindow Window { get; set; }
    }

You may have noticed that this is the same set-up as the `IView` and `IViewModel` interfaces. A few seconds ago I was telling you to avoid repetition! What gives?! Well over time the Window and your view models will naturally evolve in different directions, so its a good idea to keep them independent of each other from the start. Now over to the BaseWindowViewModel class, which will act as the data context for your windows;

    public class BaseWindowViewModel : BaseNotification, IWindowViewModel
    {
        public BaseWindowViewModel(IWindow window, IContainer container)
        {
            Window = window;
            Window.DataContext = this;

            Container = container;
        }

        public IView View { get; set; }

        public IContainer Container { get; set; }

        public IWindow Window { get; set; }

        protected void ShowView<T>() where T : IViewModel
        {
            View = Container.GetInstance<T>().View;
        }
    }

Whilst the BaseWindowViewModel is similar to the BaseViewModel class, there are a few subtle differences here. The window is going to display your view within itself. To make this possible, we need a `View` property, which can be of type IView as all our views implement this interface. We also have a `ShowView` method, which retrieves an instance of the view from the container, using the type parameter passed in. So far our code is looking clean and crisp, without a concrete class in sight. This will make unit testing a breeze later on, as mocking/stubs/fakes will now be a lot easier.

### Creating a window

Now that we have the core pieces in place, we can turn our attention to creating a window. The window in this example is going to display a couple of views (one at a time) and navigation will be achieved via some buttons. This is what we're aiming for; [![WPF MVVM Structure Map Main Window](https://developerhandbook.com/wp-content/uploads/2013/06/wpfmvvmstructuremap-mainwindow1.png)](wpfmvvmstructuremap-mainwindow1.png)

When a button is clicked, the corresponding view is displayed whilst displaying details about its data context.

Start by adding two interfaces;

    public interface IMainWindow : IWindow
    {
    }

    public interface IMainWindowViewModel : IWindowViewModel
    {
    }

No need to add additional properties at this stage, but you might want to add them going forward if you are planning on having multiple concrete classes that implement these interfaces, or if you are unit testing. Next, head over to the MainWindow.xaml.cs file and make sure it implements the `IMainWindow` interface;

    public partial class MainWindow : Window, IMainWindow
    {
        public MainWindow()
        {
            InitializeComponent();
        }
    }

Now just add the MainWindowViewModel class, and add the following code;

    public class MainWindowViewModel : BaseWindowViewModel, IMainWindowViewModel
    {
        public MainWindowViewModel(IMainWindow window, IContainer container)
            : base(window, container)
        {
            ShowFirstChildCommand = new DelegateCommand<object>(OnShowFirstChild);
            ShowSecondChildCommand = new DelegateCommand<object>(OnShowSecondChild);
            ExitCommand = new DelegateCommand<object>(OnExit);
        }

        public DelegateCommand<object> ShowFirstChildCommand { get; set; }

        public DelegateCommand<object> ShowSecondChildCommand { get; set; }

        public DelegateCommand<object> ExitCommand { get; set; }

        private void OnExit(object obj)
        {
            Application.Current.Shutdown();
        }

        private void OnShowSecondChild(object obj)
        {
            ShowView<ISecondChildViewModel>();
        }

        private void OnShowFirstChild(object obj)
        {
            ShowView<IChildViewModel>();
        }
    }

Note if you have not previously encountered the DelegateCommand, there are lots of implementations available online. You can download the version I have used [here](https://dl.dropboxusercontent.com/u/14543010/DelegateCommand.cs "Delegate Command"). The constructor here is of critical importance to the whole concept. If you are using a refactoring tool such as ReSharper, please be sure to double check that the constructors first parameter is of type IMainWindow and not IWindow. ReSharper notices that you can use the more generic IWindow, as no properties from IMainWindow are used on the base class. Doing this, however, will result in StructureMap not knowing which type it actually needs to inject. As we added the logic for displaying the actual view in our BaseWindowViewModel, we simply need to call `ShowView()` passing in the type of the view model we actually want to display. (The view that corresponds to the aforementioned view model). Finally, open MainWindow.xaml and replace the existing `Grid` with the `Grid` below;

    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition />
            <RowDefinition Height="Auto" />
        </Grid.RowDefinitions>

        <ContentControl Content="{Binding View}" 
                        Margin="10"/>

        <StackPanel Orientation="Horizontal"
                    Grid.Row="1"
                    VerticalAlignment="Center"
                    HorizontalAlignment="Center">

            <Button Content="Show First Child"
                    Command="{Binding ShowFirstChildCommand}"/>

            <Button Content="Show Second Child"
                    Command="{Binding ShowSecondChildCommand}"/>

            <Button Content="Exit"
                    Command="{Binding ExitCommand}"/>

        </StackPanel>
    </Grid>

We will display our view (which is simply a user control) using a ContentControl. You can make this as elaborate as you like!

### Creating a view

So far we have created our core classes, and created a window. Next we need to add a view to actually display within our window. Add a new user control, call it **ChildView.xaml** and a matching **IChildView.cs** interface. Ensure that the user control implements the IChildView interface, and the IChildView interface implements IView... as shown below;

    public interface IChildView : IView
    {
    }

    public partial class ChildView : UserControl, IChildView
    {
        public ChildView()
        {
            InitializeComponent();
        }
    }

Next, create the ChildViewModel and IChildViewModel classes, as before ensuring that ChildViewModel implements IChildViewModel and IChildViewModel implements IView.

    public interface IChildViewModel : IViewModel
    {
    }

    public class ChildViewModel : BaseViewModel, IChildViewModel
    {
        public ChildViewModel(IChildView view, IContainer container)
            : base(view, container)
        {
        }
    }

As your ChildViewModel is going to inherit from BaseViewModel, as before you will be required to call the constructor of that class. Please ensure you take a second to **double check** that the view parameter is of type IChildView and not IView. Now as an _almost_ final step, go ahead and repeat this step. This time call it SecondChildView.

### Tying it all together

First and foremost, we need to make sure that our IoC container knows about the windows and views that we have just added. Open up (or create) the bootstrapper that we created in the first part of this tutorial and add the following code. Note that I have refactored out the lambda expression for simplicity.

    public static class Bootstrapper
    {
        public static void Initialise()
        {
            ObjectFactory.Initialize(OnInitialise);
        }

        private static void OnInitialise(IInitializationExpression x)
        {
            x.For<IMainWindow>().Singleton().Use<MainWindow>();
            x.For<IMainWindowViewModel>().Singleton().Use<MainWindowViewModel>();

            x.For<IChildView>().Use<ChildView>();
            x.For<IChildViewModel>().Use<ChildViewModel>();

            x.For<ISecondChildView>().Use<SecondChildView>();
            x.For<ISecondChildViewModel>().Use<SecondChildViewModel>();
        }
    }

Notice in the above code, I have included the Singleton() method for the MainWindow and MainWindowViewModel types. This is because, if there are any subsequent requests for an instance of these types, the same instance will get served up every time.

### Finally

All that is left is to retrieve an instance of MainWindow from the container and serve it up to the user. Don't forget to initialise the bootstrapper in the application constructor.

    public App()
    {
        Bootstrapper.Initialise();
    }

    protected override void OnStartup(StartupEventArgs e)
    {
        IMainWindowViewModel window = ObjectFactory.GetInstance<IMainWindowViewModel>();
        MainWindow = (MainWindow) window.Window;
        MainWindow.ShowDialog();
    }

For the sake of completeness, I added a Resource Dictionary with the below style to set some sizing on the MainWindow buttons;

    <Style TargetType="{x:Type Button}">
        <Setter Property="Width"
                Value="125" />
        <Setter Property="Height"
                Value="30" />
        <Setter Property="Margin"
                Value="5" />
    </Style>

### Summary

IoC containers provide a simple and elegant solution to doing dependency injection in a large WPF MVVM application. IoC containers are also responsible for managing the lifetime of our windows/views/view models. Using an IoC container also has a positive side effect of forcing you to structure your classes in a way that promotes unit testing. [Download source code](https://dl.dropboxusercontent.com/u/14543010/WPFMVVMWithStructureMap.zip "IoC Demo Code")