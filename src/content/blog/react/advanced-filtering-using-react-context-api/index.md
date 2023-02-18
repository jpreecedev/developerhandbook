---
title: Add advanced filtering to a React app using React Context API
description: Learn how to add advanced filtering to a React application using Context API, and local state, to dynamically update a list of data
pubDate: 2019-01-27
categories: ['React', 'Parcel.js', 'practical-react-series']
seriesTitle: Practical React Developer
group: 'Software Development'
---

In the previous tutorial, we started building out our home page. We looked at React Context API, where we added some code to fetch data from our static web server, and then we used that data to build (and display) a list of properties that are currently available for sale.

Next, we need to ensure that we are in-line with the specification set out by the CTO. The end-user must be able to filter the property listings by 'price', 'postcode' and 'sort order'. The page must not reload, the changes must be applied dynmaically.

We will utilise React Context API and local state to achieve our objectives.

First, let's have another look at our mock.

![Rough mock from CTO](/assets/mock-from-designer.png)

The mock shows the following;

- We must display the number of properties currently listed for sale
- We must allow refinement via;
  - Price
  - Postcode
  - Sort order

Let's get started.

**Note for clarification as this is also a standalone post**. This post is part of a mini-series where we are building a real estate property listing website, complete with routing and advanced forms.

## How to build a basic React.js form with no additional libraries

I am not for one second denouncing any open source React form libraries out there. I have used several with varying levels of success and I do not advocate using one over any other. I believe that in our case, we do not need any of the more advanced functionality that some libraries bring to the table. Local state goes a long way. Know your tools!

We can achieve all the filtering behaviour we need simply by using local state and React Context API.

Create a new folder in `src/components` called `filter` and add a new file called `index.js`.

Add the following code (the `class` is required for local state!).

```jsx
import * as React from 'react'
import classnames from 'classnames'

import styles from './styles.module.css'

class Filter extends React.Component {
  render() {
    const containerClasses = classnames('container', 'mb-1', styles.container)
    const formClasses = classnames('form-horizontal', styles.form)

    return (
      <div className={containerClasses}>
        <form className={formClasses} noValidate>
          <p className="mb-1">Refine your results</p>
          <div className="columns text-center">
            <div className="column col-4 col-xs-12">
              <div className="form-group">
                <div className="col-3 col-sm-12">
                  <label className="form-label" htmlFor="price-from">
                    Price from
                  </label>
                </div>
                <div className="col-9 col-sm-12">
                  <input
                    className="form-input"
                    min="0"
                    max="10000000"
                    type="number"
                    id="price-from"
                    placeholder="£1,000,000"
                  />
                </div>
              </div>
            </div>
            <div className="column col-4 col-xs-12">
              <div className="form-group">
                <div className="col-3 col-sm-12">
                  <label className="form-label" htmlFor="postcode">
                    Postcode
                  </label>
                </div>
                <div className="col-9 col-sm-12">
                  <select className="form-select" id="postcode">
                    <option value="">Choose...</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="column col-4 col-xs-12">
              <div className="form-group">
                <div className="col-3 col-sm-12">
                  <label className="form-label" htmlFor="sortorder">
                    Sort Order
                  </label>
                </div>
                <div className="col-9 col-sm-12">
                  <select className="form-select" id="sortorder">
                    <option value="">Choose...</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default Filter
```

And add some custom styles to `styles.module.css` (you should create this);

```css
.form {
  padding: 20px;
  background-color: #f7f8f9;
  border-radius: 0.2rem;
}

.container {
  padding: 0;
}
```

To use the filter, go to `pages/Home/index.js` and use the `<Filter />` component (do not forget to import it!) just above your listings;

```jsx
<React.Fragment>
  <Filter />
  <div className="columns">
    {propertyListings.map(listing => (
      <Listing listing={listing} key={listing.address} />
    ))}
  </div>
</React.Fragment>
```

Your filters should now be displayed on screen.

