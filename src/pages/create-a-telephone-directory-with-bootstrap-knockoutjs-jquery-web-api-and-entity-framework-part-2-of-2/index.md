---
layout: post
title: Create a telephone directory with Bootstrap, KnockoutJS, jQuery, Web API and Entity Framework (Part 2 of 2)
date: 2014-03-12
categories: ['.NET']
tags:
  [
    '.NET',
    'bootstrap',
    'css',
    'entity framework',
    'html',
    'jquery',
    'knockoutjs',
    'web api',
  ]
---

I find that the best way to learn any new technology, or technology that are unfamiliar with, is to sit down and practice. The purpose of this very simple tutorial is to learn the basics of creating a single page website that can be used to capture peoples names and telephone numbers. By following this tutorial you will learn;

1.  How to use Bootstrap to create a simple UI
2.  How to use KnockoutJS for binding to/displaying of your data
3.  How to use jQuery to asynchronously retrieve data from a web service
4.  How to create a simple Web API using C#/ASP .NET
5.  How to persist data using Entity Framework code first

This is part 2 of 2. You can read the first part here.

## Create the UI

Our user interface has several jobs to do;

- It must look good (Bootstrap to the rescue here)
- It must allow the user to enter their name and number
- It must allow the user to submit their details to the server
- It must allow the user to reset the data
- It must allow the user to edit and delete existing entries

What we don't want is we don't want to see the page refresh. This is going to be such a simple page that the act of refreshing the entire page will feel clunky (not to mention the additional overhead of contacting the server to retrieve our entities again). To aid this, we will use KnockoutJS, which provides JavaScript bindings out of the box. You have already created the basic structure of your web page, add the following code to the body to create the basic design;

```html
<div class="container-narrow">
    <div class="row">
        <h1>Telephone Directory</h1>
    </div>
    <div class="row shaded padded">
        <div class="col-sm-3">
            <label for="firstName">First Name</label>
            <input id="firstName" name="firstName" type="text" class="form-control" required="required" />
        </div>
        <div class="col-sm-3">
            <label for="lastName">Last Name</label>
            <input id="lastName" name="lastName" type="text" class="form-control" required="required" />
        </div>
        <div class="col-sm-3">
            <label for="phoneNumber">Phone Number</label>
            <input id="phoneNumber" name="phoneNumber" type="text" class="form-control" required="required" />
        </div>
        <div class="col-sm-12">
            <button id="add" name="add" type="submit">Add</button>
            <button id="reset" name="reset" type="reset">Reset</button>
        </div>
    </div>
</div>
<div class="container-narrow">
    <div class="row">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone Number</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><span></span></td>
                    <td><span></span></td>
                    <td><span></span></td>
                    <td>
                        <a href="#">Edit</a>&nbsp;<a href="#">Delete</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
```

Also, you should update your **site.css** file to include a few styles, as follows;

```css
.shaded {
  background-color: #f9f9f9;
  border-radius: 15px;
}
.padded {
  padding: 10px;
}

.container-narrow {
  max-width: 700px;
  margin: 25px auto 0 auto;
}

.container-narrow > .row > h1 {
  margin-bottom: 20px;
}

.container-narrow > .row > .col-sm-12 {
  margin-top: 15px;
  margin-bottom: 5px;
}
```

Note that discussion about Bootstrap is generally out of scope of this tutorial, but basically we have used Bootstrap to create a container (a narrow one) with a couple of rows and a few columns to get the layout we desire. We have also included a little custom CSS to add some shading, and margins. We also have a couple of empty spans, which are currently working as placeholders, which will be used to display data about each of our entities.

## Create a view model using KnockoutJS

With our UI (view) now in place, we now need a view model. The purpose of the view model will be to send requests to/receive requests from our Web API, and relay the information to the user.

Open **index.js** and add the following code;

```javascript
/// <reference path="jquery-1.9.0.intellisense.js" />
/// <reference path="knockout-3.1.0.debug.js" />
function TelephoneEntry(data) {}

function TelephoneViewModel() {
  var self = this

  self.add = function() {}
  self.edit = function(telephoneEntry) {}
  self.delete = function(telephoneEntry) {}
  self.reset = function() {}
  self.load = function() {}

  self.post = function(telephoneEntry) {}
}
ko.applyBindings(new TelephoneViewModel())
```

Note that the **references** at the top of the file are cues to Visual Studio IntelliSense, and aren't strictly required (although they do make life a lot easier).

