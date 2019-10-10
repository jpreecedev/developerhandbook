---
layout: post
title: How to restrict access using Passport.js role-based authorisation
description: Learn how to assign roles to your users so as to restrict access to certain parts of your website
date: 2019-10-08
categories: ['Passport.js', 'passport-authentication-series']
seriesTitle: Comprehensive Passport.js Mini-Series
group: 'Software Development'
featuredImage: './passportjs-role-based-authorisation.jpg'
---

Welcome to our mini-series on _Authentication using Node.js, Express, and Passport.js_. This comprehensive series is designed to teach you everything you need to know, as well as give you all the code required, to add authentication and authorisation to your existing website, or for a new-build from-scratch project.

So far in this series, [we have discussed at length Passport.js and JWT](/passport.js/protect-website-using-passportjs-jwt/). We created our project using Next.js, we wrote a [login page and registration page using Material UI for the layout](/passport.js/node-express-passport-authentication-mini-series/), and we added MongoDB and Mongoose for back-end data storage. [Using our website, we can create an account and use it to log in](/passport.js/protect-website-using-passportjs-jwt/). Finally, we [added support for Passport.js Google OAuth strategy](/passport.js/how-to-add-passportjs-google-oauth-strategy/) and [Passport.js Facebook strategy](/passport.js/how-to-add-passportjs-facebook-strategy/).

**The purpose of this post** is to discuss how to implement simple role-based authorisation, which should work well for small websites. A role will be assigned to a user and stored in their JWT, the role will then determine which parts of the website they have access to. The code in this post is meant as an enhancement to code written in previous parts of this mini-series, but should still be generally applicable to existing applications.

**You will learn** the following;

- How to set-up basic role-based authorisation, with two roles; **Admin** and **Customer**

<div class="media bg-light border border-dark rounded p-3 mt-1 mb-3">
  <img src="/github.png" class="mr-3" alt="GitHub">
  <div class="media-body align-self-center">
    <h5 class="mt-0 mb-0">Open source</h5>
    All the code in this series is open source, and available to view and use on <a href="https://github.com/jpreecedev/passport-next-auth-tutorial" target="_blank">GitHub</a>.
  </div>
</div>

Let's get started.

## How to implement basic role-based authorisation with Express

Our website has the following requirements;

- Two roles; **Admin** and **Customer**. More roles _might_ be required in the future, so our code should be open to extension
- All new users registering with the site should be assigned to the _Customer_ role
- We don't specifically need a mechanism to change a user's role from _Customer_ to _Admin_, so a simple Node script will do for now
- When the user logs in/registers, they should be redirected to the right page, determined by their role
- When the user calls an API endpoint, we need to verify that they have permission to do so. If they do not, they should be redirected to the login page
- Anonymous users should not be able to reach protected pages
- An _Admin_ should have access to some of the same pages as a _Customer_

We will try and rattle through this list roughly in order.

### Roles

We need a single source of truth for roles. If we were using TypeScript, we might define and `enum` or similar language construct. In our case, a constant in an easily importable place is sufficient.

In the root level `utils` directory, create a new file called `roles.js` and add the following;

```javascript
const ROLES = {
  Admin: 'Admin',
  Customer: 'Customer'
}

export { ROLES }
```

When we need roles, we can import this `ROLES` map. Having the roles in one central place like this makes it easier to add more roles. In a more complex system, roles would probably be defined in the database in a lookup table.

To complete this code, open `utils/index.js` and make the following changes;

```diff
import * as server from './server'
+import { ROLES } from './roles'

-export { server }
+export { server, ROLES }
```

We can now import roles easily into other files.

### Creating an admin dashboard

Let's focus on a page that is specifically only available to administrators of our system.

Inside the `pages` directory, create a new file called `admin-dashboard.jsx` and add the following code;

