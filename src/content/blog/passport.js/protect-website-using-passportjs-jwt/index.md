---
title: How to protect your website using Passport.js and JWT
description: In the second post in this Passport.js mini-series, we discuss how to set-up Passport.js, JWT, and MongoDB allowing users to register and log in
pubDate: 2019-10-05
categories: ['Passport.js', 'passport-authentication-series']
seriesTitle: Comprehensive Passport.js Mini-Series
group: 'Software Development'
heroImage: /assets/passportjs-jwt-jsonwebtoken.png
---

In the previous post in this mini-series, we started our conversation about [building an authentication system using Node.js, Express and Passport.js](/passport.js/node-express-passport-authentication-mini-series/). This tutorial assumes that you already have a starting point (a login/registration form, and access to an Express back-end), if you do not, please check out the aforementioned blog post. If you already have these pieces in place, then you're ready to get started.

**The purpose of this post** is to go in to the specifics of wiring up _Passport.js JWT Authentication Strategy_.

**You will learn** the following;

- How to install and set up Passport.js
- How to set up Passport.js JWT strategy, which can issue and verify tokens, read cookies from each request, and populate `req.user`
- How to create your own custom login and registration routes
- How to use _dotenv_ to keep secrets out of your codebase
- **Bonus**, we will set up and use MongoDB and Mongoose to persist user credentials

Once this tutorial is finished, users will be able to login and register with your site. Role-based authorisation will be covered in a subsequent post in this series.

## Source code is available

All the code in this series is open source, and available to view and use on <a href="https://github.com/jpreecedev/passport-next-auth-tutorial" target="_blank">GitHub</a>.

Let's get started. This is a long one.

## How to set up Passport.js with JSON Web Tokens (JWT)

Start by installing the necessary dependencies;

```shell
npm install --save await-to-js bcrypt cookie-parser body-parser dotenv jsonwebtoken passport passport-jwt
```

We have several different libraries here for various reasons, so let's discuss.

1. **passport**. The core authentication library.
2. **passport-jwt**. The JWT extension for Passport.
3. **jsonwebtoken**. The library used to sign and verify tokens.
4. **bcrypt**. Passwords are stored in our database, so we need to ensure they are protected in the event of a security breach
5. **await-to-js**. Not strictly required, but this is a nice little library that simplifies the use of `Promise` (which we will use heavily).
6. **cookie-parser**. An Express middleware that simplifies setting and reading cookies from the request. We will use a HTTP only cookie to store the users JWT.
7. **body-parser**. For parsing JSON in the body of requests.
8. **dotenv**. Used for keeping applications secrets out of the repository.

With our dependencies in place, we can go ahead and put some wiring in place.

### Step 1: Initialise passport, add basic routes for login and registration

Open `server/index.js` and make the following alterations;

```diff
import express from 'express'
import next from 'next'
+import { urlencoded, json } from "body-parser";
+import cookieParser from "cookie-parser";
+import passport from "passport";

+import router from "./router";
+import { initialiseAuthentication } from "./auth";

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const port = 3000

nextApp.prepare().then(() => {
  const app = express()

  app.get('/my-custom-route', (req, res) =>
    res.status(200).json({ hello: 'Hello, from the back-end world!' })
  )

+  app.use(urlencoded({ extended: true }));
+  app.use(json());
+  app.use(cookieParser());
+
+  app.use(passport.initialize());
+
+  router(app);
+  initialiseAuthentication(app);

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  app.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on localhost:${port}`)
  })
})
```

Here we have plumbed in the middleware we already installed, and two new middlewares (which we will create). One called `router` will add our own custom routes, and the other called `initialiseAuthentication`, which will add our Passport.js strategies into the pipeline.

Inside `server`, create a new directory called `router`, and a new file called `index.js`. Add the following code;

```javascript
import authRoutes from './auth.routes'

function Router(app) {
  app.use(`${process.env.BASE_API_URL}/auth`, authRoutes)
}

export default Router
```

In this code sample we encounter our first usage of `process.env`. We need an easily sharable and easily updatable base URL for our API. We will use [dotenv](https://www.npmjs.com/package/dotenv) for this purpose.

In the very root of the project, create a new file called `.env` and add the following;

```plaintext
BASE_API_URL=/api
```

<div class="alert alert-warning">Please ensure that you have an entry in your <strong>.gitignore</strong> for <strong>.env</strong> files as you do not want to commit them normally.  .env files often contain sensitive details such as login credentials.</div>

To configure `dotenv`, head back to `server/index.js` and add the **following code on line 1**. The code must go on line 1 to ensure proper behaviour.

```diff
+require("dotenv").config()

