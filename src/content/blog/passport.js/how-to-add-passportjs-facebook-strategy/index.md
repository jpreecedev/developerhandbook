---
title: How to add Passport.js Facebook Strategy to your website
description: As part of this mini-series on Passport.js, we look at how to add Facebook strategy to an existing Node Express website
pubDate: 2019-10-07
categories: ["Passport.js", "passport-authentication-series"]
seriesTitle: Comprehensive Passport.js Mini-Series
group: "Software Development"
heroImage: /assets/passportjs-facebook-strategy.png
---

Welcome to our mini-series on _Authentication using Node.js, Express, and Passport.js_. This comprehensive series is designed to teach you everything you need to know, as well as give you all the code required, to add authentication and authorisation to your existing website, or for a new-build from-scratch project.

So far in this series, [we have discussed at length Passport.js and JWT](/passport.js/protect-website-using-passportjs-jwt/). We created our project using Next.js, we wrote a [login page and registration page using Material UI for the layout](/passport.js/node-express-passport-authentication-mini-series/), and we added MongoDB and Mongoose for back-end data storage. [Using our website, we can create an account and use it to log in](/passport.js/protect-website-using-passportjs-jwt/). In the previous post, we discussed how to add [Passport.js Google OAuth strategy to your website](/passport.js/how-to-add-passportjs-google-oauth-strategy/).

**The purpose of this post** is to go in to the specifics of wiring up _Passport.js Facebook Authentication Strategy_. The code in this post is meant as an enhancement to code written in previous parts of this mini-series, but should still be generally applicable to existing applications.

**You will learn** the following;

- How to install and set up Passport.js Facebook Strategy
- How to create a Facebook branded login button for your login page

Once this tutorial is finished, users will be able to login and register with your site using their existing Facebook account. Role-based authorisation will be covered in a subsequent post in this series.

## Source code is available

All the code in this series is open source, and available to view and use on <a href="https://github.com/jpreecedev/passport-next-auth-tutorial" target="_blank">GitHub</a>.

Let's get started. Hopefully you will find that the Facebook strategy is easier to implement than JWT, and the steps are similar to the Google OAuth strategy.

## How to get credentials for Passport.js Facebook strategy

Before we can write any code, we need to obtain an **App Id** and **App Secret** from [Facebook for Developers](https://developers.facebook.com/).

Assuming you already have a Facebook account, and that you are logged in, click **My Apps** in the upper-right hand corner of the page and click **Create App**.

![Facebook Developers - Create a new App ID](/assets/facebook-developers-new-app-id.png)

Give your app a sensible name, and click **Create App ID**. You may have to complete a security check. Once done, your app should be created and you should be redirected to a dashboard. One of the items on the dashboard should be **Facebook Login**. Click that, and then on the subsequent screen, click **Web** (WWW).

![Facebook Login - Getting set up](/assets/facebook-login-getting-set-up.png)

Enter a URL for your website, click **Save**, and then **Continue**.

Completely ignore all the rest of the screens (they're not applicable to our use case).

On the right-hand side should be a menu bar. A menu option should be **Settings**. Click **Settings**, then **Basic**.

![Facebook Login App Id and App Secret](/assets/facebook-app-id-secret-settings.png)

Your **App Id** and **App Secret** should be displayed on screen (you need to click **Show** to see the secret).

We need to add these into our application. Go back to your project, and open your `.env` file.

Make the following changes;

```diff
BASE_API_URL=/api
DB_CONNECTION_STRING=mongodb://root:example@localhost:27017/test?authSource=admin&w=1
JWT_SECRET=this is a random string
+FACEBOOK_APP_ID=<YOUR APP ID GOES HERE>
+FACEBOOK_APP_SECRET=<YOUR APP SECRET GOES HERE>
```

Be sure to replace the placeholders with your actual keys. Remember that `.env` should not be committed to your code repository, make sure it is added to your `.gitignore` file.

You can close your browser tab now, we have the information we need.

## How to set up Passport.js Facebook strategy

Now that we have the credentials in place, we need to start connecting the Facebook strategy into our application.

First, install `passport-facebook` as follows;

```shell
npm install --save passport-facebook
```

Next, create a new file inside `server/auth/strategies`, called `facebook.js`, and add the following code;

```javascript
import passport from "passport"
import passportFacebook from "passport-facebook"
import { to } from "await-to-js"

import { getUserByProviderId, createUser } from "../../database/user"
import { signToken } from "../utils"

const FacebookStrategy = passportFacebook.Strategy

const strategy = (app) => {
  const strategyOptions = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.SERVER_API_URL}/auth/facebook/callback`,
    profileFields: ["id", "displayName", "name", "emails"],
  }

  const verifyCallback = async (accessToken, refreshToken, profile, done) => {
    // TODO
  }

  passport.use(new FacebookStrategy(strategyOptions, verifyCallback))

  return app
}

