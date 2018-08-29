---
layout: post
title: How to create a RESTful web service using WCF (Part 2 of 3)
date: 2014-04-03
categories: ['WCF']
tags: ['c#', 'rest', 'wcf', 'WCF']
---

RESTful (Representational State Transfer) web services use HTTP verbs to map CRUD operations to HTTP methods. RESTful web services expose either a collection resource (representational of a list) or an element resource (representational of a single item in the list).

## Create the WCF service contract

Every WCF service begins with a service contract. A service contract defines what operations are supported/provided by the service. An operation contract is the definition of a method that can be invoked by a client application. A WCF service can exist without any operations, but it wouldn't be of much use. Usually, all the WCF related definitions are placed on an interface, which is implemented on a normal class (this helps keep everything nice and tidy). Although this is not strictly required.

### Data Contract

Before we can get onto the goodness of implementing our WCF service, we need to make a small alteration to our **BlogPost.cs** model class. A data contract is basically a promise (contract!) that describes the data that can be transferred between the client and the server. A data contract is denoted by the `DataContract` attribute, which is added to each class you want to be serializable. Each property that you want to be serialized is decorated with the `DataMember` attribute. The `DataMember` attribute can be given additional metadata such as a name, which overrides the name of the property. Being able to define a name for each property when the serialization takes place is particularly important. We will be writing a JavaScript front end for this application, which prefers field names to be in camel case... and we want to be consistent with that. Update your model class (**BlogPost.cs**) as follows;

    [DataContract]
    public class BlogPost
    {
        [DataMember(Name = "id")]
        public int Id { get; set; }

        [DataMember(Name = "title")]
        public string Title { get; set; }

        [Column("Url")]
        [DataMember(Name = "url")]
        public string UriString
        {
            get
            {
                return Url == null ? null : Url.ToString();
            }
            set
            {
                Url = value == null ? null : new Uri(value);
            }
        }

        [NotMapped]
        public Uri Url { get; set; }
    }

Note that we haven't decorated the `Url` property with the `DataMember` attribute because we don't want it to be transferred to/from the client.

### HTTP GET

In the **Service** project, add a new interface named **IBlogService.cs** and add the `ServiceContract` attribute. Then add a new method definition, `GetBlogPosts` which returns an array of `BlogPost` (you will need to add a reference to the `Data` project here).

    [ServiceContract]
    public interface IBlogService
    {
        [OperationContract]
        [WebGet]
        BlogPost[] GetBlogPosts();
    }

The `WebGet` attribute is a REST specific attribute indicating that the operation is accessible via the HTTP GET verb. The `WebInvoke` attribute can be used for POST, PUT and DELETE verbs. Next, create a class named `BlogService` which implements `IBlogService`. Add a static constructor to initialise the database and update the `GetBlogPosts` method to return all the blog posts in your database;

    public class BlogService : IBlogService
    {
        static BlogService()
        {
            Database.SetInitializer(new BlogInitializer());
        }

        public BlogPost[] GetBlogPosts()
        {
            using (BlogContext context = new BlogContext())
            {
                return context.BlogPosts.ToArray();
            }
        }
    }

Before we can test our WCF service, we need to make a few edits to the configuration file, which was added for us when we created the project. Open **app.config** and make the following alterations; 1\. Make sure that the service name matches the full namespace for your service interface;

    <system.serviceModel>
        <services>
          <service name="RESTfulTutorial.Service.BlogService">

2\. Update the base address to tell WCF to use the port number **8085**, and simplify the address a little to tidy it up;

    <baseAddresses>
        <add baseAddress="http://localhost:8085/BlogService/" />
    </baseAddresses>

3\. Update the endpoint to use `webHttpBinding` rather than `basicHttpBinding` Also check that the contract namespace is correct, and add a `behaviourConfiguration` named `Web` (we will define this shortly).

    <endpoint address=""
        binding="webHttpBinding"
        contract="RESTfulTutorial.Service.IBlogService"
        behaviorConfiguration="Web"/>