import express from "express";
import next from "next";
import { urlencoded, json } from "body-parser";

// Code omitted for brevity
```

With `dotenv` configured, we know going forward that the value of `process.env.BASE_API_URL` will be `/api`, meaning our base route is `/api/auth`. We will add more routes to this base route next.

Inside the `router` directory, add a new file called `auth.routes.js`. Add the following code;

```javascript {8,14}
import express from 'express'

const router = express.Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  return res.status(200).json({ success: true, data })
})

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  return res.status(200).json({ success: true, data: null })
})

export default router
```

As an important side note, it is worth discussing what we see on lines 8 and 14 (highlighted). To simplify the downstream code, and, most importantly, for consistency, no matter what the response is (a successful request, or otherwise) we will always return a JSON object with two properties; `success` and `data`. If the request was successful (to the database, third party website, etc) we return `{ success: true, data: <...> }`. In the event of an error, we return `{ success: false, data: <error details> }`. We can use the response to display an appropriate error message to the user. We will also, of course, return the appropriate `statusCode` in all cases.

As these routes are child routes, the full path to each route is now; `/api/auth/login` and `/api/auth/register`.

## How to set-up MongoDB and Mongoose

We need somewhere to keep track of users who have registered with the website and their role/permissions. We need to get this sorted before we can get started wiring up Passport, as we will need to query the database to retrieve the `User` object and attach it to the request.

[MongoDB Atlas](https://www.MongoDB.com/cloud/atlas) is a fully managed service that has a fantastic free tier available for developers learning how to build document databases. MongoDB has a long-established history, is battle hardened, and is often used as part of the M.E.R.N (Mongo, Express, React, Node) stack (the stack we're using to build our web app!).

**We will use MongoDB Atlas** throughout this tutorial mini-series. If you need help creating a Mongo database, please refer to my very quick and easy [MongoDB Atlas using Mongoose and Node](/mongodb/connect-mongo-atlas-mongoose/) tutorial. If you already have access to an existing Mongo instance, you could use that instead.

<div class="alert alert-warning">The rest of this tutorial assumes that you have access to an instance of MongoDB, and that you have the connection string ready to use (we will add it to our application shortly).</div>

[Mongoose.js](https://mongoosejs.com/) is a light wrapper around Mongo's API, which makes defining a data schema and querying the database much easier, so we will use that as well.

To install Mongoose, run the following command;

```shell
npm install --save mongoose
```

We need to define our `UserModel`, which will be a Mongoose schema object, that will store details about our user.

In `server`, create a directory called `database`, then inside `database` create a new directory called `schema`. The folder structure should be `server > database > schema`.

Inside `schema`, create a new file called `index.js`, and add the following code;

```javascript
import { UserModel } from './user'

export { UserModel }
```

This file just re-exports all of our models, so as to keep the imports cleaner later.

Create a new file in `schema` called `user.js`, and add the following code;

```javascript
import { model, Schema } from 'mongoose'

const UserSchema = new Schema({
  email: String,
  password: String,
  businessName: String,
  firstName: String,
  lastName: String,
  displayName: String,
  providerId: String,
  provider: String
})

const UserModel = model('User', UserSchema)

export { UserModel }
```

The model states that our `User` object has many properties, including;

- **email** that the user used to register, whether that be using our JWT strategy, or any other OAuth provider
- **providerId**, which is the Id handed to us from the OAuth provider (which we will wire up later in this series)
- **provider**, the name of the provider in which the `providerId` came from

With the schema in place, we can move on.

Inside the `database` directory, create a new directory called `user` and add a new file called `index.js`. This will house the code that will query/update the database for us.

Add the following code;

```javascript
import { getUserById } from './get'

export { getUserById }
```

And create another new file called `get.js`. Add the following code;

```javascript
import { UserModel } from '../schema'

async function getUserById(id) {
  return await UserModel.findById(id).exec()
}

export { getUserById }
```

We now have this piece in place for retrieving our `user` from the database, using their `user.id` property. `findById` is a function made available by Mongoose that calls through to MongoDB and fetches the data in question.

As the final phase of this part of the tutorial, we need to connect to our database. The process should be the same regardless of whether you are using a local Mongo instance, or a hosted service like MongoDB Atlas.

Open `server/index.js` and make the following changes;

```diff
require("dotenv").config()

