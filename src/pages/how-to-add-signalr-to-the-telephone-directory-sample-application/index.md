---
layout: post
title: How to add SignalR to the telephone directory sample application
description: As part of a mini series we created a very simple telephone directory web page that showed features of Bootstrap, Knockout, jQuery, Web API and Entity Framework. 
date: 2014-03-15
categories: ['.NET']
tags: ['.NET', 'c#', 'html', 'javascript', 'signalr']
---

As part of a recent mini series we created a very simple telephone directory web page that showed some features of Bootstrap, KnockoutJS, jQuery, Web API and the Entity Framework. Just for fun, I figured it would be cool to add SignalR so that we could see how simple it is to add full duplex, real time communications to your website.

The first parts of the mini series can be found here;

[/dot-net/create-a-telephone-directory-with-bootstrap-knockoutjs-jquery-web-api-and-entity-framework-part-1-of-2/](/dot-net/create-a-telephone-directory-with-bootstrap-knockoutjs-jquery-web-api-and-entity-framework-part-1-of-2/ '/dot-net/create-a-telephone-directory-with-bootstrap-knockoutjs-jquery-web-api-and-entity-framework-part-1-of-2/')

[/dot-net/create-a-telephone-directory-with-bootstrap-knockoutjs-jquery-web-api-and-entity-framework-part-2-of-2/](/dot-net/create-a-telephone-directory-with-bootstrap-knockoutjs-jquery-web-api-and-entity-framework-part-2-of-2/ '/dot-net/create-a-telephone-directory-with-bootstrap-knockoutjs-jquery-web-api-and-entity-framework-part-1-of-2/')

