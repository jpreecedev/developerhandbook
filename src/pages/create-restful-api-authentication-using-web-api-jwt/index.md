---
layout: post
title: Create a RESTful API with authentication using Web API and Jwt
description: The purpose of this tutorial is to develop the beginnings of a Book Store API, using Microsoft Web API with (C#), and JWT.
date: 2016-03-15
categories: ['.NET', 'C#', 'Entity Framework', 'Web API']
---

Web API is a feature of the ASP .NET framework that dramatically simplifies building RESTful (REST like) HTTP services that are cross platform and device and browser agnostic. With Web API, you can create endpoints that can be accessed using a combination of descriptive URLs and HTTP verbs. Those endpoints can serve data back to the caller as either JSON or XML that is standards compliant. With JSON Web Tokens (Jwt), which are typically stateless, you can add an authentication and authorization layer enabling you to restrict access to some or all of your API.

The purpose of this tutorial is to develop the beginnings of a Book Store API, using [Microsoft Web API](http://www.asp.net/web-api) with (C#), which authenticates and authorizes each requests, exposes OAuth2 endpoints, and returns data about books and reviews for consumption by the caller. The caller in this case will be [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en), a useful utility for querying API's.

In a follow up to this post we will write a front end to interact with the API directly.

## Set up

Open Visual Studio (I will be using [Visual Studio 2015 Community edition](https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx), you can use whatever version you like) and create a new **Empty** project, ensuring you select the **Web API** option;

Where you save the project is up to you, but I will create my projects under _*C:\Source*_. For simplicity you might want to do the same.

![New Project](NewProject.png)

Next, packages.

## Packages

Open up the **packages.config** file. Some packages should have already been added to enable Web API itself. Please add the the following additional packages;

```powershell
install-package EntityFramework
install-package Microsoft.AspNet.Cors
install-package Microsoft.AspNet.Identity.Core
install-package Microsoft.AspNet.Identity.EntityFramework
install-package Microsoft.AspNet.Identity.Owin
install-package Microsoft.AspNet.WebApi.Cors
install-package Microsoft.AspNet.WebApi.Owin
install-package Microsoft.Owin.Cors
install-package Microsoft.Owin.Security.Jwt
install-package Microsoft.Owin.Host.SystemWeb
install-package System.IdentityModel.Tokens.Jwt
install-package Thinktecture.IdentityModel.Core
```

These are the minimum packages required to provide data persistence, enable CORS (Cross-Origin Resource Sharing), and enable generating and authenticating/authorizing Jwt's.

## Entity Framework

We will use Entity Framework for data persistence, using the Code-First approach. Entity Framework will take care of generating a database, adding tables, stored procedures and so on. As an added benefit, Entity Framework will also upgrade the schema automatically as we make changes. Entity Framework is perfect for rapid prototyping, which is what we are in essence doing here.

Create a new `IdentityDbContext` called `BooksContext`, which will give us Users, Roles and Claims in our database. I like to add this under a folder called Core, for organization. We will add our entities to this later.

```csharp
namespace BooksAPI.Core
{
    using Microsoft.AspNet.Identity.EntityFramework;

    public class BooksContext : IdentityDbContext
    {

    }
}
```

Claims are used to describe useful information that the user has associated with them. We will use claims to tell the client which roles the user has. The benefit of roles is that we can prevent access to certain methods/controllers to a specific group of users, and permit access to others.

Add a `DbMigrationsConfiguration` class and allow automatic migrations, but prevent automatic data loss;

```csharp
namespace BooksAPI.Core
{
    using System.Data.Entity.Migrations;

    public class Configuration : DbMigrationsConfiguration<BooksContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = false;
        }
    }
}
```

Whilst losing data at this stage is not important (we will use a seed method later to populate our database), I like to turn this off now so I do not forget later.

Now tell Entity Framework how to update the database schema using an initializer, as follows;

```csharp
namespace BooksAPI.Core
{
    using System.Data.Entity;

    public class Initializer : MigrateDatabaseToLatestVersion<BooksContext, Configuration>
    {
    }
}
```

This tells Entity Framework to go ahead and upgrade the database to the latest version automatically for us.

Finally, tell your application about the initializer by updating the **Global.asax.cs** file as follows;

```csharp
namespace BooksAPI
{
    using System.Data.Entity;
    using System.Web;
    using System.Web.Http;
    using Core;

    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            Database.SetInitializer(new Initializer());
        }
    }
}
```

## Data Provider

By default, Entity Framework will configure itself to use LocalDB. If this is not desirable, say you want to use SQL Express instead, you need to make the following adjustments;

Open the **Web.config** file and delete the following code;

```xml
<entityFramework>
    <defaultConnectionFactory type="System.Data.Entity.Infrastructure.LocalDbConnectionFactory, EntityFramework">
        <parameters>
            <parameter value="mssqllocaldb" />
        </parameters>
    </defaultConnectionFactory>
    <providers>
        <provider invariantName="System.Data.SqlClient" type="System.Data.Entity.SqlServer.SqlProviderServices, EntityFramework.SqlServer" />
    </providers>
</entityFramework>
```

And add the connection string;

```xml
<connectionStrings>
    <add name="BooksContext" providerName="System.Data.SqlClient" connectionString="Server=.;Database=Books;Trusted_Connection=True;" />
</connectionStrings>
```

Now we're using SQL Server directly (whatever flavour that might be) rather than LocalDB.

## JSON

Whilst we're here, we might as well configure our application to return camel-case JSON (thisIsCamelCase), instead of the default pascal-case (ThisIsPascalCase).

Add the following code to your `Application_Start` method;

```csharp
var formatters = GlobalConfiguration.Configuration.Formatters;
var jsonFormatter = formatters.JsonFormatter;
var settings = jsonFormatter.SerializerSettings;
settings.Formatting = Formatting.Indented;
settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
```

There is nothing worse than pascal-case JavaScript.

## CORS (Cross-Origin Resource Sharing)

Cross-Origin Resource Sharing, or CORS for short, is when a client requests access to a resource (an image, or say, data from an endpoint) from an origin (domain) that is different from the domain where the resource itself originates.

**This step is completely optional**. We are adding in CORS support here because when we come to write our client app in subsequent posts that follow on from this one, we will likely use a separate HTTP server (for testing and debugging purposes). When released to production, these two apps would use the same host (Internet Information Services (IIS)).

To enable CORS, open **WebApiConfig.cs** and add the following code to the beginning of the `Register` method;

```csharp
var cors = new EnableCorsAttribute("*", "*", "*");
config.EnableCors(cors);
config.MessageHandlers.Add(new PreflightRequestsHandler());
```

And add the following class (in the same file if you prefer for quick reference);

```csharp
public class PreflightRequestsHandler : DelegatingHandler
{
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        if (request.Headers.Contains("Origin") && request.Method.Method == "OPTIONS")
        {
            var response = new HttpResponseMessage {StatusCode = HttpStatusCode.OK};
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Headers.Add("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
            response.Headers.Add("Access-Control-Allow-Methods", "*");
            var tsc = new TaskCompletionSource<HttpResponseMessage>();
            tsc.SetResult(response);
            return tsc.Task;
        }
        return base.SendAsync(request, cancellationToken);
    }
}
```

In the CORS workflow, before sending a DELETE, PUT or POST request, the client sends an OPTIONS request to check that the domain from which the request originates is the same as the server. If the request domain and server domain are not the same, then the server must include various access headers that describe which domains have access. To enable access to all domains, we just respond with an origin header (Access-Control-Allow-Origin) with an asterisk to enable access for all.

The **Access-Control-Allow-Headers** header describes which headers the API can accept/is expecting to receive. The **Access-Control-Allow-Methods** header describes which HTTP verbs are supported/permitted.

See Mozilla Developer Network (MDN) for a more comprehensive write-up on [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

## Data Model

With Entity Framework configured, lets create our data structure. The API will expose books, and books will have reviews.

Under the **Models** folder add a new class called `Book`. Add the following code;

```csharp
namespace BooksAPI.Models
{
    using System.Collections.Generic;

    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }

        public virtual List<Review> Reviews { get; set; }
    }
}
```

And add `Review`, as shown;

```csharp
namespace BooksAPI.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int Rating { get; set; }
        public int BookId { get; set; }
    }
}
```

Add these entities to the `IdentityDbContext` we created earlier;

```csharp
public class BooksContext : IdentityDbContext
{
    public DbSet<Book> Books { get; set; }
    public DbSet<Review> Reviews { get; set; }
}
```

Be sure to add in the necessary using directives.

## A couple of helpful abstractions

We need to abstract a couple of classes that we need to make use of, in order to keep our code clean and ensure that it _works_ correctly.

Under the **Core** folder, add the following classes;

```csharp
public class BookUserManager : UserManager<IdentityUser>
{
    public BookUserManager() : base(new BookUserStore())
    {
    }
}
```

We will make heavy use of the `UserManager<T>` in our project, and we don't want to have to initialise it with a `UserStore<T>` every time we want to make use of it. Whilst adding this is not strictly necessary, it does go a long way to helping keep the code clean.

Now add another class for the `UserStore`, as shown;

```csharp
public class BookUserStore : UserStore<IdentityUser>
{
    public BookUserStore() : base(new BooksContext())
    {
    }
}
```

This code is really important. If we fail to tell the `UserStore` which `DbContext` to use, it falls back to some default value.

<pre>A network-related or instance-specific error occurred while establishing a connection to SQL Server</pre>

I'm not sure what the default value is, all I know is it doesn't seem to correspond to our applications `DbContext`. This code will help prevent you from tearing your hair out later wondering why you are getting the _super-helpful_ error message shown above.

## API Controller

We need to expose some data to our client (when we write it). Lets take advantage of Entity Frameworks `Seed` method. The `Seed` method will pre-populate some books and reviews automatically for us.

Instead of dropping the code in directly for this class (it is very long), please refer to the [**Configuration.cs** file on GitHub.](https://github.com/jpreecedev/BookStoreAPI/blob/master/Core/Configuration.cs)

This code gives us a little bit of starting data to play with, instead of having to add a bunch of data manually each time we make changes to our schema that require the database to be re-initialized (not really in our case as we have an extremely simple data model, but in larger applications this is very useful).

### Books Endpoint

Next, we want to create the RESTful endpoint that will retrieve all the books data. Create a new Web API controller called `BooksController` and add the following;

```csharp
public class BooksController : ApiController
{
    [HttpGet]
    public async Task<IHttpActionResult> Get()
    {
        using (var context = new BooksContext())
        {
            return Ok(await context.Books.Include(x => x.Reviews).ToListAsync());
        }
    }
}
```

With this code we are fully exploiting recent changes to the .NET framework; the introduction of `async` and `await`. Writing asynchronous code in this manner allows the thread to be released whilst data (Books and Reviews) is being retrieved from the database and converted to objects to be consumed by our code. When the asynchronous operation is complete, the code picks up where it was up to and continues executing. (By which, we mean the hydrated data objects are passed to the underlying framework and converted to JSON/XML and returned to the client).

### Reviews Endpoint

We're also going to enable authorized users to post reviews and delete reviews. For this we will need a `ReviewsController` with the relevant `Post` and `Delete` methods. Add the following code;

Create a new Web API controller called **ReviewsController** and add the following code;

```csharp
public class ReviewsController : ApiController
{
    [HttpPost]
    public async Task<IHttpActionResult> Post([FromBody] ReviewViewModel review)
    {
        using (var context = new BooksContext())
        {
            var book = await context.Books.FirstOrDefaultAsync(b => b.Id == review.BookId);
            if (book == null)
            {
                return NotFound();
            }

            var newReview = context.Reviews.Add(new Review
            {
                BookId = book.Id,
                Description = review.Description,
                Rating = review.Rating
            });

            await context.SaveChangesAsync();
            return Ok(new ReviewViewModel(newReview));
        }
    }

    [HttpDelete]
    public async Task<IHttpActionResult> Delete(int id)
    {
        using (var context = new BooksContext())
        {
            var review = await context.Reviews.FirstOrDefaultAsync(r => r.Id == id);
            if (review == null)
            {
                return NotFound();
            }

            context.Reviews.Remove(review);
            await context.SaveChangesAsync();
        }
        return Ok();
    }
}
```

There are a couple of good practices in play here that we need to highlight.

The first method, `Post` allows the user to add a new review. Notice the parameter for the method;

```csharp
[FromBody] ReviewViewModel review
```

The `[FromBody]` attribute tells Web API to look for the data for the method argument in the body of the HTTP message that we received from the client, and not in the URL. The second parameter is a view model that wraps around the `Review` entity itself. Add a new folder to your project called **ViewModels**, add a new class called **ReviewViewModel** and add the following code;

```csharp
public class ReviewViewModel
{
    public ReviewViewModel()
    {
    }

    public ReviewViewModel(Review review)
    {
        if (review == null)
        {
            return;
        }

        BookId = review.BookId;
        Rating = review.Rating;
        Description = review.Description;
    }

    public int BookId { get; set; }
    public int Rating { get; set; }
    public string Description { get; set; }

    public Review ToReview()
    {
        return new Review
        {
            BookId = BookId,
            Description = Description,
            Rating = Rating
        };
    }
}
```

We are just copying all he properties from the `Review` entity to the `ReviewViewModel` entity and vice-versa. So why bother? First reason, to help mitigate a well known under/over-posting vulnerability ([good write up about it here](http://www.webdevelopmenthelp.net/2014/03/limitations-model-validation-webapi.html)) inherent in most web services. Also, it helps prevent unwanted information being sent to the client. With this approach we have to explicitly expose data to the client by adding properties to the view model.

For this scenario, this approach is probably a bit overkill, but I highly recommend it keeping your application secure is important, as well as is the need to prevent leaking of potentially sensitive information. A tool I've used in the past to simplify this mapping code is [AutoMapper](http://automapper.org/). I highly recommend checking out.

**Important note**: In order to keep our API RESTful, we return the newly created entity (or its view model representation) back to the client for consumption, removing the need to re-fetch the entire data set.

The `Delete` method is trivial. We accept the **Id** of the review we want to delete as a parameter, then fetch the entity and finally remove it from the collection. Calling `SaveChangesAsync` will make the change permanent.

## Meaningful response codes

We want to return useful information back to the client as much as possible. Notice that the `Post` method returns `NotFound()`, which translates to a 404 HTTP status code, if the corresponding `Book` for the given review cannot be found. This is useful for client side error handling. Returning `Ok()` will return 200 (HTTP 'Ok' status code), which informs the client that the operation was successful.

## Authentication and Authorization Using OAuth and JSON Web Tokens (JWT)

My preferred approach for dealing with authentication and authorization is to use JSON Web Tokens (JWT). We will open up an OAuth endpoint to client credentials and return a token which describes the users claims. For each of the users roles we will add a claim (which could be used to control which views the user has access to on the client side).

We use OWIN to add our OAuth configuration into the pipeline. Add a new class to the project called **Startup.cs** and add the following code;

```csharp
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof (BooksAPI.Startup))]

namespace BooksAPI
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureOAuth(app);
        }
    }
}
```

Notice that **Startup** is a partial class. I've done that because I want to keep this class as simple as possible, because as the application becomes more complicated and we add more and more middle-ware, this class will grow exponentially. You could use a static helper class here, but the preferred method from the MSDN documentation seems to be leaning towards using partial classes specifically.

Under the **App_Start** folder add a new class called **Startup.OAuth.cs** and add the following code;

```csharp
using System;
using System.Configuration;
using BooksAPI.Core;
using BooksAPI.Identity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataHandler.Encoder;
using Microsoft.Owin.Security.Jwt;
using Microsoft.Owin.Security.OAuth;
using Owin;

namespace BooksAPI
{
    public partial class Startup
    {
        public void ConfigureOAuth(IAppBuilder app)
        {
        }
    }
}
```

**Note**. When I wrote this code originally I encountered a quirk. After spending hours pulling out my hair trying to figure out why something was not working, I eventually discovered that the ordering of the code in this class is very important. If you don't copy the code in the **exact** same order, you may encounter unexpected behaviour. Please add the code in the same order as described below.

## OAuth secrets

First, add the following code;

```csharp
var issuer = ConfigurationManager.AppSettings["issuer"];
var secret = TextEncodings.Base64Url.Decode(ConfigurationManager.AppSettings["secret"]);
```

- Issuer - a unique identifier for the _entity_ that issued the token (not to be confused with Entity Framework's _entities_)
- Secret - a secret key used to secure the token and prevent tampering

I keep these values in the Web configuration file (Web.config). To be precise, I split these values out into their own configuration file called **keys.config** and add a reference to that file in the main **Web.config**. I do this so that I can exclude just the keys from source control by adding a line to my **.gitignore** file.

To do this, open **Web.config** and change the `<appSettings>` section as follows;

```xml
<appSettings file="keys.config">
</appSettings>
```

Now add a new file to your project called **keys.config** and add the following code;

```xml
<appSettings>
  <add key="issuer" value="http://localhost/"/>
  <add key="secret" value="IxrAjDoa2FqElO7IhrSrUJELhUckePEPVpaePlS_Xaw"/>
</appSettings>
```

## Adding objects to the OWIN context

We can make use of OWIN to manage instances of objects for us, on a per request basis. The pattern is comparable to IoC, in that you tell the "container" how to create an instance of a specific type of object, then request the instance using a `Get<T>` method.

Add the following code;

```csharp
app.CreatePerOwinContext(() => new BooksContext());
app.CreatePerOwinContext(() => new BookUserManager());
```

The first time we request an instance of `BooksContext` for example, the lambda expression will execute and a new `BooksContext` will be created and returned to us. Subsequent requests will return the same instance.

**Important note**: The life-cycle of object instance is _per-request_. As soon as the request is complete, the instance is cleaned up.

## Enabling Bearer Authentication/Authorization

To enable bearer authentication, add the following code;

```csharp
app.UseJwtBearerAuthentication(new JwtBearerAuthenticationOptions
{
    AuthenticationMode = AuthenticationMode.Active,
    AllowedAudiences = new[] { "Any" },
    IssuerSecurityTokenProviders = new IIssuerSecurityTokenProvider[]
    {
        new SymmetricKeyIssuerSecurityTokenProvider(issuer, secret)
    }
});
```

The key takeaway of this code;

- State who is the audience (we're specifying "Any" for the audience, as this is a required field but we're not fully implementing it).
- State who is responsible for generating the tokens. Here we're using `SymmetricKeyIssuerSecurityTokenProvider` and passing it our secret key to prevent tampering. We could use the `X509CertificateSecurityTokenProvider`, which uses a X509 certificate to secure the token (but I've found these to be overly complex in the past and I prefer a simpler implementation).

This code adds JWT bearer authentication to the OWIN pipeline.

## Enabling OAuth

We need to expose an OAuth endpoint so that the client can request a token (by passing a user name and password).

Add the following code;

```csharp
app.UseOAuthAuthorizationServer(new OAuthAuthorizationServerOptions
{
    AllowInsecureHttp = true,
    TokenEndpointPath = new PathString("/oauth2/token"),
    AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(30),
    Provider = new CustomOAuthProvider(),
    AccessTokenFormat = new CustomJwtFormat(issuer)
});
```

Some important notes with this code;

- We're going to allow insecure HTTP requests whilst we are in development mode. You might want to disable this using a `#IF Debug` directive so that you don't allow insecure connections in production.
- Open an endpoint under **/oauth2/token** that accepts post requests.
- When generating a token, make it expire after 30 minutes (1800 seconds).
- We will use our own provider, `CustomOAuthProvider`, and formatter, `CustomJwtFormat`, to take care of authentication and building the actual token itself.

We need to write the provider and formatter next.

## Formatting the JWT

Create a new class under the **Identity** folder called **CustomJwtFormat.cs**. Add the following code;

```csharp
namespace BooksAPI.Identity
{
    using System;
    using System.Configuration;
    using System.IdentityModel.Tokens;
    using Microsoft.Owin.Security;
    using Microsoft.Owin.Security.DataHandler.Encoder;
    using Thinktecture.IdentityModel.Tokens;

    public class CustomJwtFormat : ISecureDataFormat<AuthenticationTicket>
    {
        private static readonly byte[] _secret = TextEncodings.Base64Url.Decode(ConfigurationManager.AppSettings["secret"]);
        private readonly string _issuer;

        public CustomJwtFormat(string issuer)
        {
            _issuer = issuer;
        }

        public string Protect(AuthenticationTicket data)
        {
            if (data == null)
            {
                throw new ArgumentNullException(nameof(data));
            }

            var signingKey = new HmacSigningCredentials(_secret);
            var issued = data.Properties.IssuedUtc;
            var expires = data.Properties.ExpiresUtc;

            return new JwtSecurityTokenHandler().WriteToken(new JwtSecurityToken(_issuer, null, data.Identity.Claims, issued.Value.UtcDateTime, expires.Value.UtcDateTime, signingKey));
        }

        public AuthenticationTicket Unprotect(string protectedText)
        {
            throw new NotImplementedException();
        }
    }
}
```

This is a complicated looking class, but its pretty straightforward. We are just fetching all the information needed to generate the token, including the claims, issued date, expiration date, key and then we're generating the token and returning it back.

**Please note**: Some of the code we are writing today was influenced by [JSON Web Token in ASP.NET Web API 2 using OWIN](http://bitoftech.net/2014/10/27/json-web-token-asp-net-web-api-2-jwt-owin-authorization-server/) by Taiseer Joudeh. I highly recommend checking it out.

## The authentication bit

We're almost there, honest! Now we want to authenticate the user.

```csharp
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using BooksAPI.Core;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;

namespace BooksAPI.Identity
{
    public class CustomOAuthProvider : OAuthAuthorizationServerProvider
    {
        public override Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] {"*"});

            var user = context.OwinContext.Get<BooksContext>().Users.FirstOrDefault(u => u.UserName == context.UserName);
            if (!context.OwinContext.Get<BookUserManager>().CheckPassword(user, context.Password))
            {
                context.SetError("invalid_grant", "The user name or password is incorrect");
                context.Rejected();
                return Task.FromResult<object>(null);
            }

            var ticket = new AuthenticationTicket(SetClaimsIdentity(context, user), new AuthenticationProperties());
            context.Validated(ticket);

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
            return Task.FromResult<object>(null);
        }

        private static ClaimsIdentity SetClaimsIdentity(OAuthGrantResourceOwnerCredentialsContext context, IdentityUser user)
        {
            var identity = new ClaimsIdentity("JWT");
            identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
            identity.AddClaim(new Claim("sub", context.UserName));

            var userRoles = context.OwinContext.Get<BookUserManager>().GetRoles(user.Id);
            foreach (var role in userRoles)
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, role));
            }

            return identity;
        }
    }
}
```

As we're not checking the audience, when `ValidateClientAuthentication` is called we can just validate the request. When the request has a **grant_type** of **password**, which all our requests to the OAuth endpoint will have, the above `GrantResourceOwnerCredentials` method is executed. This method authenticates the user and creates the claims to be added to the JWT.

## Testing

There are 2 tools you can use for testing this.

### Technique 1 - Using the browser

Open up a web browser, and navigate to the books URL.

![Testing with the web browser](testing-with-browser.png)

You will see the list of books, displayed as XML. This is because Web API can serve up data either as XML or as JSON. Personally, I do not like XML, JSON is my choice these days.

### Technique 2 (Preferred) - Using Postman

To make Web API respond in JSON we need to send along a **Accept** header. The best tool to enable use to do this (for Google Chrome) is [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en). Download it and give it a go if you like.

Drop the same URL into the **Enter request URL** field, and click **Send**. Notice the response is in JSON;

![Postman response in JSON](postman-json.png)

This worked because Postman automatically adds the **Accept** header to each request. You can see this by clicking on the **Headers** tab. If the header isn't there and you're still getting XML back, just add the header as shown in the screenshot and re-send the request.

To test the delete method, change the HTTP verb to **Delete** and add the **ReviewId** to the end of the URL. For example; http://localhost:62996/api/reviews/9

## Putting it all together

First, we need to restrict access to our endpoints.

Add a new file to the **App_Start** folder, called **FilterConfig.cs** and add the following code;

```csharp
public class FilterConfig
{
    public static void Configure(HttpConfiguration config)
    {
        config.Filters.Add(new AuthorizeAttribute());
    }
}
```

And call the code from **Global.asax.cs** as follows;

```csharp
GlobalConfiguration.Configure(FilterConfig.Configure);
```

Adding this code will restrict access to all endpoints (except the OAuth endpoint) to requests that have been authenticated (a request that sends along a valid Jwt).

You have much more fine-grain control here, if required. Instead of adding the above code, you could instead add the `AuthorizeAttribute` to specific controllers or even specific methods. The added benefit here is that you can also restrict access to specific users or specific roles;

Example code;

```csharp
[Authorize(Roles = "Admin")]
```

The roles value ("Admin") can be a comma-separated list. For us, restricting access to all endpoints will suffice.

To test that this code is working correctly, simply make a **GET** request to the books endpoint;

<pre>GET http://localhost:62996/api/books</pre>

You should get the following response;

```json
{
  "message": "Authorization has been denied for this request."
}
```

Great its working. Now let's fix that problem.

Make a **POST** request to the OAuth endpoint, and include the following;

- Headers
  - Accept application/json
  - Accept-Language en-gb
  - Audience Any
- Body
  - username administrator
  - password administrator123
  - grant_type password

Shown in the below screenshot;

![OAuth Request](auth-request.png)

Make sure you set the message type as **x-www-form-urlencoded**.

If you are interested, here is the raw message;

<pre>POST /oauth2/token HTTP/1.1
Host: localhost:62996
Accept: application/json
Accept-Language: en-gb
Audience: Any
Content-Type: application/x-www-form-urlencoded
Cache-Control: no-cache
Postman-Token: 8bc258b2-a08a-32ea-3cb2-2e7da46ddc09

username=administrator&password=administrator123&grant_type=password</pre>

The form data has been URL encoded and placed in the message body.

The web service should authenticate the request, and return a token (Shown in the response section in Postman). You can test that the authentication is working correctly by supplying an invalid username/password. In this case, you should get the following reply;

```json
{
  "error": "invalid_grant"
}
```

This is deliberately vague to avoid giving any malicious users more information than they need.

Now to get a list of books, we need to call the endpoint passing in the token as a header.

Change the HTTP verb to **GET** and change the URL to; **http://localhost:62996/api/books**.

On the **Headers** tab in Postman, add the following additional headers;

<pre>Authorization Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6ImFkbWluaXN0cmF0b3IiLCJzdWIiOiJhZG1pbmlzdHJhdG9yIiwicm9sZSI6IkFkbWluaXN0cmF0b3IiLCJpc3MiOiJodHRwOi8vand0YXV0aHpzcnYuYXp1cmV3ZWJzaXRlcy5uZXQiLCJhdWQiOiJBbnkiLCJleHAiOjE0NTgwNDI4MjgsIm5iZiI6MTQ1ODA0MTAyOH0.uhrqQW6Ik_us1lvDXWJNKtsyxYlwKkUrCGXs-eQRWZQ</pre>

See screenshot below;

![Authorization Header](authorization-header.png)

Success! We have data from our secure endpoint.

## Summary

In this introduction we looked at creating a project using Web API to issue and authenticate Jwt (JSON Web Tokens). We created a simple endpoint to retrieve a list of books, and also added the ability to get a specific book/review and delete reviews in a RESTful way.

This project is the foundation for subsequent posts that will explore creating a rich client side application, using modern JavaScript frameworks, which will enable authentication and authorization.