```javascript
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles(theme => ({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  paper: {
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(8),
      padding: `${theme.spacing(6)}px ${theme.spacing(4)}px`
    }
  }
}))

const AdminDashboard = () => {
  const classes = useStyles({})
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
            Admin Dashboard
          </Typography>
          <Typography component="p" gutterBottom>
            Welcome, you are logged in as an administrator!
          </Typography>
        </Box>
      </Paper>
    </main>
  )
}

export default AdminDashboard
```

There is no logic here that does any kind of role determination. This component simply renders out the admin dashboard.

There will, in-fact, be no client-side logic that determines the role of the user, this will be entirely determined on the server. The users JWT will contain the role (retrieved from the database). As the JWT is signed, it cannot be tampered with on the client, so there is no risk of privilege escalation.

![Admin Dashboard](admin-dashboard.png)

The customer dashboard (and an anonymous dashboard that we will build later) will look very similar. We're not creating any specific functionality here, we're just focusing on access to pages.

By default, Next handles our routing for us. We need to write some code that responds to a request for a route before Next does.

Open `server/index.js` and make the following changes;

```diff
require('dotenv').config()

import express from 'express'
import next from 'next'
import { urlencoded, json } from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'

import router from './router'
import { connectToDatabase } from './database/connection'
import { initialiseAuthentication, utils } from './auth'
+import { ROLES } from '../utils'

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const port = 3000

nextApp.prepare().then(async () => {
  const app = express()

  app.use(urlencoded({ extended: true }))
  app.use(json())
  app.use(cookieParser())

  app.use(passport.initialize())

  router(app)
  initialiseAuthentication(app)

+  app.get('/admin-dashboard', (req, res) => {
+    return handle(req, res)
+  })

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  await connectToDatabase()

  app.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on localhost:${port}`)
  })
})
```

We added a handler for `/admin-dashboard`. When the route is hit, a response will be served up (the Admin Dashboard page we just created). This is no different to the handler beneath, which handles all requests. The only difference is that now we have the chance to change the default behaviour.

Make the following changes;

```diff
// Code omitted for brevity

  router(app)
  initialiseAuthentication(app)