This post is a continuation of the original project. You can find the entire source code over on [GitHub](https://github.com/jpreecedev/telephonedirectory).

## Add SignalR using NuGet

At the time of writing, you have to be a little careful when installing the SignalR NuGet package. We'll install and setup SignalR the way it is supposed to be done, and then we will fix a problem that we encounter at the end. First, open the Telephone Directory project, and install SignalR using the Package Manager Console;

```powershell
install-package Microsoft.AspNet.SignalR
```

SignalR has a dependency on **Microsoft.Owin**, which will be installed automatically for you. Add a new item to your project using the **OWIN Startup Class** template, call the file **Startup.cs** and add the following code;

```csharp
using Microsoft.Owin;
[assembly: OwinStartup(typeof(TelephoneDirectory.Startup))]
namespace TelephoneDirectory {
 using Owin;
 public class Startup {
  public void Configuration(IAppBuilder app) {
   app.MapSignalR();
  }
 }
}
```

At this point you _should_ be able to run your application. Granted, not much (other than the standard functionality) should happen. However, if you try this now you will receive the following error message;

<blockquote>
An exception of type 'System.IO.FileLoadException' occurred in Microsoft.AspNet.SignalR.Core.dll but was not handled in user code Additional information: Could not load file or assembly 'Microsoft.Owin, Version=2.0.1.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35' or one of its dependencies. The located assembly's manifest definition does not match the assembly reference. (Exception from HRESULT: 0x80131040)
</blockquote>

This is because the dependency resolver has brought down the wrong version of Microsoft.Owin.Security. To fix the problem, run the following command in the Package Manager Console;

```powershell
install-package Microsoft.Owin.Security -Version 2.1.0
```

If you run the application again, the problem should be resolved.

## Create a Hub

This tutorial assumes that you have at least a little bit of knowledge about how SignalR works. All you basically need to do is create a new class that inherits from **Microsoft.AspNet.SignalR.Hub**, and any methods you add to your hub will be accessible from your JavaScript code. There are two methods we need to add, one to tell other connected clients that an entry (an entity) has been added or updated, and another to notify that an entity has been deleted. Create a new Hub called **EntryHub** (I created a new folder called **Hubs**) and add the following methods;

```csharp
public class EntryHub: Hub {
 public void AddOrUpdate(TelephoneEntry telephoneEntry) {
  Clients.All.addOrUpdate(telephoneEntry);
 }

 public void Delete(TelephoneEntry telephoneEntry) {
  Clients.All.delete(telephoneEntry.Id);
 }
}
```

## Add SignalR to your client JavaScript

You reference SignalR by adding the following scripts to your page (or bundle);

```html
<script src="Scripts/jquery.signalR-2.0.2.min.js"></script>
<script src="signalr/hubs"></script>
```

Ensure that these scripts are positioned before **index.js**, so we avoid any issues going forward. Open up **index.js**, and grab a reference to the hub you created earlier as follows (add this into the `TelephoneViewModel` underneath your existing properties);

```javascript
var hub = $.connection.entryHub
```

We are referencing the hub as a variable because we only want it to be accessible to our view model (not the view as we want to maintain separation of concerns). Now at the end of the view model, just before we call **load**, open a connection to the server;

```javascript
$.connection.hub.start()
```

You're now ready to being sending and receiving data.

### Send data to the server

To send data to the server, you simply need to call the hub method you created earlier. Update the post method as follows;

```javascript
self.post = function(telephoneEntry) {
  $.post('/api/Data/', telephoneEntry, function(id) {
    telephoneEntry.id = id

    hub.server.addOrUpdate(telephoneEntry)
  })
}
```

When we create a new entity and after it has been saved by the Web API, we send it to our SignalR hub to tell other connected clients that an entity has been added.

### Receive data from the server

Receiving data from the server is equally simplistic. You use the method signature of the method you added to your hub. Add the following;

```javascript
hub.client.addOrUpdate = function(telephoneEntry) {}
```

SignalR will invoke this method every time the corresponding server method is invoked. Flesh out the method as follows;

```javascript
hub.client.addOrUpdate = function(telephoneEntry) {
  var result = $.grep(self.telephoneEntries(), function(entry) {
    return entry.id == telephoneEntry.id
  })

  if (result.length == 0) {
    self.telephoneEntries.push(telephoneEntry)
  } else {
    self.telephoneEntries.replace(result[0], telephoneEntry)
  }
}
```

As we have a single method for adding and updating, we need to determine which action we need to take. I have used the jQuery `grep` method to search the `telephoneEntries` array looking for a matching ID. If there are no matches, we add the entity and if there are matches we update the existing entity. Add the following code to respond to the delete method;

```javascript
hub.client.delete = function(id) {
  var result = $.grep(self.telephoneEntries(), function(entry) {
    return entry.id == id
  })

  if (result.length > 0) self.telephoneEntries.destroy(result[0])
}
```

The hub method passes us just the entity Id to reduce bandwidth. Run the program now, try adding an entity. You will encounter an error;

> Uncaught ReferenceError: Unable to process binding "text: function (){return number }" Message: number is not defined

## One more thing... camelCase

Generally, and I believe this is a best practice, JavaScript variables/properties are camel cased (camelCase). Normally, C# properties are title cased (TitleCase). So when SignalR does its magic and sends your entity from the server to the client, your entities property names are in title case, so your JavaScript won't quite match up. One way to fix this issue in to use the **JsonProperty** attribute, which is used to specify the name to give the property when serialization takes place. Update the `TelephoneEntry` entity as follows;

```csharp
public class TelephoneEntry {
 [JsonProperty("firstName")]
 public string FirstName {
  get;
  set;
 }

 [JsonProperty("id")]
 public int Id {
  get;
  set;
 }

 [JsonProperty("lastName")]
 public string LastName {
  get;
  set;
 }

 [JsonProperty("number")]
 public string Number {
  get;
  set;
 }

}
```

Hopefully everything should now be working as expected.

## Summary

SignalR is a fantastically powerful, lightweight library that gives us full duplex, real time communication in a multi-client environment. You can use NuGet to install SignalR, create a hub with your methods to be exposed to the clients, and consume those methods in a simple manner. There are a couple of quirks you have to workaround (hopefully these will be resolved in future releases), but basically you can get it up and running in minutes, adding a new layer of interactivity to your website.
