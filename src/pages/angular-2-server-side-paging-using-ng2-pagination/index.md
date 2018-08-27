---
layout: post
title: Angular 2 server side paging using ng2-pagination
date: 2016-03-31
categories: [".NET","TypeScript","Web API"]
tags: [".NET","angular","api","Architecture","c#","TypeScript","typescript","web api","Web API"]
---

Angular 2 is not quite out of beta yet (Beta 12 at the time of writing) but I'm in the full flow of developing with it for production use. A common feature, for good or bad, is to have lists/tables of data that the user can navigate through page by page, or even filter, to help find something useful. Angular 2 doesn't come with any out of the box functionality to support this, so we have to implement it ourselves. And of course what the means today is to use a third party package! To make this happen, we will utilise [n2-pagination](https://github.com/michaelbromley/ng2-pagination), a great plugin, and Web API. I've chosen Web API because that is what I'm using in my production app, but you could easily use ExpressJS or (insert your favourite RESTful framework here).

## Checklist

Here is a checklist of what we will do to make this work;

*   Create a new Web API project (you could very easily use an existing project)
*   Enable CORS, as we will use using a seperate development server for the Angular 2 project
*   Download the Angular 2 quick start, ng2-pagination and connect the dots
*   Expose some sample data for testing

I will try to stick with this order.

## Web API (for the back end)

Open up Visual Studio ([free version here](https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx)) and create a new Web API project. I prefer to create an Empty project and add Web API. Add a new controller, called `DataController` and add the following code;

    public class DataModel
    {
        public int Id { get; set; }
        public string Text { get; set; }
    }

    [RoutePrefix("api/data")]
    public class DataController : ApiController
    {
        private readonly List<DataModel> _data;

        public DataController()
        {
            _data = new List<DataModel>();

            for (var i = 0; i < 10000; i++)
            {
                _data.Add(new DataModel {Id = i + 1, Text = "Data Item " + (i + 1)});
            }
        }

        [HttpGet]
        [Route("{pageIndex:int}/{pageSize:int}")]
        public PagedResponse<DataModel> Get(int pageIndex, int pageSize)
        {
            return new PagedResponse<DataModel>(_data, pageIndex, pageSize);
        }
    }

We don't need to connect to a database to make this work, so we just dummy up 10,000 "items" and page through that instead. If you chose to use Entity Framework, the code is exactly the same, except you initialise a `DbContext` and query a `Set` instead.

### PagedResponse

Add the following code;

    public class PagedResponse<T>
    {
        public PagedResponse(IEnumerable<T> data, int pageIndex, int pageSize)
        {
            Data = data.Skip((pageIndex - 1)*pageSize).Take(pageSize).ToList();
            Total = data.Count();
        }

        public int Total { get; set; }
        public ICollection<T> Data { get; set; }
    }

`PagedResponse` exposes two properties. `Total` and `Data`. `Total` is the total number of records in the set. `Data` is the subset of data itself. We have to include the total number of items in the set so that `ng2-pagination` knows how many pages there are in total. It will then generate some links/buttons to enable the user to skip forward several pages at once (or as many as required).

## Enable CORS (Cross Origin Resource Sharing)

To enable communication between our client and server, we need to enable Cross Origin Resource Sharing (CORS) as they will be (at least during development) running under different servers. To enable CORS, first install the following package (using NuGet);

<pre>Microsoft.AspNet.WebApi.Cors</pre>

Now open up **WebApiConfig.cs** and add the following to the **Register** method;

    var cors = new EnableCorsAttribute("*", "*", "*");
    config.EnableCors(cors);
    config.MessageHandlers.Add(new PreflightRequestsHandler());

And add a new nested class, as shown;

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

Now when Angular makes a request for data, it will send an **OPTIONS** header first to check access. This request will be intercepted above and will reply with **Access-Control-Allow-Origin** header with value **any** (represented with an asterisk).

## Format JSON response

If, like me, you hate Pascal Case JavaScript (ThisIsPascalCase), you will want to add the following code to your **Application_Start** method;

    var formatters = GlobalConfiguration.Configuration.Formatters;
    var jsonFormatter = formatters.JsonFormatter;
    var settings = jsonFormatter.SerializerSettings;
    settings.Formatting = Formatting.Indented;
    settings.ContractResolver = new CamelCasePropertyNamesContractResolver();

Now lets set up the front end.

## Front-end Angular 2 and ng2-pagination

If you head over the to [Angular 2 quickstart](https://angular.io/docs/ts/latest/quickstart.html), you will see there is a [link to download](https://github.com/angular/quickstart/blob/master/README.md) the quick start source code. Go ahead and do that. I'll wait here. Ok you're done? Lets continue. Install **ng2-pagination** and optionally **bootstrap** and **jquery** if you want this to look pretty. Skip those two if you don't mind.

<pre>npm install --save-dev ng2-pagination bootstrap jquery</pre>

Open up **index.html** and add the following scripts to the header;

    <script src="http.dev.js"></script>
    <script src="ng2-pagination-bundle.js"></script>

    <script src="jquery.js"></script>
    <script src="bootstrap.js"></script>

Also add a link to the bootstrap CSS file, if required.

    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css">

Notice we pulled in **Http**? We will use that for querying our back-end. Add a new file to the **app** folder, called app.component.html. We will use this instead of having all of our markup and TypeScript code in the same file.

## ng2-pagination

Open **app.component.ts**, delete everything, and add the following code instead;

    import {Component, OnInit} from 'angular2/core';
    import {Http, HTTP_PROVIDERS} from 'angular2/http';
    import {Observable} from 'rxjs/Rx';
    import 'rxjs/add/operator/map';
    import 'rxjs/add/operator/do';
    import {PaginatePipe, PaginationService, PaginationControlsCmp, IPaginationInstance} from 'ng2-pagination';

    export interface PagedResponse<T> {
        total: number;
        data: T[];
    }

    export interface DataModel {
        id: number;
        data: string;
    }

    @Component({
        selector: 'my-app',
        templateUrl: './app/app.component.html',
        providers: [HTTP_PROVIDERS, PaginationService],
        directives: [PaginationControlsCmp],
        pipes: [PaginatePipe]
    })
    export class AppComponent implements OnInit {
        private _data: Observable<DataModel[]>;
        private _page: number = 1;
        private _total: number;

        constructor(private _http: Http) {

        }
    }

A quick walk-through of what I've changed;

*   Removed inline HTML and linked to the **app.component.html** file you created earlier. (This leads to cleaner seperation of concerns).
*   Imported `Observable`, `Map`, and `Do` from RX.js. This will enable us to write cleaner async code without having to rely on promises.
*   Imported a couple of class from **angular2/http** so that we can use the native Http client, add added `HTTP_PROVIDERS` as a provider.
*   Imported various objects required by ng2-pagination, and added to **providers**, **directives** and **pipes** so we can access them through our view (which we will create later).
*   Defined two interfaces, one called `PagedResponse<T>` and `DataModel`. You may notice these are identical to those we created in our Web API project.
*   Add some variables, we will discuss shortly.

We've got the basics in place that we need to call our data service and pass the data over to ng2-pagination. Now lets actually implement that process.

## Retrieving data using Angular 2 Http

Eagle eyed readers may have noticed that I've pulled in and implemented the `OnInit` method, but not implemented the `ngOnInit` method yet. Add the following method;

    ngOnInit() {
        this.getPage(1);
    }

When the page loads and is initialised, we want to automatically grab the first page of data. The above method will make that happen. **Note:** If you are unfamiliar with `ngOnInit`, please read this helpful documentation on [lifecycle hooks](https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html). Now add the following code;

    getPage(page: number) {
    this._data = this._http.get("http://localhost:52472/api/data/" + page + "/10")
        .do((res: any) => {
            this._total = res.json().total;
            this._page = page;
        })
        .map((res: any) => res.json().data);
    }

The above method does the following;

*   Calls out to our Web API (you may need to change the port number depending on your set up)
*   Passes in two values, the first being the current page number, the second being the number of results to retrieve
*   Stores a reference to the `_data` variable. Once the request is complete, `do` is executed.
*   Do is a function (an arrow function in this case) that is executed for each item in the collection received from the server. We've set up our Web API method to return a single object, of type `PagedResponse`, so this method will only be executed once. We take this opportunity to update the current page (which is the same as the page number passed into the method in the first place) and the `_total` variable, which stores the total number of items in the entire set (not just the paged number).
*   Map is then used to pull the data from the response and convert it to JSON. The way that RX.js works is that an event will be emitted to notify that the collection has changed.

## Implement the view

Open **app.component.html** and add the following code;

    <div class="container">
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Text</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="#item of _data ' async ' paginate: { id: 'server', itemsPerPage: 10, currentPage: _page, totalItems: _total }">
                    <td>{{item.id}}</td>
                    <td>{{item.text}}</td>
                </tr>
            </tbody>
        </table>
        <pagination-controls (pageChange)="getPage($event)" id="server"></pagination-controls>
    </div>

There are a few key points on interest here;

*   On our repeater (`*ngFor`), we've used the `async` pipe. Under the hood, Angular subscribes to the `Observable` we pass to it and resolves the value automatically (asynchronously) when it becomes available.
*   We use the `paginate` pipe, and pass in an object containing the current page and total number of pages so ng2-pagination can render itself properly.
*   Add the `pagination-controls` directive, which calls back to our `getPage` function when the user clicks a page number that they are not currently on.

As we know the current page, and the number of items per page, we can efficiently pass this to the Web API to only retrieve data specific data.

## So, why bother?

Some benefits;

*   Potentially reduce initial page load time, because less data has to be retrieved from the database, serialized and transferred over.
*   Reduced memory usage on the client. All 10,000 records would have to be held in memory!
*   Reduced processing time, as only the paged data is stored in memory, there are a lot less records to iterate through!

Drawbacks;

*   Lots of small requests for data could reduce server performance (due to chat. Using an effective caching strategy is key here.
*   User experience could be degegrated. If the server is slow to respond, the client may appear to be slow and could frustrate the user.

## Summary

Using ng2-pagination, and with help from RX.js, we can easily add pagination to our pages. Doing so has the potential to reduce server load and initial page render time, and thus can result in a better user experience. A good caching strategy and server response times are important considerations when going to production.