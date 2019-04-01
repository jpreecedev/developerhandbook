---
layout: post
title: How to create a new Outlook 2013 Email using C# in 3 simple steps
description: Working with any part of the Microsoft Office product family from a C# application is hard, but thanks to dynamics and optional parameters the process has dramatically simpler.
date: 2013-12-14
categories: ["C#", '.NET']
featuredImage: ''
---

It has traditionally been quite painful to interact with any part of the Microsoft Office product family from a C# application, but thanks to the introduction of [dynamics](http://msdn.microsoft.com/en-us/library/dd264736.aspx 'Dynamic Keyword in C#') and [optional parameters](http://msdn.microsoft.com/en-us/library/dd264739.aspx 'Optional Parameters') over recent years, the process has dramatically improved.

### Step 1 - Prerequisites and Assembly References

Before doing anything, it is important to note that you must have Microsoft Office 2013 installed for this to work. Seems obvious, but, its still worth mentioning. You also need two references;

```csharp
Microsoft.Office.Core
Microsoft.Office.Interop.Office
```

The quickest way to add these references to your project is to right click on the **References** folder in your project, and click **Add Reference**. The **Reference Manager** dialog window will appear as shown below;

![Reference Manager](referencemanager1.png)

1.  Click the **COM** tab
2.  Type **Outlook** into the search box
3.  Tick **Microsoft Outlook 15.0 Object Library**
4.  Click **OK**

You should now see that the appropriate references have been added to your project;
![References](references1.png)

### Step 2 - Using Directives and Initialization

Next, add the appropriate using directives to your code file.

```csharp
using Microsoft.Office.Interop.Outlook;
using OutlookApp = Microsoft.Office.Interop.Outlook.Application;
```

The second directive is a recommendation to avoid ambiguity with other classes with the name **Application**. In the constructor of your application (or wherever you want this code to go), create an instance of the Outlook Application and create a new `MailItem` object, as shown;

```csharp
OutlookApp outlookApp = new OutlookApp();
MailItem mailItem = outlookApp.CreateItem(OlItemType.olMailItem);
```

### Step 3 - Format and display the email to the user

Finally you can begin to flesh out your email.

```csharp
mailItem.Subject = "This is the subject";
mailItem.HTMLBody = "<html><body>This is the <strong>funky</strong> message body</body></html>";

//Set a high priority to the message
mailItem.Importance = OlImportance.olImportanceHigh;
```

And to display the email, simply call the `Display` method;

```csharp
mailItem.Display(false);
```

There are literally dozens of things you can do to an Outlook Email, including adding attachments, business cards, images, recipient, CC/BCC fields.

### Summary

To create an Outlook 2013 email from C#, simply add the **Microsft Outlook 15.0 Object Library** to your solution, add the appropriate using directives, create a new `Application` object, and `MailItem` object, and flesh out your email. When ready, simply call `MailItem.Display(false)` to show the email to the user. **Please leave a comment below if you found this post useful**
