---
layout: post
title: WPF MVVM For WinForms Devs - Part 4/5
description: The purpose of this series of tutorials is to introduce the Model-View-ViewModel (MVVM) design pattern, and look at how to correctly implement it in an Windows Presentation Foundation (WPF) application.
date: 2013-06-29
categories: ['WPF MVVM', 'C#', '.NET']
group: 'Software Development'
---

The purpose of this series of tutorials is to introduce the Model-View-ViewModel (MVVM) design pattern, and look at how to correctly implement it in an Windows Presentation Foundation (WPF) application. This series is targeted at developers of all levels, but especially at developers who are looking to make the transition from Windows Forms to WPF.

### Events in Windows Forms applications

Assuming you have come from a Windows Forms background, regardless of what design patterns (if any?) you used, there is a good chance you are familiar with doing either or both of the following;

Double click a control (for example a button) to generate the event handler in the code behind;

```csharp
private void button1_Click(object sender, EventArgs e) {}
```

or subscribe to the click event in the constructor, as follows;

```csharp
public Form1() {
 InitializeComponent();
 button1.Click += button1_Click;
}

private void button1_Click(object sender, EventArgs e) {}
```

Well, as you know code behind is not permitted in MVVM, so where do we go from here? Well events _pretty much_ don't exist in MVVM. This is quite a bold statement, but in reality you will very rarely need to subscribe to and unsubscribe from events in the _traditional_ way. This is somewhat of an over-generalisation because when you come to design user controls, you inevitably end up hooking into events as code behind is allowed in this scenario... and it can be "just easier" to subscribe to events.

### Prism

We haven't yet spoken about Prism, what it is and why you should care. Prism (also known as the Microsoft Enterprise Library (Aka Patterns & Practices library)) provides lots of out of the box functionality to help make MVVM possible. One feature is the Event Aggregator, which provides a mechanism for weakly subscribing to and unsubscribing from events in a safe way that avoids memory leaks. Prism is out of the scope of this set of tutorials, but I recommend reading the [MSDN documentation](<http://msdn.microsoft.com/en-us/library/ff921122(v=pandp.20).aspx> 'Event Aggregator') on how this works.

### Commands

Commands are the WPF equivalent of reacting to user instigated interactions. Commands are to WPF what Events are to WinForms. Commands can be implemented in ways that make them reusable throughout your entire application, even across modules. There are two approaches to create commands. Firstly, you could create a new class and implement the [ICommand](http://msdn.microsoft.com/en-us/library/ms752308.aspx 'ICommand') interface. The `ICommand` interface exposes the following;

- CanExecute method (returns true if its OK to execute the actual command)
- CanExecuteChanged event handler (controls can and do subscribe to this to determine if the CanExecute value has changed)
- Execute (called when the user actually wants to execute the command)

```csharp
public class ClickCommand: ICommand {
#region ICommand Members
  public event EventHandler CanExecuteChanged;

  public bool CanExecute(object parameter) {
    return true;
  }

  public void Execute(object parameter) {
    MessageBox.Show("Clicked");
  }
 #endregion
}
```

This command will normally be used with UI elements by binding it to the `Command` property, which is available on many user input controls. So that we can bind from our UI, add a property to your view-model of type `ClickCommand`; (don't forget to initialise the command in the constructor!)

```csharp
public MainWindowViewModel() {
 ClickCommand = new ClickCommand();
}
public ClickCommand ClickCommand {
 get;
 set;
}
```

We can now bind this command to a control on our UI, in this case a Button;

```xml
<button Content="Save"
        Command="{Binding ClickCommand}" />
```

This is a good approach, but imagine this scenario; You are creating a medium sized/large application that has lots of views/view-models. You want to add a Save button to various views which, when clicked, persists some data to a database. The actual data saved will vary between view-models. Well a single `ClickCommand` isn't going to help you here, because the code is too generic.

### DelegateCommand and RelayCommand

`DelegateCommand` and `RelayCommand` are openly available, generic implementations of `ICommand`. These implementations are not (yet!) implemented in the .NET framework... so fire up your favourite search engine and you should be able to find a wide variety of implementations for both. Here is a simple version of `DelegateCommand` that I sometimes use. Notice that this example is not generic, meaning you have to cast from object to your target type. There are generic implementations widely available.

```csharp
public class DelegateCommand: ICommand where T: class {
 protected bool _isEnabled = true;
 private readonly Action _execute;
 private readonly Predicate _canExecute;

 public event EventHandler CanExecuteChanged;

 public DelegateCommand(Action execute, Predicate canExecute = null) {
  _execute = execute;
  _canExecute = canExecute ?? (t => _isEnabled);
 }

 public bool CanExecute(object parameter) {
  return _canExecute((T) parameter);
 }

 public void Execute(object parameter) {
  _execute((T) parameter);
 }

 public void RaiseCanExecuteChanged() {
  var handler = CanExecuteChanged;
  if (handler != null) {
   handler(this, EventArgs.Empty);
  }
 }

}
```

Your view-model would look something like this;

```csharp
public class MainWindowViewModel: BaseViewModel {
 private string _myString;

 public DelegateCommand<object> ClickCommand {
  get;
  set;
 }

 public MainWindowViewModel() {
  ClickCommand = new DelegateCommand<object>(OnClick, CanClick);
 }

 public string MyString {
  get {
   return _myString;
  }
  set {
   _myString = value;
   OnPropertyChanged();
   ClickCommand.RaiseCanExecuteChanged();
  }
 }

 private void OnClick(object parameter) {
  MessageBox.Show("You clicked the button!");
 }

 private bool CanClick(object parameter) {
  return !string.IsNullOrEmpty(MyString);
 }
}
```

It becomes the responsibility of the view-model to decide what to do when the user clicks the button on your UI. To bind a button to the command, add a button as follows;

```xml
<Button Content="Click Me!" Command="{Binding ClickCommand}"/>
```

### Summary

Unlike WinForms, there is not much of a concept of events in WPF. You could use the `EventAggregator`, which is part of the Enterprise Library from Microsoft, to subscribe to and unsubscribe from events in a weak way (a way that prevents memory leaks). Instead, we use commands, which enable use to write code that is highly reusable across our applications. Generic implementations of commands, such as `DelegateCommand` and `RelayCommand`, enable us to tailor code to specific view-models where appropriate.