![Advanced filtering in React.js with no libraries](/assets/reactjs-form-no-libraries.png)

Our filter form consists of;

- A 'price from' input box, which is an `input` of type `number`
- A 'postcode' `select` list, which will display a unique list of postcodes based on the postcodes of the listings
- A 'sort order' `select` list, so the user can order by price in ascending or descending order

We have added several classes from [Spectre.css](https://picturepan2.github.io/spectre/) to add the appropriate styling for mobile and desktop.

So far, no special code, just HTML markup really. Now we need to capture the value for each field and store it in local state.

## React.js forms - Uncontrolled vs Controlled components

So far, our form does not do much. We need to capture the users input for each of the 'price from', 'postcode' and 'sort order' fields, and there are two approaches in React.js to achieve that... _Controlled_ components vs _Uncontrolled_ components.

### What are uncontrolled components/forms

In HTML, input fields (`<input />`, `<select>` etc) naturally store state via the `value` property. With React.js, this default behaviour still works out-of-the-box.

When React does not directly track the internal value of a field, that field is referred to as _uncontrolled_... React has no direct knowledge of the state. To get the value of the input, we need a specific mechanism.

### How to get the value of an uncontrolled input?

To get the value of an uncontrolled input field we need to use a React feature called `ref`, which will assign the native HTML element (in our case, an object of type `HTMLInputElement`) to an instance variable, so we need an ES6 `class` for this.

First, we initialise the instance variable in the `constructor` to the instance of the `class`;

```javascript
class UncontrolledForm extends React.Component {
  constructor(props) {
    super(props)
    this.priceFrom = React.createRef()
  }
  // ...
}
```

The we assign the `ref` property on our input to the `priceFrom` instance variable we just created;

```jsx
<input
  ref={this.priceFrom}
  type="number"
  min="0"
  max="10000000"
  id="price-from"
  placeholder="£1,000,000"
/>
```

When the `<form />` is submitted, we capture the value of the `<input />` using the instance variable as follows;

```javascript
submitForm = e => {
  e.preventDefault()
  alert(`The price from is; ${this.priceFrom.current.value}`)
}
```

I have created a comprehensive and complete example on CodeSandbox. [Uncontrolled Form vs Controlled Form](https://codesandbox.io/s/z4zv8xjwl).

Note that we did not need any local state for this to work.

### What is a controlled input

A controlled input is an input whose value is directly tracked and set/updated by React. The value for each input in a `form` is stored in local state (again, requiring an ES6 `class`) and updated by calling `setState` from the `onChange` event handler.

A typical input will look like this;

```jsx
<input
  type="number"
  min="0"
  max="10000000"
  id="price-from"
  placeholder="£1,000,000"
  value={this.state.priceFrom}
  onChange={e => this.setState({ priceFrom: e.currentTarget.value })}
/>
```

The `value` is derived from the local state, and that state is updated by the `onChange` handler. Calling `setState` causes the component to be re-rendered, which in turn updates the value of the field.

Again, for a comprehensive and complete example on CodeSandbox, see... [Uncontrolled Form vs Controlled Form](https://codesandbox.io/s/z4zv8xjwl).

### Which is better, Uncontrolled vs Controlled components

Generally speaking, from my own personal experience, I find controlled components tidier and easier to understand and work with.

I always default to using controlled components.

After that slight detour, back now to our application.

## Using local state to store form field values

Each field in our form needs to capture the users input as it occurs, and the listings should be immediately updated to reflect this.

Update the 'price from' field as follows;

```jsx
<input
  className="form-input"
  min="0"
  max="10000000"
  type="number"
  id="price-from"
  placeholder="£1,000,000"
  value={this.state.priceFrom}
  onChange={event => this.setState({ priceFrom: Number(event.target.value) })}
/>
```

We are accessing `priceFrom` from state. If you run the code above you should get the following waring;

```plaintext
react-dom.development.js:506 Warning: A component is changing an uncontrolled input of type number to be controlled. Input elements should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://fb.me/react-controlled-components
    in input (created by Filter)
    in div (created by Filter)
    in div (created by Filter)
    in div (created by Filter)
    in div (created by Filter)
    in form (created by Filter)
    in div (created by Filter)
    in Filter (created by Context.Consumer)
    in PropertyListingsProvider (created by Home)
    in div (created by Home)
    in Home
    in div (created by FocusHandlerImpl)
    in FocusHandlerImpl (created by Context.Consumer)
    in FocusHandler (created by RouterImpl)
    in RouterImpl (created by LocationProvider)
    in LocationProvider (created by Context.Consumer)
    in Location (created by Context.Consumer)
    in Router
```

This error is a bit confusing because we _are_ using a controlled component. This error occurs because we have to give the `priceFrom` property on our `state` a sensible default value.

Add the default state to the `class` as follows;

```javascript
state = {
  priceFrom: ''
}
```

The warning should now be resolved and we are now using controlled components properly.

## Finishing the Filter form

To finish the filter form, use the code below to set the default `state` and set each field as a controlled component. We will use the captured data to filter our results next.

The final default state;

```javascript
state = {
  priceFrom: '',
  postcode: '',
  sortOrder: '',
  sortOrders: ['Highest First', 'Lowest First']
}
```

`sortOrders` is never going to change in our application, so we can just store that here for now.

In the `render` function, create a new variable for storing postcodes to display to the user;

```javascript
const postcodes = []
```

This data is dynamic and controlled _outside_ of this component, so we will pass it down later via `props`.

Update the 'postcode' `<select />` field as follows;

```jsx
<select
  className="form-select"
  id="postcode"
  value={this.state.postcode}
  onChange={event => this.setState({ postcode: event.target.value })}
>
  <option value="">Choose...</option>
  {postcodes.map(pc => (
    <option key={pc} value={pc.toLowerCase()}>
      {pc}
    </option>
  ))}
</select>
```

This code is a bit more involved, but is easy to understand. For each postcode, create an `<option />` so that the user can choose it in the picker. The postcodes will be a unique list (we will write that logic soon) so we do not need to worry about duplication.

And update the 'sort order' `<select />` field as follows;

```jsx
<select
  className="form-select"
  id="sortorder"
  value={this.state.sortOrder}
  onChange={event => this.setState({ sortOrder: event.target.value })}
>
  <option value="">Choose...</option>
  {this.state.sortOrders.map(order => (
    <option key={order} value={order.replace(' ', '').toLowerCase()}>
      {order}
    </option>
  ))}
</select>
```

The 'sort order' field is largely the same as the 'postcode' field.

With capturing the user's data now complete, we need to use this data to refine the listings. We will pass the filters up to the `PropertyListingsProvider` (React Context API) we defined earlier.

## How to update the state of a React Context Provider

Currently our state provider (`PropertyListingsProvider`) fetches listings data from our 'server' and stores that in local state as `propertyListings`. We then expose `propertyListings` as part of an object and then pass that object to `value` in our `render` function.

Here is a quick reminder...

```jsx
  render() {
    const { children } = this.props;
    const { propertyListings } = this.state;

    return (
      <PropertyListingsContext.Provider
        value={{
          propertyListings
        }}
      >
        {children}
      </PropertyListingsContext.Provider>
    );
  }
```

We need to update `value` so that it also passes along an update function, which we will define on our `class`.

Add the following function to `PropertyListingsProvider`;

```javascript
updateFilter = filter => {
  this.setState({
    filter
  })
}
```

The function is simple. The function accepts a `filter` argument, and the stores that filter on local state by calling `setState`. Every time this function is called, any components that use the `Consumer` (Hint: Our filter component!) will be automatically re-rendered.

Whilst we are here, we can set our default state to contain an empty `filter` object as follows;

```javascript
const DefaultState = {
  propertyListings: [],
  filter: {}
}
```

We then expose the `updateFilter` function to the consumer as follows;

```jsx
render() {
  const { children } = this.props;
  const { propertyListings } = this.state;

  return (
    <PropertyListingsContext.Provider
      value={{
        propertyListings,
        updateFilter: this.updateFilter,
      }}
    >
      {children}
    </PropertyListingsContext.Provider>
  );
}
```

To use the `updateFilter` function, we can pass it down through `props`.

Open `filter/index.js` and wrap the form as follows;

```jsx
<form
  className={formClasses}
  noValidate
  onChange={() => setTimeout(() => this.props.updateFilter(this.state), 0)}
>
  {'...'}
</form>
```

Every time an element in the form is changed, the `onChange` function will be called, which in turn calls `updateFilter`, passing along our local state. The `setTimeout` is to ensure that React has finished updating the local state before we update our provider (to ensure we do not get an old state).

Update the usage of `<Filter />` in `home/index.js` to pass the `updateFilter` function down as follows;

```jsx
<PropertyListingsConsumer>
  {function(value) {
    const { propertyListings, updateFilter } = value
    return (
      <React.Fragment>
        <Filter updateFilter={updateFilter} />
        <div className="columns">
          {propertyListings.map(listing => (
            <Listing listing={listing} key={listing.address} />
          ))}
        </div>
      </React.Fragment>
    )
  }}
</PropertyListingsConsumer>
```

With the state now being passed to the context provider, we need to utilise it to refine the listings. We need a filter function.

## How to filter an array using filter and sort functions

ES6 has two very useful functions for filtering and sorting arrays (our property listings), conveniently called `filter` and `sort`. We need these two functions to update our UI accordingly.

Open `ProviderListingsProvider` and define a filter function as follows;

```javascript
static applyFilter(listings, filter) {

}
```

This function requires two parameters;

- `listings` is all the unfiltered and unsorted listings
- `filter` is the filter the user has created in our filter form.

The filter contains three fields; `priceFrom`, `postcode` and `sortOrder`. We can easily grab them as follows;

```javascript
const { priceFrom, postcode, sortOrder } = filter
```

If the user has not specified any of these filters, then their respective values will be `undefined`, so we must take this into consideration. It is entirely feasible that the user can specify no filters, so we can default to returning the original unfiltered list of properties as follows;

```javascript
static applyFilter(listings, filter) {
  const { priceFrom, postcode, sortOrder } = filter
  let result = listings
  return result
}
```

First, we can remove all the listings whose price is less than that provided via the filter;

```javascript
if (priceFrom) {
  const from = priceFrom
  result = result.filter(item => item.price >= from)
}
```

Then we can filter out all the listings that do not match the given postcode;

```javascript
if (postcode) {
  result = result.filter(item => item.postcode.toLowerCase().startsWith(postcode))
}
```

And finally, we can sort the array based on if the user selected 'highest first' or 'lowest first'.

```javascript
if (sortOrder) {
  if (sortOrder === 'highestfirst') {
    result = result.sort((a, b) => b.price - a.price)
  }
  if (sortOrder === 'lowestfirst') {
    result = result.sort((a, b) => a.price - b.price)
  }
}
```

The above code can be a bit confusing to understand. For some practical examples of `Array.prototype.sort` with comprehensive documentation and comments, see [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

Here is the complete code for reference;

```javascript
  static applyFilter(listings, filter) {
    const { priceFrom, postcode, sortOrder } = filter
    let result = listings
    if (priceFrom) {
      const from = priceFrom
      result = result.filter(item => item.price >= from)
    }
    if (postcode) {
      result = result.filter(item => item.postcode.toLowerCase().startsWith(postcode))
    }
    if (sortOrder) {
      if (sortOrder === 'highestfirst') {
        result = result.sort((a, b) => b.price - a.price)
      }
      if (sortOrder === 'lowestfirst') {
        result = result.sort((a, b) => a.price - b.price)
      }
    }
    return result
  }
```

This function is marked as `static` because the function does not have to utilise any values other than those provided to it, it is a pure function with no side-effects, therefore we do not need to create an instance of it every time the `class` is initialised (saving memory and compute cycles).

We can now update our `render` function to pass down the filtered listings;

```jsx
render() {
  const { children } = this.props
  const { propertyListings, filter } = this.state

  const filteredListings = PropertyListingsProvider.applyFilter(
    propertyListings,
    filter
  )

  return (
    <PropertyListingsContext.Provider
      value={{
        propertyListings: filteredListings,
        updateFilter: this.updateFilter
      }}
    >
      {children}
    </PropertyListingsContext.Provider>
  )
}
```

Your 'price from' and 'sort order' filters should now be working. We need some extra logic to get postcodes working.

<img src="/assets/react-js-form-filters.gif" alt="React JS working form filters" style="width: 100%; margin-bottom: 20px;">

A UK postcode consists of two parts, the first part is a general area identifier consisting of usually 2, 3 or 4 characters (letters and numbers), the second part is a more specific area identifier. The postcode list should only display the first part of the postcode, and should only be populated with postcodes that have at least one listing associated with it.

We need to display all the postcodes regardless of any other filters being applied. Currently our provider only passes through filtered listings, so we need to pass through all listings as well.

Open `PropertyListingsProvider.js` and update the provider as follows;

```jsx
export class PropertyListingsProvider extends React.Component {
  // ...
  render() {
    // ...
    return (
      <PropertyListingsContext.Provider
        value={{
          allListings: propertyListings,
          propertyListings: filteredListings,
          updateFilter: this.updateFilter
        }}
      >
        {children}
      </PropertyListingsContext.Provider>
    )
  }
}
```

Now open `Home/index.js` and inside the `PropertyListingsConsumer`, destructure `allListings` and use it to pass through the unique list of postcodes, as follows;

```jsx
<PropertyListingsConsumer>
  {function(value) {
    const { propertyListings, allListings, updateFilter } = value
    return (
      <React.Fragment>
        <Filter
          updateFilter={updateFilter}
          postcodes={allListings
            .map(listing => listing.postcode.split(' ')[0])
            .filter((item, i, arr) => arr.indexOf(item) === i)}
        />
        <div className="columns">
          {propertyListings.map(listing => (
            <Listing listing={listing} key={listing.address} />
          ))}
        </div>
      </React.Fragment>
    )
  }}
</PropertyListingsConsumer>
```

And update the `<Filter />` component to use `postcodes` from `props`;

```jsx
<select
  className="form-select"
  id="postcode"
  value={this.state.postcode}
  onChange={event => this.setState({ postcode: event.target.value })}
>
  <option value="">Choose...</option>
  {this.props.postcodes.map(pc => (
    <option key={pc} value={pc.toLowerCase()}>
      {pc}
    </option>
  ))}
</select>
```

You should now be able to filter by postcode.

### A challenge to you, dear reader

It would be nice to show the number of properties that are currently being displayed to the user, for clarity. The number of listings should be displayed directly above the listings grid as shown on the screenshot below.

![React JS working form filters](/assets/properties-count.png)

If you get a bit stuck, the solution is available for you on GitHub. Checkout out [this link to the Premium Property Finder repo](https://github.com/jpreecedev/premium-property-finder/blob/master/src/components/filter/index.js#L43) which will get you on track.

## Summary

This was a long one. The purpose of this post was to get some real hands on experience building out several features and utilising features of React that you will use often in all projects you work on/develop. We created a `form` and bound it to local state with no use of a third-party library, and whilst doing this we discussed the difference between controlled vs uncontrolled components. Next, we extended our state provider (React Context API class) with logic for filtering our listings based on user input and we made it so that the UI will dynamically update whenever changes are made.

The next post in this series will focus on display details of individual listings, including using the `<Map />` and `<KeyFeatures />` components we previously built.