We have some functions here for performing certain actions (which are hopefully self explanatory). The view model gets bound to the view at at the end, and using some funky syntax (which we will see later) we can access the properties/methods on our view model very simply.

### Observable properties

An observable property in KnockoutJS is similar to that in WPF. Basically when the value of an observable property changes, a change notification is raised, which causes the value of the property on the view to be refreshed. Add the following observable properties to the view model (under `var self = this;`). (this defines each property, and sets a default value)

```javascript
self.id = ko.observable(0)
self.firstName = ko.observable('')
self.lastName = ko.observable('')
self.number = ko.observable('')
```

And at the very end of the view model, under all the methods we have defined, add the following;

```javascript
self.telephoneEntries = ko.observableArray([])
self.load()
```

An observable array raises change notifications when items are added to it/removed from it. It does not raise change notifications where the entities themselves are changed (a common misunderstanding).

### Add a new telephone entry

We want to capture the details entered by the user on the form, and display them in a list so they can easily be read back (and persist the data back to the database, more on this later). Update the **TelephoneEntry** class to store the basic properties of each entity (you may notice this class is identical to that you created for Entity Framework earlier);

```javascript
function TelephoneEntry(data) {
  var self = this
  self.id = data.id
  self.firstName = data.firstName
  self.lastName = data.lastName
  self.number = data.number
}
```

Now update the add method to add the new entity, as follows;

```javascript
self.add = function() {
  var entry = new TelephoneEntry({
    id: self.id(),
    firstName: self.firstName(),
    lastName: self.lastName(),
    number: self.number()
  })
  self.telephoneEntries.push(entry)
}
```

### Add bindings to the view

Switch back to the view. We can now use Knockout bindings to bind the properties we just created on our view model to our text fields, and our placeholder spans that we created earlier. To specify a binding, we simply use the **data-bind** attribute on whatever elements we desire.

Locate the **firstName** input field and add the **data-bind** attribute, as shown;

```html
<input id="firstName" name="firstName" type="text" class="form-control" data-bind="value: firstName" required="required" />
```

We have used a **value** binding here with the property **firstName**. This means that we want to bind the **value** property of the input field to the **firstName** property on our view model. Go ahead and update the other input fields, as shown;

```html
<input id="lastName" name="lastName" type="text" class="form-control" data-bind="value: lastName" required="required" />
<input id="phoneNumber" name="phoneNumber" type="text" class="form-control" data-bind="value: number" required="required" />
```

Next, we want to bind the **click** event of our **Add** button to the **add** method on our view model. Can you guess how this might work? See the code below to see if you were correct!

```html
<button id="add" name="add" type="submit" data-bind="click: add">Add</button>
```

KnockoutJS is very powerful, flexible and pretty easy to use, wouldn't you agree?

We're almost there, but first we need to update our table to show a row for each entity in our **telephoneEntries** observable array that we created earlier. For this we need a new binding, the **foreach** binding. Update the **tbody** element, as shown below;

```html
<tbody data-bind="foreach: telephoneEntries">
```

Basically what is going to happen here is that for each entity in our **telephoneEntries** observable array, a **tr** is going to be output. Each **tr** will be bound to its corresponding entity in the array. Use the **text** binding to see the text property for each span placeholder, as shown below;

```html
<tbody data-bind="foreach: telephoneEntries">
  <tr>
      <td>
          <span data-bind="text: firstName"></span>
      </td>
      <td>
          <span data-bind="text: lastName"></span>
      </td>
      <td>
          <span data-bind="text: number"></span>
      </td>
      <td>
          <a href="#" data-bind="click: $parent.edit">Edit</a>&nbsp;<a href="#" data-bind="click: $parent.delete">Delete</a>
      </td>
  </tr>
</tbody>
```

I've also added a link for editing and deleting entities, which we'll flesh out later. To access properties/methods on the view model (rather than whatever is in the current context) we use the **$parent** object.

If you run the application now, you should be able to enter a first name, last name and number, click the **Add** button and see a new row added to the table underneath. Lets now wire up the rest of the functionality.

Add some new properties to you view model, as follows;

```javascript
self.addText = ko.observable('Add')
self.resetText = ko.observable('Reset')
self.selectedIndex = -1
```

These will be used for the add/update methods to determine which is which. Now update the add method so that it can determine weather it should perform an add, or an update, as shown;

