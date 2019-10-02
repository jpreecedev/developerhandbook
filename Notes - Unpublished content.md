## How to set up Passport.js with Json Web Tokens (JWT)

Start by installing the necessary dependencies;

```shell
npm install --save await-to-js bcrypt cookie-parser body-parser dotenv jsonwebtoken passport passport-jwt
```

We have several different libraries here for various reasons, so let's discuss.

1. **await-to-js**. Not strictly required, but this is a nice little library that simplifies the use of `Promise` (which we will use heavily). We use `await-to-js` to call a `Promise`, and it gives us the error (if any) and the result of the call in an array which we can then destructure and assign names as we require. We will see many examples of this in action.
2. **bcrypt**. We will store the users passport in our _database_, so we need to ensure that the passwords are salted and hashed, for proper security should the database ever got compromised.
3. **cookie-parser**. An Express middleware that simplifies setting and reading cookies from the request. We will use cookies to store the users JWT. The cookie will be sent along with every request, and we will use it to verify the users identity and access level within the system.
4. **body-parser**. Useful for transforming the incoming request into various shapes, primarily in URL Encoded and JSON formats.
5. **dotenv**. Another library that is not strictly required. We will need to store some _secret_ config somewhere, and by secret, I mean, strings that I don't necessarily want to end up in the GIT commit history (like database connection strings and passwords). Dotenv makes this easy, and exposes the resulting values on `process.env`.
6. **jsonwebtoken**. The library used to sign and verify tokens.
7. **passport**. The core authentication library.
8. **passport-jwt**. The JWT specific implementation of Passport.

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

Here we have plumbed in the middlewares we already installed, and two new middlewares (which we will create). One called `router` will add our own custom routes, and the other called `initialiseAuthentication`, which will add our Passport.js strategies into the pipeline.

Inside `server`, add a new directory called `router`, and a new file called `index.js`. Add the following code;

```javascript
import authRoutes from './auth.routes'

function Router(app) {
  app.use(`${process.env.BASE_API_URL}/auth`, authRoutes)
}

export default Router
```

In this code sample we encounter our first usage of `process.env`. We need an easily sharable and easily updatable base url for our API. We will use `dotenv` for this purpose.

In the very root of the project, create a new file called `.env` and add the following;

```text
BASE_API_URL=/api
```

To configure `dotenv`, head back to `server/index.js` and add the **following code on line 1**. The code must go on line 1 to ensure proper behaviour.

```diff
++require("dotenv").config()

import express from "express";
import next from "next";
import { urlencoded, json } from "body-parser";

// Code omitted for brevity
```

With `dotenv` configured, we know going forward that the value of `process.env.BASE_API_URL` will be `/api`. So our base route is `/api/auth`. Will will add more routes to this base route next.

Inside the `router` directory, add a new file called `auth.routes.js`. Add the following code;

```javascript {10,16}
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

As an important side note, it is worth discussing what we see on lines 10 and 15 (highlighted). To simplify the downstream code, and, most importantly, for consistency, no matter what the response is (a successful request, or otherwise) we will always return a JSON object with two properties; `success` and `data`. If the request was successful (to the database, third party website, etc) we return `{ success: true, data: <...> }`. In the event of an error, we return `{ success: false, data: <error details> }`. We can use the response to display an appropriate error message to the user.

As these routes are child routes, we now the following; `/api/auth/login` and `/api/auth/register`.

There are several moving pieces here, so we need to carry on adding code before we can test things out. Next, we should create the `initialiseAuthentication` middleware that we added to `server/index.js`.

Create a new directory inside `server`, called `auth`, and add a new file called `index.js`. Add the following code;

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

We have created our middleware function and from there called `utils.setup()`, which will do some basic Passport wiring that will be required for all strategies. Then we used a _funky_ function called `pipe`, and passed it our as of yet undefined JWT Strategy. Pipe is a functional programming concept. The first argument to pipe is one or many functions (in our case, we will have multiple strategies). The second argument is a parameter that gets passed to the first strategy. The first strategy uses `app`, modifies it, uses app however it needs to, and then at the end returns it back. `app` then gets passed to the next strategy, and so on. It might seem a little heavy handed right now, but this will make for way tidied and less repetitive code further down the line.

Finally, we need our Passport setup logic. Inside the `auth` directory, create a new file called `utils.js` and add the following code;

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

This function tells Passport how to `serialize` and `deserialize` our `user` object from the request, so that it can be piped down to the rest of our application. This leads us on nicely to our next problem. Where are we going to store our users?

### Step 2 - Set up and use a simple JSON based database

We need somewhere to keep track of users who have registered with the website and their role/permissions. In a typical website you might use MongoDB, some other NoSQL database, or even a relational database like Postgres. Thats all good, but setting up a real database is out of scope of this blog post. Refer to your favourite search engine for more information on that. For this project, we will use a file-based database, provided by **Lowdb**, a simple file-based database for Node/Electron (powered by Lodash, but don't let that put you off!).

We will structure the code in such a way that if you wanted to continue building out this website, it would be very easy to replace Lowdb with a real database with minimal code changes. We will use `uuid` for creating unique primary keys for each of our users.

In the previous step we imported an object called `UserModel` from `../database/schema`, but we never defined it. Let's do that now.

Start by installing Lowdb as follows;

```shell
npm install --save lowdb uuid
```

In the `server` directory, create a new directory called `database` and another directory within called `schema`. Add a new file called `index.js` and add the following code;

```javascript
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import uuid from 'uuid/v4'

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ users: [] }).write()

const UserModel = (() => {
  const findById = id =>
    db
      .get('users')
      .find({ _id: id })
      .value()

  const create = user => db.get('users').push({ _id: uuid(), ...user })

  return {
    findById,
    create
  }
})()

export { UserModel }
```

### Expand on;

Add a new env variable; JWT_SECRET=some random string because reasons

### Step 4 -Initialise the authentication strategy, explain what pipe does (and why using pipe tidies up the code)

### Step 5 - flesh out JWT strategy

### Step 6 - Wire up registration form, add user to in-memory array

### Step 7 - Wire up login form, using in-memory user array to validate credentials

## How to set up Passport.js with Google Strategy

### Step 1 - Install dependencies, create empty Google Strategy, explain where to get client secrets

### Step 2 - Flesh out Google strategy

### Step 3 - Add login with Google button on login page

## How to set up Passport.js with Facebook Strategy

### Step 1 - Install dependencies, create empty Facebook Strategy, explain where to get client secrets

### Step 2 - Flesh out Facebook strategy

### Step 3 - Add login with Facebook button on login page

## How to build a simple role-based authorisation system with Passport.js

### Step 1- Define some roles

### Step 2- Make a secure route that requires user to be an administrator (possibly hard code in the user credentials)

### Step 3- Show how user is redirected to login page if they are not in the appropriate role

## Summary
