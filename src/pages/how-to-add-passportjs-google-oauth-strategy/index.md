---
layout: post
title: How to add Passport.js Google OAuth Strategy to your website
description: As part of this mini-series on Passport.js, we look at how to add Google OAuth to an existing Node Express website
date: 2019-10-06
categories: ['Passport.js', 'passport-authentication-series']
seriesTitle: Comprehensive Passport.js Mini-Series
group: 'Software Development'
featuredImage: './passportjs-google-oauth-strategy.png'
---

Welcome to our mini-series on _Authentication using Node.js, Express, and Passport.js_. This comprehensive series is designed to teach you everything you need to know, as well as give you all the code required, to add authentication and authorisation to your existing website, or for a new-build from-scratch project.

So far in this series, [we have discussed at length Passport.js and JWT](/passport.js/protect-website-using-passportjs-jwt/). We created our project using Next.js, we wrote a [login page and registration page using Material UI for the layout](/passport.js/node-express-passport-authentication-mini-series/), and we added MongoDB and Mongoose for back-end data storage. Using our website, we can create an account and use it to log in.

**The purpose of this post** is to go in to the specifics of wiring up _Passport.js Google OAuth Authentication Strategy_. The code in this post is meant as an enhancement to code written in previous parts of this mini-series, but should still be generally applicable to existing applications.

**You will learn** the following;

- How to install and set up Passport.js Google OAuth Strategy
- How to create a Google branded login button for your login page

Once this tutorial is finished, users will be able to login and register with your site using their existing Google account. Role-based authorisation will be covered in a subsequent post in this series.

Let's get started. As we have many of the parts in place to make this work properly, you should find this post easier to implement in your project.

## How to get credentials for Passport.js Google OAuth strategy

Before we can write any code, we need to obtain a **Client Id** and **Client Secret** from [Google Developers Console](https://console.developers.google.com/).

Assuming you already have a Google account, and that you are logged in, open the Google Developers Console and click **Select a project**. From here you can create a new project using the **New Project** button.

![Google Developers Console - New Project](./google-developers-console-new-project.png)

Give your project a sensible name, and click **Create**. After a few seconds, your project should be created.

Click on your project, and from the menu on the left-hand side, select **APIs & Services > Credentials**. Click **Create Credentials > OAuth Client Id**. Now click **Configure consent screen**.

![Google Developers Console - OAuth Consent Screen](./google-oauth-consent-screen.png)

Again, give your application a sensible name, and click **Save** at the bottom.

On the next screen you can now start creating your OAuth Client Id.

Select **Web Application**, and give a sensible name. The important part here is that we set an **authorised redirect URI**;

![Google Developers Console - Authorised Redirect UI](./google-authorised-redirect-uri.png)

It is important to set the redirect URL to `http://localhost:3000/api/auth/google/callback`. We will set the same URL in our application.

When done, click **Create**.

A modal should appear containing both your Client Id and Client Secret.

![Google Developers Console - Client Id and Client Secret](./google-oauth-client-id-secret.png)

We need to add these into our application.

Go back to your project, and open your `.env` file.

Make the following changes;

```diff
BASE_API_URL=/api
DB_CONNECTION_STRING=mongodb://root:example@localhost:27017/test?authSource=admin&w=1
JWT_SECRET=this is a random string
+GOOGLE_CLIENT_ID=<YOUR CLIENT ID GOES HERE>
+GOOGLE_CLIENT_SECRET=<YOUR CLIENT SECRET GOES HERE>
```

Be sure to replace the placeholders with your actual keys. Remember that `.env` should not be committed to your code repository, make sure it is added to your `.gitignore` file.

Close the modal.

## How to set up Passport.js Google OAuth strategy

Now that we have the credentials in place, we need to start connecting the Google OAuth strategy into our application.

First, install `passport-google-oauth` as follows;

```shell
npm install --save passport-google-oauth
```

Next, create a new file inside `server/auth/strategies`, called `google.js`, and add the following code;

```javascript
import passport from 'passport'
import passportGoogle from 'passport-google-oauth'
import { to } from 'await-to-js'

import { getUserByProviderId, createUser } from '../../database/user'
import { signToken } from '../utils'

const GoogleStrategy = passportGoogle.OAuth2Strategy

const strategy = app => {
  const strategyOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_API_URL}/auth/google/callback`
  }

  const verifyCallback = async (accessToken, refreshToken, profile, done) => {
    // TODO
  }

  passport.use(new GoogleStrategy(strategyOptions, verifyCallback))

  return app
}