```javascript
self.add = function() {
  var entry = new TelephoneEntry({
    id: self.id(),
    firstName: self.firstName(),
    lastName: self.lastName(),
    number: self.number()
  })
  if (self.addText() == 'Add') {
    self.telephoneEntries.push(entry)
  } else {
    var oldTelephoneEntry = self.telephoneEntries()[self.selectedIndex]
    self.telephoneEntries.replace(oldTelephoneEntry, entry)
  }
  self.post(entry)
  self.reset()
}
```

Next, update the edit method to allow editing of each entry. The method simple reads out the given entity (provided by the context aware aspect of KnockoutJS) and populates the publicly bound properties with those values;

```javascript
self.edit = function(telephoneEntry) {
  self.id(telephoneEntry.id), self.firstName(telephoneEntry.firstName)
  self.lastName(telephoneEntry.lastName)
  self.number(telephoneEntry.number)
  self.addText('Update')
  self.resetText('Cancel')
  self.selectedIndex = self.telephoneEntries.indexOf(telephoneEntry)
}
```

The delete method is quite simple, all we have to do is remove the entity (again given to us by KnockoutJS from the telephoneEntries observable array);

```javascript
self.delete = function(telephoneEntry) {
  self.telephoneEntries.destroy(telephoneEntry)
}
```

Update the reset method, which will allow the user to clear down the form (and we will call this too when performing certain operations);

```javascript
self.reset = function() {
  self.id(0)
  self.firstName('')
  self.lastName('')
  self.number('')
  self.addText('Add')
  self.resetText('Reset')
  self.selectedIndex = -1
}
```

You will need to update the Add/Reset buttons on your view to include the **addText** and **resetText** properties, so that we can perform the appropriate actions when editing/adding;

```html
<button id="add" name="add" type="submit" data-bind="click: add, text: addText">Add</button>
<button id="reset" name="reset" type="reset" data-bind="click: reset, text: resetText">Reset</button>
```

## Communication with the Web API using jQuery

The application should now be completely usable (just a reminder, the full source code in on [GitHub](https://github.com/jpreecedev/telephonedirectory) if you are struggling). You may notice, however, that if you refresh the page all your data that you have meticulously typed out has been lost. We need to make use of that Web API that we created earlier to store our data across page loads. The quickest and easiest way to do this is with jQuery.

To achieve what we require here, we need to make use of the jQuery getJSON, Post and AJAX methods.

Update the load method as follows;

```javascript
self.load = function() {
  $.getJSON('http://localhost:62129/api/Data/', function(data) {
    $.each(data, function(index, item) {
      self.telephoneEntries.push(
        new TelephoneEntry({
          id: item.id,
          firstName: item.firstName,
          lastName: item.lastName,
          number: item.number
        })
      )
    })
  })
}
```

We call the Web API using the getJSON method. This passes a ContentType of application/JSON header under the hood to ensure that the server responds in that format. When the process is complete, it calls our callback function, passing the retrieved data in as the **data** parameter. Its then a simple case of iterating over the resulting array and adding each entity to our **telephoneEntries** observable array. And because its an observable array, the view (our table) is updated automatically for us.

If you refresh your view, after a second or two (this will take longer the first time) your seed data that you created earlier should appear!

To post a new entity to the Web API, update the **post** method as follows;

```javascript
self.post = function(telephoneEntry) {
  $.post('http://localhost:62129/api/Data/', telephoneEntry, function(id) {
    telephoneEntry.id = id
  })
}
```

The HTTP POST verb will be sent along with the request. Note that the callback for this request might not be what you are expecting. In order to make future edits and deletes, we need the **ID** value for the new entity we just created. Note that when you create a new entity on the client, its ID is unknown, so by default the ID is always 0. When we wrote up the **Post** method on our API earlier, after the new entity is saved, its new entity ID is returned back to us. Again thanks to the observable property provided by KnockoutJS, everything just updates magically for us.

The delete operation is slightly different. Take the following code;

```javascript
self.delete = function(telephoneEntry) {
  self.telephoneEntries.destroy(telephoneEntry)
  $.ajax({
    url: 'http://localhost:54946/api/Data/' + telephoneEntry.id,
    type: 'DELETE',
    contentType: 'application/json;charset=UTF-8',
    data: JSON.stringify({ id: telephoneEntry.id }),
    dataType: 'json'
  })
}
```

We have to explicitly send the DELETE HTTP verb, the Content-Type and a stringified version of the JSON (and the actual data type) along with the request. The reason why is unclear, but failing to do so results in a **500 Internal Server Error**. Interestingly, however, the operation still completes in its entirety. If anybody can explain this to me I'm more than happy to listen.</pre>

</pre>