-  app.get('/admin-dashboard', (req, res) => {
+  app.get('/admin-dashboard', passport.authenticate('jwt', { failureRedirect: '/login' }), (req, res) => {
    return handle(req, res)
  })

  app.get('*', (req, res) => {
    return handle(req, res)
  })
```

Now we have added the Passport's `authenticate` middleware into our pipeline. This checks to see if the user is _logged in_. If they are, the request is allowed to continue and `handle` is eventually called. If the user is not logged in, then the user is redirected to `/login`. There is no role checking going on here, we're just verifying that the user is logged in.

We can write our own middleware that will run after Passport has completed its check.

Make the following changes;

```diff{12}
import { ROLES } from '../utils'

// Code omitted for brevity

  router(app)
  initialiseAuthentication(app)

-  app.get('/admin-dashboard', passport.authenticate('jwt', { failureRedirect: '/login' }), (req, res) => {
+  app.get(
+    '/admin-dashboard',
+    passport.authenticate('jwt', { failureRedirect: '/login' }),
+    utils.checkIsInRole(ROLES.Admin),
+    (req, res) => {
+      return handle(req, res)
+    }
+  )

  app.get('*', (req, res) => {
    return handle(req, res)
  })
```

Here we have introduced our own middleware, `utils.checkIsInRole`, passing in our `ROLES.Admin` object that we defined earlier. We will use that opportunity to determine if the user is in the `Admin` role. If they are, we will let the request continue. Otherwise, we will redirect the user to the `/login` page.

Open `server/auth/utils.js` and make the following changes;

```diff
import passport from 'passport'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
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

const signToken = user => {
  return jwt.sign({ data: user }, process.env.JWT_SECRET, {
    expiresIn: 604800
  })
}

const hashPassword = async password => {
  if (!password) {
    throw new Error('Password was not provided')
  }

  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

const verifyPassword = async (candidate, actual) => {
  return await bcrypt.compare(candidate, actual)
}

+const checkIsInRole = (...roles) => (req, res, next) => {
+  if (!req.user) {
+    return res.redirect('/login')
+  }
+
+  const hasRole = roles.find(role => req.user.role === role)
+  if (!hasRole) {
+    return res.redirect('/login')
+  }
+
+  return next()
+}

-export { setup, signToken, hashPassword, verifyPassword }
+export { setup, signToken, hashPassword, verifyPassword, checkIsInRole }
```

Let's digest this function.

We are using a [curried function here](https://medium.com/javascript-scene/curry-and-function-composition-2c208d774983), another functional programming concept. First, we accept an indeterminate number of roles, and gather them up into an `array`. This will allow users with different roles to access the page.

Consider the following;

- If we call `checkIsInRole` with 1 argument, `ROLES.Admin`, then only administrators will be able to access that page.
- If we call `checkIsInRole` with 1 argument, `ROLES.Customer`, then only customers will be able to access that page.
- If we call `checkIsInRole` with 2 arguments, `ROLES.Admin, ROLES.Customer`, then both administrators and customers will be able to access that page (but not users without a role).

We need the request and response objects, so we return a function that accepts `req, res, next`. This function is called by Express and those arguments are made available to us, and the roles we were given earlier remain in scope.

First, if the user is not logged in (`req.user` is `undefined`), then we immediately redirect to `/login`. This is _belts and braces_ but it's a nice safety check. Next, as we have access to the `user` from the request, we simply use the users `role` object to find a match in the array of `roles` we have been given. If there is no match, then we redirect them to `/login` because they have made an unauthorised request. If there is a match, then the user has the correct permissions and we can call the next middleware in the pipeline (the request can continue) by calling `next`.

## Assign a user to a role

If you have been following along with this tutorial series, you may have noted that we do not currently have a user in a role. Let's fix that.

We create users and add them to our database using a function called `createUser`. This takes a `User` object that contains all the user's details, including their role.

There are three places where we create new users

- Passport.js Google OAuth Strategy (`/server/auth/strategies/google`)
- Passport.js Facebook Strategy (`/server/auth/strategies/facebook`)
- JWT Strategy (`/server/router/auth.routes`)

Go ahead an update each usage of `createUser`, roughly as follows;

```diff
+import { ROLES } from '../../../utils'

// Code omitted for brevity

const [createdError, createdUser] = await to(
  createUser({
    provider: profile.provider,
    providerId: profile.id,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    displayName: profile.displayName,
    email: verifiedEmail.value,
-    password: null
+    password: null,
+    role: ROLES.Customer
  })
)
```

The change should be very similar for each strategy.

**Please** go ahead and assign a role of _Admin_ to your own user. There are two approaches to doing this;

### MongoDB Atlas or another remotely hosted database service

If you are using MongoDB Atlas (or some other hosted database service), use their website to update your record. The process should be along these lines; Go to your database, select the `Users` collection, find your user (should only be one), add a property called `role`, and set its value to `Admin`.

![MongoDB Atlas Inline Editing](./mongodb-atlas-inline-editing.png)

Just remember to click the **Save** or **Apply** buttons, assuming there is one, for your change to take effect.

### Your local Mongo (self-hosted) instance

Create a script in the root of your project, called `db.js`, and add the following code;

```javascript
import { UserModel } from './server/database/schema'
import mongoose from 'mongoose'

const { Types } = mongoose

mongoose.connect('mongodb://root:example@localhost:27017/test?authSource=admin&w=1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

UserModel.find({}).exec((err, users) => {
  users.forEach(u => console.log(u))
})

// UserModel.updateOne({ _id: "<YOUR USER ID>" }, { role: "Admin" }).exec()
```

This is a standalone script that I run using `babel-node` directly from the terminal. For super simplicity, I use **Yarn** to run the script, although you could just called the `babel-node` binary directly from the terminal.

```shell
## Yarn
yarn run babel-node db.js

## Direct
./node_modules/.bin/babel-node db.js
```

Once you have your `user._id`, re-run the script with the `updateOne` line uncommented (and insert your `_id`). Your role should be updated.

You also need to log yourself out (if you are already logged in), because we need to log back in and generate a new token with the updated role. Using your browsers developer tools, delete the `jwt` cookie.

However, just before you go ahead and log back in, try and access [http://localhost:3000/admin-dashboard](http://localhost:3000/admin-dashboard) as an anonymous user. You should be redirected to the `/login` page.

Now, log in and go to [http://localhost:3000/admin-dashboard](http://localhost:3000/admin-dashboard).

You should be able to access the page. The first part of our authorisation functionality is complete.

## Testing the customer role

Testing the customer role should be straightforward, as we automatically assign every new user the `Customer` role. Create a new account with a dummy email address, and try to go to [http://localhost:3000/admin-dashboard](http://localhost:3000/admin-dashboard). You should be redirected to `/login`. This proves that you can be logged in and still not have access to certain pages.

## Add a route to the customer dashboard

Now that we have a user with the `Customer` role, we need some way to test this out.

Open `server/index.js` and make the following changes;

```diff
// Code omitted for brevity

  app.get(
    '/admin-dashboard',
    passport.authenticate('jwt', { failureRedirect: '/login' }),
    utils.checkIsInRole(ROLES.Admin),
    (req, res) => {
      return handle(req, res)
    }
  )

+  app.get(
+    '/customer-dashboard',
+    passport.authenticate('jwt', { failureRedirect: '/login' }),
+    utils.checkIsInRole(ROLES.Customer),
+    (req, res) => {
+      return handle(req, res)
+    }
+  )

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  await connectToDatabase()

  app.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on localhost:${port}`)
  })
})
```

Now that we have a route for the `Customer`, we need a page for them.

Inside the page's directory, create a new file called `customer-dashboard.jsx` and add the following code;

```javascript
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles(theme => ({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  paper: {
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(8),
      padding: `${theme.spacing(6)}px ${theme.spacing(4)}px`
    }
  }
}))

const CustomerDashboard = () => {
  const classes = useStyles({})
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
            Customer Dashboard
          </Typography>
          <Typography component="p" gutterBottom>
            Welcome, you are logged in as a customer!
          </Typography>
        </Box>
      </Paper>
    </main>
  )
}

export default CustomerDashboard
```

Now that we have a route specifically for customers, and we're logged in as a customer then we should be able to reach [http://localhost:3000/customer-dashboard](http://localhost:3000/customer-dashboard). The admin dashboard should still be inaccessible.

## Add a route for both admin and customers

We now have a route that is accessible for either administrators or customers. We need a route where it does not matter if you are an administrator, or a customer, just that you have one of those two roles.

Open `server/index.js` and make the following changes;

```diff{24}
// Code omitted for brevity

  app.get(
    '/admin-dashboard',
    passport.authenticate('jwt', { failureRedirect: '/login' }),
    utils.checkIsInRole(ROLES.Admin),
    (req, res) => {
      return handle(req, res)
    }
  )

  app.get(
    '/customer-dashboard',
    passport.authenticate('jwt', { failureRedirect: '/login' }),
    utils.checkIsInRole(ROLES.Customer),
    (req, res) => {
      return handle(req, res)
    }
  )

+  app.get(
+    '/both-dashboard',
+    passport.authenticate('jwt', { failureRedirect: '/login' }),
+    utils.checkIsInRole(ROLES.Admin, ROLES.Customer),
+    (req, res) => {
+      return handle(req, res)
+    }
+  )

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  await connectToDatabase()

  app.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on localhost:${port}`)
  })
})
```

Our `checkIsInRole` function is able to accept multiple roles, as highlighted on line 24.

For completion, create a new page called `both-dashboard.jsx` and add the following code;

```javascript
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles(theme => ({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  paper: {
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(8),
      padding: `${theme.spacing(6)}px ${theme.spacing(4)}px`
    }
  }
}))