4\. Add an endpoint behaviour (just after the service behaviours section), which will tell WCF to respond in JSON by default, but permit responses in both JSON and XML;

    <endpointBehaviors>
        <behavior name="Web">
            <webHttp automaticFormatSelectionEnabled="True" defaultOutgoingResponseFormat="Json" />
        </behavior>
    </endpointBehaviors>

If you query [http://localhost:8085/BlogService/GetBlogPosts](http://localhost:8085/BlogService/GetBlogPosts 'http://localhost:8085/BlogService/GetBlogPosts') using your web browser, you should see all the blog posts returned as an array (and in XML). This works because by default, of course, your web browser issues a HTTP GET request, which we permitted using the `WebGet` attribute. Whilst this works, its not very RESTful. What I mean by this is that simply the URL describes the operation, rather than being _representational_ of the data (see what I did there.). To make the operation RESTful, update the `WebGet` attribute as follows;

    [OperationContract]
    [WebGet(UriTemplate = "/Posts")]
    BlogPost[] GetBlogPosts();

If you query [http://localhost:8085/BlogService/Posts](http://localhost:8085/BlogService/Posts 'http://localhost:8085/BlogService/Posts') this time, you should get the same data back as before, but in the proper RESTful way.

### Parameters

It is possible, and useful, to pass parameters into a URL in order to return a specific resource rather than a collection of resources. Take the following method;

    [OperationContract]
    [WebGet(UriTemplate = "/Post/{id}")]
    BlogPost GetBlogPost(string id);

A place-marker ({id}) is used to indicate that a parameter will be provided, and that marker matches the name of the parameter accepted by the operation. Unfortunately, when using custom Uri templates like this, WCF can't identify the type of the parameter, only strings... so you have to manually cast the string to, in this case, an integer before using it (sigh). Note that I have also changed the Uri template to **Post** rather than **Posts**, simply because I only want to return a single blog post in this case (again this is consistent with the REST specification).

### HTTP POST/PUT/DELETE

Other HTTP verbs are just as easy to implement. Add the following operations to your service contract;

    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "/Post")]
    BlogPost CreateBlogPost(BlogPost post);

    [OperationContract]
    [WebInvoke(Method = "PUT", UriTemplate = "/Post")]
    BlogPost UpdateBlogPost(BlogPost post);

    [OperationContract]
    [WebInvoke(Method = "DELETE", UriTemplate = "/Post/{id}")]
    void DeleteBlogPost(string id);

Instead of using the `WebGet` attribute, we use the `WebInvoke` attribute, which basically means most other verbs other than GET. As we're not using Uri templates with place-markers, we can pass in a complex object from the client and WCF will just figure out what to do with it. For completeness, here is the implementation for each operation that we added to the service contract;

    public BlogPost GetBlogPost(string id)
    {
        int identifier;
        if (int.TryParse(id, out identifier))
        {
            using (BlogContext context = new BlogContext())
            {
                return context.BlogPosts.FirstOrDefault(post => post.Id == identifier);
            }
        }

        return null;
    }

    public BlogPost CreateBlogPost(BlogPost post)
    {
        using (BlogContext context = new BlogContext())
        {
            context.BlogPosts.Add(post);
            context.SaveChanges();
        }

        return post;
    }

    public BlogPost UpdateBlogPost(BlogPost post)
    {
        using (BlogContext context = new BlogContext())
        {
            context.Entry(post).State = EntityState.Modified;
            context.SaveChanges();
        }

        return post;
    }

    public void DeleteBlogPost(string id)
    {
        int identifier;
        if (int.TryParse(id, out identifier))
        {
            using (BlogContext context = new BlogContext())
            {
                var entity = context.BlogPosts.FirstOrDefault(blogPost => blogPost.Id == identifier);
                if (entity != null)
                {
                    context.BlogPosts.Remove(entity);
                    context.SaveChanges();
                }
            }
        }
    }

## Summary

We've looked at how to define a WCF service contract, how to define so operations, and how to make our model classes serializable. We've also looked at how to use various attributes to change how methods are accessed, to bring them into line with the REST specification. In the final part of this series, we will look at how to test the web service using Fiddler, and a high level look at how we might implement a client application using jQuery.
