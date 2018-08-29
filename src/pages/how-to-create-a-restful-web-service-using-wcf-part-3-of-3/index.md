---
layout: post
title: How to create a RESTful web service using WCF (Part 3 of 3)
date: 2014-04-04
categories: ['WCF']
tags: ['c#', 'rest', 'wcf', 'WCF']
---

RESTful (Representational State Transfer) web services use HTTP verbs to map CRUD operations to HTTP methods. RESTful web services expose either a collection resource (representational of a list) or an element resource (representational of a single item in the list). Other parts in this series: [How to create a RESTful web service using WCF (Part 1 of 3)](https://developerhandbook.com/2014/04/02/how-to-create-a-restful-web-service-using-wcf-part-1-of-3/) [How to create a RESTful web service using WCF (Part 2 of 3)](https://developerhandbook.com/2014/04/03/how-to-create-a-restful-web-service-using-wcf-part-2-of-3/)

## Testing the WCF service using Fiddler

If you haven't come across [Fiddler](http://www.telerik.com/fiddler) before, its a very helpful tool for capturing HTTP traffic. Fiddler lets us create HTTP messages and send them to our WCF service, it also shows us the response to our message.

### HTTP GET

We will start by testing the HTTP GET method that we wrote a little earlier (we know for sure that already works). [![execute_thumb2](execute_thumb2_thumb11.png 'execute_thumb2')](https://developerhandbook.com/wp-content/uploads/2014/03/execute_thumb21.png) [![getresponse_thumb2](getresponse_thumb2_thumb1.png 'getresponse_thumb2')](https://developerhandbook.com/wp-content/uploads/2014/03/getresponse_thumb21.png) Open Fiddler, click the **Composer** tab and enter the Url to the web service (the same Url you entered into your web browser earlier). Once done, ensure that GET is selected, and click the **Execute** button (above). The web service should respond after a couple of seconds, and you can see that response by clicking the **Inspectors** tab and clicking **JSON** (shown on the left)

### HTTP POST/PUT

Testing the other HTTP verbs takes a little bit more effort, but not much. Flip back to the **Composer** tab and take the following steps;

1.  Change the HTTP verb from **GET** to **POST**.
2.  Add a **Content-Type: application/json** header
3.  Change the service Url to **/BlogService/Post**
4.  Add the following response body;

```json
    {
      "id": "0",
      "title": "This is a test",
      "url": "https://www.developerhandbook.com"
    }
```

The web service should respond with HTTP status code 200 (OK). Also the web service will return the new blog post, with its Id property set to a proper value (6 in this case). To update the entity, switch the HTTP verb from **POST** to **PUT** (which is Update in RESTful speak)**.** Change the `title` property, and the `Id` property to **6** and click Execute again. Again the web service should return a 200 status code and the entity in JSON format (and again, with the **Id** of 6). The difference between a **POST** and a **PUT** is simple. **POST** should always return a different object than the object you sent it. **PUT** should always return the same object that you send to it. These are the characteristics of a properly implemented RESTful web service.

### HTTP DELETE

Change Fiddler to use the **DELETE** verb. When you do this, the Request Body field in Fiddler will turn red. That's because, usually, no request body is sent along with **DELETE** requests. Delete the request body and change the Url to; [http://localhost:8085/BlogService/Post/6](http://localhost:8085/BlogService/Post/6) Note that we are indicating which resource we want to delete via the Url, rather than having to pass an object to the server.

## Consume the web service using jQuery

We won't get too much into the nitty-gritty about how to consume the web service using jQuery, after all the entire source code is available on [GitHub](https://github.com/jpreecedev/RESTfulTutorial). I personally used jQuery's `ajax` method and simply varied the `type` depending on the verb I wanted to use. For example;

```javascript
$.ajax({
        type: "POST",
        url: baseServiceUrl + "/Post",
        contentType: "application/json",
        data: JSON.stringify(blogPost),
        dataType: "json",
        success: function (data) {
        blogPost.id = data.id;
        self.reset();
    }
});
```

And the **DELETE** request is even simpler (shown below).

```javascript
$.ajax({
    url: baseServiceUrl + "/Post/" + blogPost.id,
    type: "DELETE",
    contentType: "application/json;charset=UTF-8"
});
```

We're really just copying what we've already achieved using Fiddler. For the demo I've used jQuery, Bootstrap, and KnockoutJS...so please be sure to download it and check it out for yourself!

## Summary

WCF provides out of the box support for writing RESTful web services. Using service contracts, operation contracts, and data contracts, we can make available all the basic information about our web service for consumption from any external clients, including non- .NET clients. We can easily test that our service is working using Fiddler, a free debugging proxy tool that allows us to intercept and "fiddle" with traffic. ...and after all _that_, if your thinking "why not just use Web API?", my response would be "its hard to disagree with you!". [![github4848_thumb.png](github4848_thumb1.png)Download the full source code including the full demo project from GitHub today!](https://github.com/jpreecedev/RESTfulTutorial)