const BothDashboard = () => {
  const classes = useStyles({})
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
            General Dashboard
          </Typography>
          <Typography component="p" gutterBottom>
            Welcome, you are logged in. Either <strong>Admin</strong>, or{' '}
            <strong>Customer</strong>.
          </Typography>
        </Box>
      </Paper>
    </main>
  )
}

export default BothDashboard
```

When logged in as either an administrator or customer, you should be able to access [http://localhost:3000/customer-dashboard](http://localhost:3000/both-dashboard). Hypothetically, a logged in user without a role (or a new role that is created in the future) would not be able to access this page.

## Redirecting the user based on their role

Now that we know what the user's role is, it should be straightforward to redirect them to the right page when they log in. We have a few places where we need this code, so we will create a utility which will contain the logic that we will reuse as appropriate.

Open `server/auth/utils.js` and make the following changes;

```diff
import passport from 'passport'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from '../database/schema'
+import { ROLES } from '../../utils'

// Code omitted for brevity

+const getRedirectUrl = role => {
+  switch (role) {
+    case ROLES.Admin:
+      return '/admin-dashboard'
+    case ROLES.Customer:
+      return '/customer-dashboard'
+    default:
+      return '/'
+  }
+}

-export { setup, signToken, hashPassword, verifyPassword, checkIsInRole }
+export { setup, signToken, hashPassword, verifyPassword, checkIsInRole, getRedirectUrl }

