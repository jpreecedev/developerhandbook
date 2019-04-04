---
layout: post
title: 5 easy security enhancements for your ASP .NET application
description: Here I outline 5 ways to protect your website from malicious attacks, with explanations of each vulnerability and how to resolve it
date: 2014-01-26
categories: ['.NET']
---

Protecting web applications against unauthorised access is somewhat of a dark art, but there are simple steps you can take to ensure that you are protected against the most common security risks.

### Cross Site Request Forgery (CSRF / XSRF)

**Problem:** Cross site request forgery (CSRF / XSRF) is the process of tricking a legitimate user of your website into posting data to the web server without their knowledge. This type of attack is typically executed using a malicious link in an email, or by [social engineering](<http://en.wikipedia.org/wiki/Social_engineering_(security)>). Typically, an attacker will craft a web page that has a form with fields named that match the properties that an ASP .NET MVC controller action method is expecting. The form is then submitted (perhaps tucked away in an invisible iframe) and as long as the user has an active session open, the form will be processed as normal. Such an attack could be as simple as posting a comment to a website without the users knowledge, or, say, in the case of a banking application, transfer money to the attacker.

**Solution:** To resolve the problem in ASP .NET MVC, you need to make use of [Anti-Forgery Tokens](http://blog.stevensanderson.com/2008/09/01/prevent-cross-site-request-forgery-csrf-using-aspnet-mvcs-antiforgerytoken-helper/). An anti-forgery token is a hidden field with a unique id that is placed on the form. When the form is posted, the anti-forgery token is also passed along with the request and validated. If the token is invalid, or missing, an exception is thrown. Due to the random nature of the token, its impossible for an attacker to guess, meaning the only way to post to the server is via a page that originated from it.

**Implementation:** In all your views that have forms that will be posted back to the server, simply use the AntiForgeryToken method on the HtmlHelper;

```csharp
@using(Html.BeginForm("Login", "Account", new {
 ReturnUrl = ViewBag.ReturnUrl
}, FormMethod.Post)) {
 @Html.AntiForgeryToken()
}
```

Then add the `ValidateAntiForgeryToken` attribute to your action method;

```csharp
[HttpPost]
[AllowAnonymous]
[ValidateAntiforgeryToken]
public async Tas<ActionResult> Login(LoginViewModel model, string returnUrl)
{
  //Implementation
}
```

### Open Redirection

**Problem:** Open redirection is a form of phishing that, when a specific website is targeted, can be used to steal information, such as email address and password from a legitimate user. The problem occurs when redirecting a user to a page based on information stored in the query string. A malicious user could craft a URL to include a redirect to a website that looks identical to the original, which requests log-in credentials, then redirects the user back to the original website.

**Scenario:** A user receives an email asking them to check out a page on a website, which they click. The page requires the user to log in. Rather than linking directly to the actual page, the link would point to the log in page, with a return Url;

<pre>http://www.somesite.com/Account/LogIn?returnUrl%3Dhttp%3A%2F%2Fwww.sommsite.com%2FPage%2FSuperCool</pre>

Notice a very subtle difference between the source domain (somesite.com) and the destination domain (sommsite.com). Easy to miss. The user is prompted to enter their credentials, and they are then redirected to the `returnUrl`. The user is actually shown an identical log in page which says that they have entered their credentials incorrectly, please try again. The user re-enters the credentials and they are redirected back to the original site (which works because their credentials were correct in the first place).

**Solution:** This was a bigger problem in earlier versions of ASP .NET MVC because the vulnerability was present out-of-the-box. The problem still exists when using the `Redirect` method in conjunction with the query string; [

```csharp
Redirect(Request.QueryString["returnUrl"]);
```

There are two solutions;

* Don't use the `Redirect` method at all. Instead use `RedirectToLocal` or even better, use `RedirectToRoute` or `RedirectToAction`.
* Only ever use hard coded return Urls when calling the `Redirect` method.

### Cross Site Scripting (XSS)

**Problem:** Cross site scripting (XSS) is when an attacker uses a form on your website to inject script onto a page. The script can be literally anything, from annoying popups/banner advertisements, to more sinister code designed to steal confidential information from a legitimate user.

**Solution:** By default in the current version of Razor (the ASP .NET MVC default view engine) all data originating from properties on your model is encoded. Also, if a user tries to submit HTML / JavaScript using any forms on your website, an exception will be thrown and the data will be rejected. The developer has to explicitly allow Html (using the aptly named `AllowHtml` attribute) or turn off validation (using the `ValidateInput(false)`) attribute. If you absolutely have to accept Html on your website, make sure you implement a white list of allowed tags, rather than a blacklist of disallowed tags. There is a lot of information available regarding this type of attack (as it is very common). A good video I would suggest watching is [The HaaHa Show: Microsoft ASP .NET MVC Security with Haack and Hanselman](http://channel9.msdn.com/Events/MIX/MIX10/FT05).

### Over-posting (A.K.A. Mass Assignment)

**Problem:** It is possible to post additional data to the server along with a request, even for fields for which the developer never intended to be accessible by the client. The problem is due to the fact that the model binder in ASP .NET MVC matches up all the post data to all problems on your entities/models without discrimination.

**Scenario:** You have a `Customer` object, which contains details about a customer (Name, Address etc.). You create a view for the user to edit their details, passing the `Customer` object to the view so that fields can be pre-populated. When the user updates their details, and submits the form, the entity/model is saved back to the database. However, your `Customer` object also has a navigation property called `Orders`, which contains all the orders that the customer has placed. An attacker could submit a new order, which would be bound to the `Orders` property by the model binder, which may result in the customer receiving products that they haven't actually paid for.

**Solutions:**

1.  Use the `Bind` attribute to either blacklist or whitelist properties on your entity/model. The model binder will see the attribute, and either ignore or only bind the properties you have stated.

```csharp
[HttpPost]
[ValidateAntiForgeryToken]
public void Save([Bind(Exclude = "Orders")]Entity entity)
{
  //Logic
}
```

2.  Create a view model for each specific view, and only include the properties that you want exposed to the client (i.e. omit the `Orders` navigation property).

### SSL for the login / registration process

**Problem:** SSL is required to ensure that confidential information, such as user credentials or credit card information is transferred from the clients web browser to your server in a secure manner. Failure to do so will result in this information being susceptible to interception by a third party. It is easy to see this information being posted to the server using a debugging proxy (such as [Fiddler](http://www.telerik.com/fiddler)). Example message sent from the browser (Google Chrome in this case) to a web server when attempting to log in to a website;

<pre>POST http://localhost:64429/Account/Login HTTP/1.1
Host: localhost:64429
Connection: keep-alive
Content-Length: 183
Cache-Control: max-age=0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Origin: http://localhost:64429
User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.76 Safari/537.36
Content-Type: application/x-www-form-urlencoded
Referer: http://localhost:64429/Account/Login
Accept-Encoding: gzip,deflate,sdch
Accept-Language: en-GB,en-US;q=0.8,en;q=0.6
Cookie: __RequestVerificationToken=dAaXZYTCsNTKUZT7cxKqTEVOXjii9Md-VzxfY9-XxcSW1C_3mEV7OK2Wrp_bbOsEB555GNWv7RK6p9soYpKljwtTsXL7zldikJB4aK-NYog1

__RequestVerificationToken=YB9QvfBNTrFfhjmqunABxgQYsJrr4ZHEVMf-ejPCH0ZVhiXJwqOJfgMwpqeaPZZIiLy8-cZjEmx7GRM27dLVJ75t-t0dlnFsqYAVClZ1AuI1&UserName=jon&Password=password&RememberMe=false</pre>

Look closely, and you will see that the Request Verification Token includes the raw username/password;

<pre>__RequestVerificationToken=YB9QvfBNTrFfhjmqunABxgQYsJrr4ZHEVMf-ejPCH0ZVhiXJwqOJfgMwpqeaPZZIiLy8-cZjEmx7GRM27dLVJ75t-t0dlnFsqYAVClZ1AuI1&UserName=jon&Password=password&RememberMe=false</pre>

**Solution:** You should purchase an [SSL certificate](http://www.sslshopper.com/ssl-certificate-wizard.html) and apply it to your website. Doing so will encrypt the traffic so that it cannot be easily viewed between the source and destination. If your website is hosted using Internet Information Services (IIS);

* Open the IIS Manager (inetmgr.exe)
* Select the root level node under "Connections"
* Double click "Server Certificates"
* Import the certificate using the links on the "Actions" pane
* Click on your website
* Add a new **https** binding and select the SSL certificate you just imported.