import express from "express"
import next from "next"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import passport from "passport"
import compression from "compression"

import router from "./router"
+import { connectToDatabase } from "./database/connection"
import { initialiseAuthentication, utils } from "./auth"

// Code omitted for brevity

-nextApp.prepare().then(() => {
+nextApp.prepare().then(async () => {

  // Code omitted for brevity

  app.get("*", (req, res) => {
    return handle(req, res)
  })

+ await connectToDatabase()

  app.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on ${process.env.SERVER_URL}`)
    console.log(`${process.env.NODE_ENV}`)
  })
})
```

We have added an asynchronous call to connect to our database. Let's flesh that out.

In the `server/database` directory, create a new file called `connection.js` and add the following code;

```javascript
import { connect, connection } from 'mongoose'

const connectToDatabase = async () =>
  await connect(process.env.DB_CONNECTION_STRING || '', {
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    useNewUrlParser: true
  })

export { connectToDatabase, connection }
```

Here we call `connect` (a light wrapper around Mongo's connect function, which opens a connection with the database) and pass it a connection string (we will define this shortly). We also pass in some sensible default options that determine how connections are managed.

To add the environment variable for the database connection string, open `.env` (in the root of your project) and make the following changes;

```diff
BASE_API_URL=/api
+DB_CONNECTION_STRING=mongodb://root:example@localhost:27017/test?authSource=admin&w=1
```

Of course, enter your own connection string provided to you by MongoDB Atlas, or the connection string that was created for you when you set up your Mongo instance.

## How to set up Passport.js JWT Authentication Strategy

We're getting towards the interesting bit now, where we plug JWT into our pipeline.

First, we should define the `initialiseAuthentication` middleware that we added to `server/index.js`.

Create a new directory inside `server`, called `auth`, add a new file called `index.js`, then add the following code;

```javascript
import * as utils from './utils'
import * as strategies from './strategies'

const pipe = (...functions) => args => functions.reduce((arg, fn) => fn(arg), args)

const initialiseAuthentication = app => {
  utils.setup()

  pipe(strategies.JWTStrategy)(app)
}

export { utils, initialiseAuthentication, strategies }
```

We will define the JWT strategy next, but first let's discuss what just happened here.

We have defined our middleware function (`initialiseAuthentication`) and called `utils.setup()`, which will do some Passport wiring that will be required for all strategies. Then we used a function programming concept called `pipe`, and passed it our as of yet undefined `JWTStrategy`. The first argument to pipe is one or many functions (in our case, we will have multiple strategies once this tutorial series is complete, as we will be adding Google and Facebook), and second argument (`app`) is a parameter that gets passed to the first strategy. The first strategy uses `app`, modifies it, adds to it, does what it needs to do, and then at the end returns it back. `app` then gets passed to the next strategy, and so on. It might seem a little heavy handed right now, but this will make for way tidier and less repetitive code further down the line.

Inside the `server/auth` directory, create a new directory called `strategies`, and a new file within called `index.js`. Add the following code;

```javascript
import { strategy as JWTStrategy } from './jwt'

export { JWTStrategy }
```

When we later come to add more strategies, we will import them into this file.

For the JWT strategy, create a new file called `jwt.js` and add the following code;

```javascript
import passport from 'passport'
import passportJWT from 'passport-jwt'
import { to } from 'await-to-js'

import { getUserById } from '../../database/user'
import { signToken } from '../utils'

const JWTStrategy = passportJWT.Strategy

const strategy = () => {
  const strategyOptions = {
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true
  }

  const verifyCallback = async (req, jwtPayload, cb) => {
    // TODO
  }

  passport.use(new JWTStrategy(strategyOptions, verifyCallback))
}

const login = (req, user) => {
  return new Promise((resolve, reject) => {
    // TODO
  })
}

export { strategy, login }
```

We will split this code into two separate discussions, so we don't miss any important details.

First, we import `Strategy` from `passport-jwt` and start configuring it. The strategy, as with most Passport strategies, requires two arguments; a `StrategyOptions` object that describes how to retrieve the JWT from the request, and a `verifyCallback` function, which uses the token parsed from the request to retrieve the user from the database.

Note that on line 13, we have used an environment variable for `secretOrKey`. This is used to verify the tokens signature. The secret can be of any value. Open your `.env` file and make the following changes;

```diff
BASE_API_URL=/api
DB_CONNECTION_STRING=mongodb://root:example@localhost:27017/test?authSource=admin&w=1
+JWT_SECRET=this is a random string
```

With the `StrategyOptions` object in place, we can now flesh out our `verifyCallback` function.

Make the following changes;

```diff
// Code omitted for brevity

const verifyCallback = async (req, jwtPayload, cb) => {
-  // TODO
+  const [err, user] = await to(getUserById(jwtPayload.data._id))
+
+  if (err) {
+    return cb(err)
+  }
+  req.user = user
+  return cb(null, user)
}
```

First, we call `getUserById`, which is the function we wrote earlier to fetch a user from the database, based on a given `id`. We use the `_id` that was provided to us as part of the `jwtPayload` by `passport-jwt`. We wrapped the function call in `to`, which is a function from `await-to-js`. Normally I am very reluctant to pull in utility functions like this, but for this library I make an exception. The utility is extremely simple, it calls the given `Promise` and attaches an error handler. If the error handler is called, the error object is passed back to us along with `null` for the result of the call. If the promise is successful, the error is `null` and the data object is populated. All this library essentially does is remove the need for us to have `try...catch...finally` statements in our code, which makes it read easier and flow better in my opinion.

Once we have the `user` object from the database, we attach it to the request and pass it back to the callback (`cb`) function.

We will flesh out the `login` function when we come to wire up the login route we defined earlier.

The last big part of configuring Passport, we need to tell Passport how to get our `User` from the request, and how query the user from the database, using the `id`. Inside the `auth` directory, create a new file called `utils.js` and add the following code;

```javascript
import passport from 'passport'
import { UserModel } from '../database/schema'

const setup = () => {
  passport.serializeUser((user, done) => done(null, user._id))

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id)
      return done(null, user)
    } catch (err) {
      return done(err, null)
    }
  })
}

export { setup }
```

## How to write a registration endpoint in Express

With the main code for Passport in place, we can shift focus to fleshing out our Register and Login routes. We added placeholders earlier, so we will go ahead and fill those in now.

Open `auth.routes.js` and make the following changes;

Start by updating the `import`s for `auth.routes.js`, as follows;

```diff
import express from 'express'
+import { to } from 'await-to-js'
+import { verifyPassword, hashPassword } from '../auth/utils'
+import { login } from '../auth/strategies/jwt'
+import { createUser, getUserByEmail } from '../database/user'
```

Then make the following changes to the `/register` route;

```diff
// Code omitted for brevity

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body

+  if (!/\b\w+\@\w+\.\w+(?:\.\w+)?\b/.test(email)) {
+    return res.status(500).json({ success: false, data: 'Enter a valid email address.' })
+  } else if (password.length < 5 || password.length > 20) {
+    return res.status(500).json({
+      success: false,
+      data: 'Password must be between 5 and 20 characters.'
+    })
+  }
+
+  let [err, user] = await to(
+    createUser({
+      firstName,
+      lastName,
+      email,
+      password: await hashPassword(password)
+    })
+  )
+
+  if (err) {
+    return res.status(500).json({ success: false, data: 'Email is already taken' })
+  }
+
+  const [loginErr, token] = await to(login(req, user))
+
+  if (loginErr) {
+    console.error(loginErr)
+    return res.status(500).json({ success: false, data: 'Authentication error!' })
+  }
+
+  return res
+    .status(200)
+    .cookie('jwt', token, {
+      httpOnly: true
+    })
+    .json({
+      success: true,
+      data: '/'
+    })
-  return res.status(200).json({ success: true, data })
})
```

The register route has various responsibilities.

1. Verify that the given email is indeed an email address
2. Hash the given password, so that it is not stored in plain text in the database (this would be a security risk)
3. Create the user in the database
4. Log the user in, so they don't have to be redirected to the login screen
5. Set a cookie on the request, which will be passed back on subsequent requests, so the user can stay logged in

We have two functions here that are not currently fleshed out (`login` and `hashPassword`), so we will do that now.

Open `auth/strategies/jwt.js` and note that we have a `login` function that does nothing currently.

Make the following changes;

```diff
const login = (req, user) => {
  return new Promise((resolve, reject) => {
-    // TODO
+    req.login(user, { session: false }, err => {
+      if (err) {
+        return reject(err)
+      }
+
+      return resolve(signToken(user))
+    })
  })
}
```

Passport gives us a `login` function (attached to the request) that we have to call with the given user. If the login is successful, we generate a JWT using the user object and return it back.

We will use a utility function that we will write to generate the token.

Open `auth/utils.js` and add make the following changes;

```diff
import passport from 'passport'
+import jwt from "jsonwebtoken"
import { UserModel } from '../database/schema'

// Code omitted for brevity

+const signToken = (user) => {
+  return jwt.sign({ data: user }, process.env.JWT_SECRET, {
+    expiresIn: 604800
+  })
+}

-export { setup }
+export { setup, signToken }
```

This will issue a token that will expire in 7 days. With the login function in place, we can take care of the `hashPassword` function. We will create another utility for this.

In order to safely and securely hash the user's password, we will use a third-party library, rather than attempt to do this ourselves. We will use [bcrypt](https://www.npmjs.com/package/bcrypt), a battle tested library specifically for this purpose.

Open `auth/utils.js` and make the following changes;

```diff
+import bcrypt from "bcrypt"

// Code omitted for brevity

+const hashPassword = async password => {
+  if (!password) {
+    throw new Error('Password was not provided')
+  }
+
+  const salt = await bcrypt.genSalt(10)
+  return await bcrypt.hash(password, salt)
+}

-export { setup, signToken }
+export { setup, signToken, hashPassword }
```

First, we generate a salt, then pass the salt to the `hash` function, along with the `password`, to generate the hashed password. Our hashed and salted password is what is stored in the database.

With the user data ready, we need to write a `createUser` function so that the new user can be saved to the database.

In the `database/user` directory, create a new file called `create.js` and add the following code;

```javascript
import { UserModel } from '../schema'

async function createUser({
  firstName,
  lastName,
  email,
  password,
  providerId,
  provider
}) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findOne({ email })

    if (user) {
      return reject('Email is already in use')
    }

    return resolve(
      await UserModel.create({
        providerId,
        provider,
        firstName,
        lastName,
        email,
        password
      })
    )
  })
}

export { createUser }
```

Hopefully the code is fairly self-explanatory. We first check the database to make sure there is not an existing user with the same email address that has been provided. If there is, we throw an error.

Otherwise, we create the user in the database and return the newly created user object back to the caller.

Open the `index.js` file inside the `user` directory, and make the following changes;

```diff
import { getUserById } from './get'
+import { createUser } from './create'

-export { getUserById }
+export { getUserById, createUser }
```

This ensures that our newly created `createUser` function is accessible.

With the user created, we can go ahead and log the user in, so that we don't have to redirect them to the login page. As we already wrote the `login` function, we just have to make use of it here, passing in the request and user objects.

<small>Code shown here again for context, no edits needed (see the highlighted lines below);</small>

```javascript
// NO EDITS REQUIRED

let [err, user] = await to(
  createUser({
    firstName,
    lastName,
    email,
    password: await hashPassword(password)
  })
)

if (err) {
  return res.status(500).json({ success: false, data: 'Email is already taken' })
}

const [loginErr, token] = await to(login(req, user))

if (loginErr) {
  console.error(loginErr)
  return res.status(500).json({ success: false, data: 'Authentication error!' })
}

return res
  .status(200)
  .cookie('jwt', token, {
    httpOnly: true
  })
  .json({
    success: true,
    data: '/'
  })
```

Assuming there are no errors, we can go ahead and set a `jwt` cookie on the request. This cookie will be set in the user's browser and will be passed back-and-forth with each request automatically. We have marked the cookie as `httpOnly`, meaning it cannot be access via JavaScript. If your server has full end-to-end encryption, you could also set this cookie as secure.

The code for that might look something like this;

```javascript
return res
  .status(200)
  .cookie("jwt", token, {
    secure:
      process.env.NODE_ENV == `production` && process.env.SERVER_URL.includes("https"),
    maxAge: Date.now() + 60 * 60 * 1000 * 4,
    domain:
      process.env.NODE_ENV == `production`
        ? process.env.SERVER_URL.replace(/http:\/\/|https:\/\//g, "")
        : "localhost"
    httpOnly: true
  })
```

<small>The above code has been included for reference only.</small>

The registration route is complete, we can now move on to the login route.

## How to write a login endpoint in Express

With the registration route complete, we can move on to the login route.

Once the user has created an account, and has logged out at some point, it is reasonable for them to want to log in again!

Make the following edits to the `/login` route in `auth.routes.js`;

```diff
// Code omitted for brevity

router.post('/login', async (req, res) => {
  const { email, password } = req.body
+  const [err, user] = await to(getUserByEmail(email))

+  const authenticationError = () => {
+    return res
+      .status(500)
+      .json({ success: false, data: "Authentication error!" })
+  }

+  if (!(await verifyPassword(password, user.password))) {
+    console.error('Passwords do not match')
+    return authenticationError()
+  }
+
+  const [loginErr, token] = await to(login(req, user))
+
+  if (loginErr) {
+    console.error('Log in error', loginErr)
+    return authenticationError()
+  }
+
+  return res
+    .status(200)
+    .cookie('jwt', token, {
+      httpOnly: true
+    })
+    .json({
+      success: true,
+      data: '/'
+    })

-  return res.status(200).json({ success: true, data })
})
```

The login route has various responsibilities.

1. Retrieve the user from the database, based on the supplied email address
2. Verify that the given password matches that stored in the database against the user
3. Log the user in
4. Set a cookie on the request, so the user can stay logged in.

We do not have any means of fetching the user from the database using their email address (we have not fleshed out `getUserByEmail` yet), so we will need to add this.

In the `database/user` directory, we have a file called `get.js`. Make the following changes;

```diff
import { UserModel } from '../schema'

async function getUserById(id) {
  return await UserModel.findById(id).exec()
}

+async function getUserByEmail(email) {
+  return await UserModel.findOne({ email }).exec()
+}

-export { getUserById }
+export { getUserById, getUserByEmail }
```

As an email can only belong to one user, we can use `findOne` and expect only one result.

In the same directory, we have an `index.js` file that we need to update to expose the new function we just created. Open `database/user/index.js` and make the following changes;

```diff
-import { getUserById } from './get'
+import { getUserById, getUserByEmail } from './get'

-export { getUserById }
+export { getUserById, getUserByEmail }
```

Next, we need to verify that the given password matches the password we have in place for the user in the database. To keep the code in `auth.routes.js` tidy, we will extract this into our `utils.js` file.

Open `auth/utils.js` and make the following changes;

```diff
// Code omitted for brevity

+const verifyPassword = async (candidate, actual) => {
+  return await bcrypt.compare(candidate, actual)
+}

-export { setup, signToken, hashPassword }
+export { setup, signToken, hashPassword, verifyPassword }
```

Bcrypt makes this very simple for us and simply returns a `boolean` that determines if the password matched or not.

Once the password has been verified, we go ahead and log the user in and set a cookie in their browser, called `jwt`.

The login route is now complete.

## How to connect the registration form to our Express API endpoint

With the hard work of writing the back-end endpoints complete, we can go ahead and connect our login and registration forms and actually see them working correctly.

Start by spinning up your application by running `npm run dev`. Open your browser to `http://localhost:3000/register`.

Next, open your `register.jsx` file and make the following changes;

```diff
+import { server } from '../utils'

// Code omitted for brevity

const Register = () => {
  const classes = useStyles({})
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [submitting, setSubmitting] = React.useState(false)

+  const handleSubmit = async e => {
+    e.preventDefault()
+    const { firstName, lastName, email, password } = formData
+    const { success, data } = await server.postAsync('/auth/register', {
+      firstName,
+      lastName,
+      email,
+      password
+    })
+    if (success) {
+      window.location.replace(data)
+      return
+    }
+  }

  return (
    <main className={classes.layout}>
      <Paper className={classes.paper} elevation={2}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Register
          </Typography>
        </Box>
-        <form method="post" className={classes.form} noValidate>
+        <form method="post" className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="fname"
            autoFocus
          />

       // ....
      </Paper>
    </main>
  )
}
```

When our form gets submitted, it will be `POST`ed to the `/api/auth/register` endpoint. To do this, we need a little utility called `server`, which exposes a `postAsync` function. Let's add that code now and then discuss it.

In the root of your project, create a new directory called `utils` and add a new file called `server.js`. Add the following code;

```javascript
function getServerApiUrl() {
  return process.env.BASE_API_URL
}

const callFetchAsync = async (url, method, body, headers = {}) => {
  try {
    const options = {
      headers: new Headers({
        'Content-Type': 'application/json',
        ...headers
      }),
      body
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(`${getServerApiUrl()}${url}`, {
      method,
      credentials: 'same-origin',
      ...options
    })

    return await response.json()
  } catch (err) {
    return {
      success: false,
      data: err
    }
  }
}

const postAsync = (url, body) => {
  return callFetchAsync(url, 'POST', body)
}

export { postAsync }
```

When making requests to the server, we want to abstract away all the fuss of adding headers, setting the content-type, stringifying the body, and setting credentials. We can also take this opportunity to ensure that when things go wrong and calls to the server fail, that we still return a nice object back to the caller, so as to try and avoid unnecessary errors that stop all execution of JavaScript on the page. We can also fetch the server URL from environment variables so that we don't have to hardcode it.

In the same `utils` directory, create a new file called `index.js`, and add the following code;

```javascript
import * as server from './server'

export { server }
```

There is one final step required for everything to start functioning correctly. We are using _dotenv_ for our environment variables, and referencing them from `process.env`. Normally `process.env` only exists on the server, and is empty or completely unavailable on the client. We can make these values available on the client, using Webpack and Next.js.

In the root of your project, create a new file, called `next.config.js` and add the following code;

```javascript
const { parsed: localEnv } = require('dotenv').config()

module.exports = {
  env: {
    BASE_API_URL: localEnv.BASE_API_URL
  }
}
```

This will make available only our `BASE_API_URL` environment variable to the client. Each time we want to expose an environment variable to the client, we need to add it here to the list. This is intentional, because we don't want to accidentally leak all our secrets to our users! Be sure to re-run `npm run dev` for the change to take effect!

<div class="alert alert-warning">You could write a clever function here that automatically loads all environment variables, but I strongly recommend against it, as you risk exposing your secrets to the client.  I recommend being intentional here and only exposing exactly what you want to expose.</div>

With the registration code now in place, go to your browser (`http://localhost:3000/register`), and enter some registration details (and remember these for later!).

Assuming registration is successful, you should be redirected back to the home page.

Open up Chrome developer tools (or equivalent for Edge, Safari, Firefox etc) and find the Application Cookies panel (shown in the screenshot below).

![JWT HTTP Only Cookie has been created and set in the users browser](/assets/passport-jwt-cookie-chrome-devtools.png)

You can easily view what the cookie contains by heading over to [https://jwt.io](https://jwt.io) and pasting the contents of the `jwt` cookie into the debugger.

![JWT decoded using debugger](/assets/jwt-cookie-decoded.png)

## How to connect the login form to our Express endpoint

With the registration form in place, we can now connect our login form to our login API.

As we currently don't have a means of logging out, use the Chrome developer tools (or your favourite cookie manager browser extension) to delete the JWT cookie that was just set. Then, navigate your browser to `http://localhost:3000/login`.

Open `login.jsx` and make the following changes;

```diff
import { server } from '../utils'

// Code omitted for brevity

const LoginForm = () => {
  const classes = useStyles({})
  const [formData, setFormData] = React.useState({ email: '', password: '' })
  const [submitting, setSubmitting] = React.useState(false)

+  const handleSubmit = async e => {
+    e.preventDefault();
+    const { email, password } = formData
+    const { success, data } = await server.postAsync('/auth/login', {
+      email,
+      password
+    })
+
+    if (success) {
+      window.location.replace(data)
+      return
+    }
+  }

  return (
    <main className={classes.layout}>
      <Paper className={classes.paper} elevation={2}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Login
          </Typography>
          <Typography component="p" gutterBottom>
            Log in to your account dashboard
          </Typography>
        </Box>
-        <form method="post" className={classes.form} noValidate>
+        <form method="post" className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            defaultValue={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
```

Enter your username and password that you used to register earlier, and click "Sign In". Again, you should be redirected to the home page and a `jwt` cookie should have been set in your browser.

## Summary

We have covered a lot of ground in this post. We discussed how to set up Passport.js and JWT, how to issue tokens, verify tokens, and set them in the user's browser as HTTP only cookies. We also took the time to wire up our login and registration forms, extract our secrets into a `.env` file (for security) and we even set up and connected to MongoDB so that we could save details about our registered users.

In the next posts in this mini-series we will focus on adding third-party authentication providers, like Google and Facebook. With a lot of the major plumbing in place, doing so is much more straightforward than you might imagine.