export { strategy }
```

If you are not already familiar with [await-to-js](https://www.npmjs.com/package/await-to-js), it is a lightweight wrapper around `Promise` that makes error handling tidier, removing the need for `try...catch...finally`.

Let's discuss the above code.

1. First, import Passport.js, Facebook, and create a constant for the `Strategy`, aliased to `FacebookStrategy`
2. Define our `strategyOptions`. Here we tell the strategy what our App Id, App Secret, and Callback urls are. We created and retrieved the App Id and App Secret in the previous steps.
3. Tell Facebook what our callback address is. This is where Facebook will redirect the user once login is complete. We will use this opportunity to set a cookie in the user's browser so they stay logged in.
4. Specify ahead of time what profile fields we want to be returned to use once the user has logged in
5. Create the strategy and then pass it back to Passport.js

We introduced a new environment variable in the previous step. It was `SERVER_API_URL` and its value is currently `undefined`.

The `SERVER_API_URL` will be different depending on the environment that our application is running in (development, test, production etc) so we need it to be configurable.

Open your `.env` file and make the following change;

```diff
BASE_API_URL=/api
DB_CONNECTION_STRING=mongodb://root:example@localhost:27017/test?authSource=admin&w=1
JWT_SECRET=this is a random string
FACEBOOK_APP_ID=<YOUR APP ID GOES HERE>
FACEBOOK_APP_SECRET=<YOUR APP SECRET GOES HERE>
+SERVER_API_URL=http://localhost:3000/api
```

You would probably set this to your domain name when deploying to production.

Before fleshing out the `verifyCallback` function, we will add our Facebook specific authentication and callback routes.

In `facebook.js`, add the following two routes as shown;

```diff
// Code omitted for brevity

const strategy = app => {

  // Code omitted for brevity

  passport.use(new FacebookStrategy(strategyOptions, verifyCallback))

+  app.get(`${process.env.BASE_API_URL}/auth/facebook`, passport.authenticate('facebook'))
+
+  app.get(
+    `${process.env.BASE_API_URL}/auth/facebook/callback`,
+    passport.authenticate('facebook', { failureRedirect: '/login' }),
+    (req, res) => {
+      return res
+        .status(200)
+        .cookie('jwt', signToken(req.user), {
+          httpOnly: true
+        })
+        .redirect('/')
+    }
+  )

  return app
}

export { strategy }
```

Here we are exposing two routes to the outside world;

1. `/api/auth/facebook`. We will use this route on the client. When the user clicks the login button they will hit this URL and then be redirected off to Facebook's servers.
2. `/api/auth/facebook/callback`. When authentication is complete, the user will be redirected back to this URL. If authentication was successful, a cookie is added into the user's browser, containing a JSON web token used to verify their access on subsequent requests. We created the `signToken` function in the previous part of this tutorial mini-series. Finally, the user is redirected back to the home-page.

With all the easy bits out of the way, let's go back and flesh out that `verifyCallback` function.

Make the following changes;

```diff
// Code omitted for brevity

const strategy = app => {
  const strategyOptions = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.SERVER_API_URL}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'name', 'emails']
  }

-  const verifyCallback = async (accessToken, refreshToken, profile, done) => {
-    // TODO
-  }

+  const verifyCallback = async (accessToken, refreshToken, profile, done) => {
+    let [err, user] = await to(getUserByProviderId(profile.id))
+    if (err || user) {
+      return done(err, user)
+    }
+
+    const [createdError, createdUser] = await to(
+      createUser({
+        providerId: profile.id,
+        provider: profile.provider,
+        firstName: profile.name.givenName,
+        lastName: profile.name.familyName,
+        displayName: profile.displayName,
+        email: profile.emails[0].value,
+        password: null
+      })
+    )
+
+    return done(createdError, createdUser)
+  }

  passport.use(new FacebookStrategy(strategyOptions, verifyCallback))

  // Code omitted for brevity

  return app
}

export { strategy }
```

Let's walk through the code;

1. We need to determine if the user has previously created an account with us (a returning user), or if they are a new user. Facebook has an external Id that it assigns to every user, referred to in this project as the `providerId`. We can use this `providerId` to look up the user in our own database. We will use a new function called `getUserByProviderId` to do this, which we will write shortly.
2. If the user already exists in our database (or there was an error), then return our `user` object by calling `done(err, user)`.
3. Then use the profile information returned from Facebook to create a new user in our database. When done, again call `done` with the newly created user.

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

### Connecting the Facebook strategy to our back-end

With the strategy written, we need to introduce it to our back-end, so we can make use of it from the front-end.

Thankfully, our application is quite open to extension with minimal code changes needed.

Open `server/auth/strategies/index.js` and make the following changes;

```diff
import { strategy as JWTStrategy } from './jwt'
+import { strategy as FacebookStrategy } from './facebook'