export { strategy }
```

If you are not already using [await-to-js](https://www.npmjs.com/package/await-to-js), it is a lightweight wrapper around `Promise` that makes error handling tidier, removing the need for `try...catch...finally`.

Let's discuss the above code.

1. First, import Passport.js, Google OAuth, and create a constant for the `OAuth2Strategy`, aliased to `GoogleStrategy`
2. Define our `strategyOptions`. Here we tell the strategy what our Client Id, Client Secret, and Callback urls are. We created and retrieved the Client Id and Client Secret in the previous steps.
3. Tell Google OAuth what our callback address is. This is where Google will redirect the user once login is complete. We will use this opportunity to set a cookie in the user's browser so they stay logged in.
4. Create the strategy and then pass it back to Passport.js

We introduced a new environment variable in the previous step. It was `SERVER_API_URL` and its value is currently `undefined`.

The `SERVER_API_URL` will be different depending on the environment that our application is running in (development, test, production etc) so we need it to be configurable.

Open your `.env` file and make the following change;

```diff
BASE_API_URL=/api
DB_CONNECTION_STRING=mongodb://root:example@localhost:27017/test?authSource=admin&w=1
JWT_SECRET=this is a random string
GOOGLE_CLIENT_ID=<YOUR CLIENT ID GOES HERE>
GOOGLE_CLIENT_SECRET=<YOUR CLIENT SECRET GOES HERE>
+SERVER_API_URL=http://localhost:3000/api
```

You would probably set this to your domain name when deploying to production.

Before fleshing out the `verifyCallback` function, we will add our Google specific authentication and callback routes.

In `google.js`, add the following to function calls as shown;

```diff
// Code omitted for brevity

const strategy = app => {

  // Code omitted for brevity

  passport.use(new GoogleStrategy(strategyOptions, verifyCallback))

+  app.get(
+    `${process.env.BASE_API_URL}/auth/google`,
+    passport.authenticate('google', {
+      scope: [
+        'https://www.googleapis.com/auth/userinfo.profile',
+        'https://www.googleapis.com/auth/userinfo.email'
+      ]
+    })
+  )
+
+  app.get(
+    `${process.env.BASE_API_URL}/auth/google/callback`,
+    passport.authenticate('google', { failureRedirect: '/login' }),
+    (req, res) => {
+      return res
+        .status(200)
+        .cookie('jwt', signToken(req.user), {
+          httpOnly: true
+        })
+        .redirect("/")
+    }
+  )

  return app
}

export { strategy }
```

Here we are exposing two routes to the outside world;

1. `/api/auth/google`. We will use this route on the client. When the user clicks the login button they will hit this URL and then be redirected off to Google's servers. Before that happens, we tell Google what facets of the user's information we need. In this case, we need their `profile` (name mainly), and email address.
2. `/api/auth/google/callback`. When authentication is complete, the user will be redirected back to this URL. If authentication was successful, a cookie is added into the user's browser, containing a JSON web token used to verify their access on subsequent requests. We created the `signToken` function in the previous part of this tutorial mini-series. Finally, the user is redirected back to the home-page.

With all the easy bits out of the way, let's go back and flesh out that `verifyCallback` function.

Make the following changes;

```diff
// Code omitted for brevity