```

In this case we have a `switch` statement that returns the appropriate redirect URL based on the user's role.

We need to apply this redirect in every place where the user gets logged in, or is registered. As earlier, there are three places where this redirect occurs.

- Passport.js Google OAuth Strategy (`/server/auth/strategies/google`)
- Passport.js Facebook Strategy (`/server/auth/strategies/facebook`)
- JWT Strategy (`/server/router/auth.routes`)

I will update one as an example, please update the other two in the same way.

Open `auth.routes.js` and make the following changes;

```diff
import passport from 'passport'
import passportGoogle from 'passport-google-oauth'
import { to } from 'await-to-js'

import { getUserByProviderId, createUser } from '../../database/user'
-import { signToken } from '../utils'
+import { signToken, getRedirectUrl } from '../utils'
import { ROLES } from '../../../utils'

const GoogleStrategy = passportGoogle.OAuth2Strategy

const strategy = app => {
  // Code omitted for brevity

  app.get(
    `${process.env.BASE_API_URL}/auth/google/callback`,
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      return res
        .status(200)
        .cookie('jwt', signToken(req.user), {
          httpOnly: true
        })
-        .redirect('/')
+        .redirect(getRedirectUrl(req.user.role))
    }
  )

  return app
}

export { strategy }

```

We replaced our existing redirect (`/`), with our `getRedirectUrl` function created earlier. The user should now be redirected to the appropriate page when logging in using Google OAuth.

## Summary

We wired up role-based authorisation for our application that allows registration using a username/password, or Google or Facebook providers. We defined our roles as an object, and imported that object into various places in our application. We then created various pages; one for administrators, one for customers, and one for both. With our roles defined and our pages in place, we then added routes that first authenticated the user, and then verified they had the appropriate role assigned to them. Should either of these conditions fail, the user was redirected to the login page. Upon successful login/registration, the user is redirected to the appropriate dashboard.

This post concludes our _Comprehensive Passport.js Mini Series_. We have covered a huge amount of ground, from wiring up Passport.js, creating login/registration pages using Material UI, to setting up the database, to adding JWT, to adding Google/Facebook login support, to verifying the user's role and restricting access to certain pages.

If you have found this page useful, please leave a comment or share with your friends or people who might find this useful!