-export { JWTStrategy }
+export { JWTStrategy, FacebookStrategy }
```

And finally, open `server/auth/index.js` and make the following changes;

```diff
import * as utils from './utils'
import * as strategies from './strategies'

const pipe = (...functions) => args => functions.reduce((arg, fn) => fn(arg), args)

const initialiseAuthentication = app => {
  utils.setup()

-  pipe(strategies.JWTStrategy)(app)
+  pipe(strategies.FacebookStrategy, strategies.JWTStrategy)(app)
}

export { utils, initialiseAuthentication, strategies }
```

That's it. The Facebook strategy has been added to our application. Now we just need to wire up the front-end so that we can call it.

## How to create a Facebook login button for the front-end

Now that we have the back-end pieces in place, we need some way of triggering the authentication endpoint we added from the front-end. The best way to do this is using a Facebook branded login button.

We have used Material UI throughout this project, and we will continue to do so here.

Please note, the absolute simplest way of doing this is to add the following code to your login page;

```html
<a href="/api/auth/facebook">Click me to log in using Facebook</a>
```

However, as this is a more complete tutorial, we need a more complete solution.

In the root of your project, add a new directory called `components`, and add a new file called `FacebookLoginButton.jsx`. Add the following code;

```javascript
import React, { FunctionComponent } from "react"
import { makeStyles, createStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) =>
  createStyles({
    button: {
      display: "flex",
      backgroundColor: "#4C69BA",
      backgroundImage: "linear-gradient(#4C69BA, #3B55A0)",
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1],
      height: "36px",
      cursor: "pointer",
      textDecoration: "none",
      "&:hover": {
        backgroundColor: "#5B7BD5",
        backgroundImage: "linear-gradient(#5b7bd50a, #4864B1)",
      },
      "&:active": {
        boxShadow: "inset 0 0 0 32px rgba(0,0,0,0.1)",
      },
    },
    wrapper: {
      marginTop: "1px",
      marginLeft: "1px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "34px",
      height: "34px",
      borderRadius: "2px",
      backgroundColor: "#fff",
    },
    icon: {
      width: "18px",
      height: "18px",
    },
    text: {
      margin: "0 34px 0 0",
      color: "#fff",
      fontSize: "14px",
      fontWeight: "bold",
      textTransform: "uppercase",
      flexGrow: 1,
      textAlign: "center",
      alignSelf: "center",
    },
  }),
)

const FacebookLoginButton = () => {
  const classes = useStyles({})

  return (
    <a
      href={`${process.env.BASE_API_URL}/auth/facebook`}
      className={classes.button}
    >
      <div className={classes.wrapper}>
        <svg
          fill="#3b5998"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
        </svg>
      </div>
      <p className={classes.text}>Login with Facebook</p>
    </a>
  )
}

export { FacebookLoginButton }
```

In a nutshell, this creates a `<a href="..." />` tag as just mentioned, but with appropriately branded styling.

Run your website using `npm run dev` and navigate to `http://localhost:3000/login`.

Note that we do not yet have the login button.

Open `login.jsx` and make the following changes;

```diff
// Code omitted for brevity

+import { FacebookLoginButton } from '../components/FacebookLoginButton'

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
+            <FacebookLoginButton />
          </Box>
        </form>
      </Paper>
    </main>
  )
}

export default LoginForm
```

The page should automatically refresh, and the login button should appear.

![Facebook Auth Login Button](/assets/facebook-auth-login-button.png)

Click the **Login with Facebook** button. You should be redirected to Facebook and prompted to select an account to use. Click the appropriate account and you should be redirected back to the home page.

You can verify that you are logged in by looking at the `jwt` cookie in using Chrome dev tools;

![Facebook JWT Cookie](/assets/passport-jwt-cookie-chrome-devtools.png)

Drop the JWT into the debugger over on [https://jwt.io](https://jwt.io) so you can see its contents.

![Debug JWT using JWT.io](/assets/passport-facebook-jwt-decoded.png)

Now you have been successfully registered and logged in using Passport.js Facebook strategy.

## Summary

It was significantly easier to wire up Facebook Auth, compared to JWT, although primarily this was because we had several major components (like the database) in place already. We discussed how to install Passport.js Facebook strategy, how to obtain your App Id and App Secret, how to create a new user, or login an existing user. Finally, we discussed how to create a Facebook branded login button and use it to trigger the authentication flow from the front end.

In the next post in this mini-series we will tackle role-based authorisation, which will allow us to restrict access to certain parts of the website based on the user's role.