const strategy = app => {
  const strategyOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_API_URL}/auth/google/callback`
  }

-  const verifyCallback = async (accessToken, refreshToken, profile, done) => {
-    // TODO
-  }

+  const verifyCallback = async (
+    accessToken,
+    refreshToken,
+    profile,
+    done
+  ) => {
+    let [err, user] = await to(getUserByProviderId(profile.id))
+    if (err || user) {
+      return done(err, user)
+    }
+
+    const verifiedEmail = profile.emails.find(email => email.verified) || profile.emails[0]
+
+    const [createdError, createdUser] = await to(
+      createUser({
+        provider: profile.provider,
+        providerId: profile.id,
+        firstName: profile.name.givenName,
+        lastName: profile.name.familyName,
+        displayName: profile.displayName,
+        email: verifiedEmail.value,
+        password: null
+      })
+    )
+
+    return done(createdError, createdUser)
+  }

  passport.use(new GoogleStrategy(strategyOptions, verifyCallback))

  // Code omitted for brevity

  return app
}

export { strategy }
```

Let's walk through the code;

1. We need to determine if the user has previously created an account with us (a returning user), or if they are a new user. Google has an external Id that it assigns to every user, referred to in this project as the `providerId`. We can use this `providerId` to look up the user in our own database. We will use a new function called `getUserByProviderId` to do this, which we will write shortly.
2. If the user already exists in our database (or there was an error), then return our `user` object by calling `done(err, user)`.
3. If this is a new user, first grab either the users verified email address, or the first email address we are given, and use this, along with their profile information, to create a new user in our database. When done, again call `done` with the newly created user.

The function `getUserByProviderId` is currently `undefined`, so let's go create it.

In the `server/database/user` directory, we have a file called `get.js`. Make the following changes;

```diff
import { UserModel } from '../schema'

async function getUserById(id) {
  return await UserModel.findById(id).exec()
}

async function getUserByEmail(email) {
  return await UserModel.findOne({ email }).exec()
}

+async function getUserByProviderId(providerId) {
+  return await UserModel.findOne({ providerId }).exec()
+}

-export { getUserById, getUserByEmail }
+export { getUserById, getUserByEmail, getUserByProviderId }
```

The code is very similar to what we have in place already, we're just querying using a different field.

To expose the function, open the `index.js` file in `database/user` and make the following changes;

```diff
-import { getUserById, getUserByEmail } from './get'
+import { getUserById, getUserByEmail, getUserByProviderId } from './get'
import { createUser } from './create'

-export { getUserById, getUserByEmail, createUser }
+export { getUserById, getUserByEmail, createUser, getUserByProviderId }
```

### Connecting the Google OAuth strategy to our back-end

With the strategy written, we need to introduce it to our back-end, so we can make use of it from the front-end.

Thankfully, our application is quite open to extension with minimal code changes needed.

Open `server/auth/strategies/index.js` and make the following changes;

```diff
import { strategy as JWTStrategy } from './jwt'
+import { strategy as GoogleStrategy } from './google'

-export { JWTStrategy }
+export { JWTStrategy, GoogleStrategy }
```

And finally, open `server/auth/index.js` and make the following changes;

```diff
import * as utils from './utils'
import * as strategies from './strategies'

const pipe = (...functions) => args => functions.reduce((arg, fn) => fn(arg), args)

const initialiseAuthentication = app => {
  utils.setup()

-  pipe(strategies.JWTStrategy)(app)
+  pipe(strategies.GoogleStrategy, strategies.JWTStrategy)(app)
}

export { utils, initialiseAuthentication, strategies }
```

That's it, the Google OAuth strategy has been added to our application. Now we just need to wire up the front-end so that we can call it.

## How to create a Google login button for the front-end

Now that we have the back-end pieces in place, we need some way of triggering the authentication endpoint we added from the front-end. The best way to do this is using a Google branded login button.

We have used Material UI throughout this project, and we will continue to do so here.

