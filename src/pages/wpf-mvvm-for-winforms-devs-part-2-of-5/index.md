---
layout: post
title: WPF MVVM For WinForms Devs - Part 2/5
date: 2013-06-15
tags: ["c#","mvvm","wpf","WPF MVVM"]
---

The purpose of this series of tutorials is to introduce the WPF MVVM (Model-View-ViewModel) design pattern, and look at how to correctly implement it in an Windows Presentation Foundation (WPF) application. This series is targeted at developers of all levels, but especially at developers who are looking to make the transition from Windows Forms to WPF.

### **How to quickly implement MVVM in your C# WPF application**

Start by firing up an instance of your favourite version of Visual Studio (free or paid) and create a new WPF application, call it CustomerPortal.

[![VS Create Project Dialog](https://developerhandbook.com/wp-content/uploads/2013/05/vssavedialog1.jpg)](vssavedialog1.jpg)

Add a new class to your project, called Customer.  This will be your model class.  Add the following code; [code language="csharp"] public class Customer { public int Id { get; set; } public string FirstName { get; set; } public string LastName { get; set; } public DateTime DateOfBirth { get; set; } } [/code] <span style="line-height: 1.5;">Now create your view model class...remembering that the view-model is responsible for presenting the data within the model to the view.  Add the following code;</span> [code language="csharp"] public class MainWindowViewModel { public MainWindowViewModel() { Customer = new Customer { DateOfBirth = DateTime.Parse("1970-01-01"), FirstName = "Jon", LastName = "Preece", Id = 1 }; } public Customer Customer { get; set; } public string FullName { get { if (Customer == null) return string.Empty; return string.Format("{0}, {1}", Customer.LastName.ToUpper(), Customer.FirstName); } } } [/code] In this example, we are creating an instance of the model directly in the constructor (for simplicity). Typically this information would be retrieved from an external data source. Finally, we need to let the view know about the view-model so that we can display the model data.  Edit the XAML in MainWindow.xaml so that it looks like this; [code language="xml"] <Window.DataContext> <local:MainWindowViewModel /> </Window.DataContext> [/code] If you are unable to compile at this stage, check that the 'local' namespace (xmlns:local) matches the namespace your view-model class sits in. For example: [code language="xml"] xmlns:local="clr-namespace:CustomerPortal" [/code] Finally, we're ready to present the value of our **FullName** property to the user.  Replace the Grid in your view with the following code; [code language="xml"] <StackPanel Margin="10" Orientation="Horizontal"> <TextBlock Text="The customers name: " /> <TextBlock Text="{Binding FullName}" /> </StackPanel> [/code] In the above sample, we have used data binding to retrieve the value of the property FullName from the views data context (our view model). If you run the application, you should now see the following;

[![Main Window](https://developerhandbook.com/wp-content/uploads/2013/05/mainwindow1.jpg)](mainwindow1.jpg)

### **Summary**

We have seen how we can implement the MVVM design pattern in our application with very little effort.  We've seen the role played by the view-model. We have not yet discussed how we get data back from the view to the model and the role of change notifications.  We will explore these topics and more in the next post. [![Download](https://developerhandbook.com/wp-content/uploads/2013/05/downloadicon1.png)](downloadicon1.png)  [Download Source Code](https://dl.dropboxusercontent.com/u/14543010/CustomerPortal.zip "Download Source Code")