Please note, the absolute simplest way of doing this is to add the following code to your login page;

```html
<a href="/api/auth/google">Click me to log in using Google</a>
```

However, as this is a more complete tutorial, we need a more complete solution.

In the root of your project, add a new directory called `components`, and add a new file called `GoogleLoginButton.jsx`. Add the following code;

```javascript
import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme =>
  createStyles({
    button: {
      margin: theme.spacing(0, 0, 1),
      display: 'flex',
      backgroundColor: '#DD4B39',
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1],
      height: '36px',
      cursor: 'pointer',
      textDecoration: 'none',
      '&:hover': {
        backgroundColor: '#E74B37'
      },
      '&:active': {
        boxShadow: 'inset 0 0 0 32px rgba(0,0,0,0.1)'
      }
    },
    wrapper: {
      marginTop: '1px',
      marginLeft: '1px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '34px',
      height: '34px',
      borderRadius: '2px',
      backgroundColor: '#fff'
    },
    icon: {
      width: '18px',
      height: '18px'
    },
    text: {
      margin: '0 34px 0 0',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      flexGrow: 1,
      textAlign: 'center',
      alignSelf: 'center'
    }
  })
)

const GoogleLoginButton = () => {
  const classes = useStyles({})

  return (
    <a href={`${process.env.BASE_API_URL}/auth/google`} className={classes.button}>
      <div className={classes.wrapper}>
        <svg
          className={classes.icon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 533.5 544.3"
        >
          <path
            fill="#4285f4"
            d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
          />
          <path
            fill="#34a853"
            d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
          />
          <path
            fill="#fbbc04"
            d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
          />
          <path
            fill="#ea4335"
            d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
          />
        </svg>
      </div>
      <p className={classes.text}>Login with Google</p>
    </a>
  )
}

export { GoogleLoginButton }
```

In a nutshell, this creates a `<a href="..." />` tag as just mentioned, but with appropriately branded styling.

Run your website using `npm run dev` and navigate to `http://localhost:3000/login`.

Note that we do not yet have the login button.

Open `login.jsx` and make the following changes;

```diff
// Code omitted for brevity

+import { GoogleLoginButton } from '../components/GoogleLoginButton'

// Code omitted for brevity

const LoginForm = () => {
  const classes = useStyles({})

// Code omitted for brevity

          <Box mb={6}>
            <Button
              disabled={submitting}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {submitting && (
                <CircularProgress size={24} className={classes.buttonProgress} />
              )}
              {submitting ? 'Signing in...' : 'Sign In'}
            </Button>
+            <Typography variant="overline" display="block" gutterBottom>
+              Social Login Providers
+            </Typography>
+            <GoogleLoginButton />
          </Box>
        </form>
      </Paper>
    </main>
  )
}

export default LoginForm
```

The page should automatically refresh, and the login button should appear.

![Google OAuth Login Button](./google-oauth-login-button.png)

Click the **Login with Google** button. You should be redirected to Google and prompted to select an account to use. Click the appropriate account and you should be redirected back to the home page.

You can verify that you are logged in by looking at the `jwt` cookie in using Chrome dev tools;

![Google OAuth JWT Cookie](./passport-jwt-cookie-chrome-devtools.png)

Drop the JWT into the debugger over on [https://jwt.io](https://jwt.io) so you can see its contents.

![Debug JWT using JWT.io](./google-oauth-jwt-cookie.png)

Now you have been successfully registered and logged in using Passport.js Google OAuth strategy.

## Summary

We went into a lot of details with this post. We discussed how to install Passport.js Google OAuth strategy, how to obtain your Client Id and Client Secret, how to create a new user, or login an existing user. Finally, we discussed how to create a Google branded login button and use it to trigger the authentication flow from the front end.

In the next post in this mini-series we will focus on adding the Facebook authentication strategy. Which, in many ways, is very similar to what we have done here for Google.
