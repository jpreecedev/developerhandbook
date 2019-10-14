---
layout: post
title: How to use the AWS Rekognition JavaScript API
description: Learn how to use AWS Rekognition JavaScript API, which can be used to find pictures of yourself
date: 2019-10-12
categories: ['React']
group: 'Software Development'
featuredImage: './aws-face-rekognition-javascript.png'
---

AWS Rekognition is a powerful, easy to use image and video recognition service that can be used for face detection. AWS can use an image (for example, a picture of you) to search through an existing collection of images, and return a list of said images in which you appear. AWS Rekognition can also we used to find celebrities, text, scenes, activities, and even identify inappropriate content.

**The purpose of this post** is to discuss how to use AWS Rekognition (referred to herein as _Rekognition_) to build a webpage that uses your webcam to upload an image to S3, where it is then analysed by Rekognition. Once analysed, matching images are then returned back to the client and displayed.

**You will learn** the following;

- How to set-up Next.js, Mongo, Mongoose, Express, Material UI and more...
- How to use React-Webcam to capture an image of yourself
- How to use FilePond and Multer to upload images to Amazon S3
- How to use Rekognition to find images of yourself

For full context, here is a screenshot of the finished product of what we are trying to create.

![Material UI, FilePond, React Webcam](material-ui-react-webcam-filepond.png)

The page consists of 3 sections. First, we use FilePond to upload images to an S3 bucket, then add them to our Rekognition collection (where they are analysed). Then, using the users webcam, a picture is captured (React Webcam) and again uploaded to S3 and analysed for matches. Any matches found are returned back to the user and displayed.

This is a long post, so let's get started.

## AWS Rekognition pricing

Rekognition is fairly cheap. You only pay for what you use.

Prices start around USD 1.00 per 1000 images (for the first 1 million) per month. [See the pricing table for more details](https://aws.amazon.com/rekognition/pricing/?nc=sn&loc=4#Amazon_Rekognition_Image_API_pricing).

## Getting started with Next.js and Express

For ultimate speed and simplicity, we will use Next.js with our own custom back-end using Express and more. We will only quickly discuss the basics of Next.js in this post.

<div class="alert alert-primary">
<p class="mb-0">If you need a crash course on getting started with Next.js, you should consider reading my aptly named post <a href="/react/getting-started-nextjs/">Getting started with Next.js</a>.</p>
</div>

Create a new Next app, as follows;

```shell
npx create-next-app aws-rekognition-getting-started
```

Give your app a name. I have chosen `aws-rekognition-getting-started`.

We will need a custom back-end for our application, so we can add our own router, our own database connection (MongoDB), etc.

In the root of your project, create a new directory called `server` and add a new file called `index.js`. Add the following code;

```javascript
import express from 'express'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const port = 3000

nextApp.prepare().then(async () => {
  const app = express()

  app.get('/test', (req, res) => {
    return res.status(200).json({ hello: 'World' })
  })

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  app.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on localhost:${port}`)
  })
})
```

This code does not do much, _yet_. We need to do this so we can introduce our own routes and middleware.

Next does not pick this code up by default, so we need to do a bit of wiring up.

First, run the following command;

```shell
npm install --save express
npm install --save-dev nodemon @babel/preset-env @babel/node
```

We will use Nodemon to automatically restart our process whenever we make any changes. We will also use `@babel/node` so that we can use language features that have not necessarily been implemented in Node yet. This is fine for development, however, `@babel/node` can be slow for production, so you may consider adding a compilation step later.

In the root of your project, create a new file called `.babelrc` and add the following code;

```json
{
  "presets": ["next/babel", "@babel/preset-env"]
}
```

Now create a new file in the root of your project, called `nodemon.json`.

Add the following code;

```json
{
  "watch": ["server"],
  "exec": "NODE_ENV=development babel-node server/index.js",
  "ext": "js jsx"
}
```

Then go to your `package.json` file and make the following changes;

```diff
{
  "name": "aws-rekognition-getting-started",
  "version": "0.1.0",
  "private": true,
  "scripts": {
-    "dev": "next dev",
+    "dev": "nodemon",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "express": "^4.17.1",
    "next": "9.1.1",
    "react": "16.10.2",
    "react-dom": "16.10.2"
  },
  "devDependencies": {
    "@babel/node": "^7.6.3",
    "@babel/preset-env": "^7.6.3",
    "nodemon": "^1.19.3"
  }
}
```

From your terminal, run `npm run dev`, and navigate your browser to [http://localhost:3000](http://localhost:3000). Your page should load as expected. You should also be able to hit [http://localhost:3000](http://localhost:3000) and get a JSON formatted response.

## Getting started with MongoDB and Mongoose

With some basic set-up in place, we can start thinking about our database.

### What exactly do we need a database for anyway?

I'm so glad you asked! Consider the following flow;

- User lands on our website.
- The user should be able to upload images to our Rekognition collection using an upload tool. These are the images we will search through later.
- Images uploaded to Rekognition do not stay there, they are analysed and the result of the analysis is kept in a very long and detailed JSON file inside Rekognition itself (basically, Rekognition does not store your images, it only analyses them). We will use S3 to store images.
- User then uses their webcam to scan an image of their face, and uploads that image to Rekognition for analysis.
- Rekognition responds back with all the JSON data for the image(s) that it matched. Here's the kicker, we need to store some relationship between the JSON data and the actual image itself, so we can then serve that image back to the user. Conveniently, AWS supports an `ExternalImageId`, which we can use to find the actual image, which we can then serve up.

We need _somewhere_ to store information about each image (referred to throughout as `Picture`), so we can refer back to it later. This is where MongoDB comes in.

We should start by defining our database schema, our models, and setting up the connection to the database.

Start by installing **Mongoose** (a light wrapper around MongoDB that simplifies model creation and makes database lookups easier), and **dotenv**, which we will use to store our secrets and other config;

```shell
npm install --save mongoose dotenv express
```

Make the following changes to `server/index.js`;

```diff
+require("dotenv").config();

import express from "express";
import next from "next";
+import { connectToDatabase } from "./database";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const port = 3000;

nextApp.prepare().then(async () => {
  const app = express();

-  app.get("/test", (req, res) => {
-    return res.status(200).json({ hello: "World" });
-  });

  app.get("*", (req, res) => {
    return handle(req, res);
  });

+  await connectToDatabase();

  app.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on localhost:${port}`);
  });
});
```

Inside your `server` directory, create a new file called `database.js` and add the following;

```javascript
import { connect } from 'mongoose'

const connectToDatabase = async () =>
  await connect(
    process.env.DB_CONNECTION_STRING || '',
    {
      useFindAndModify: false,
      autoIndex: false, // Don't build indexes
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 500, // Reconnect every 500ms
      poolSize: 10, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0,
      useNewUrlParser: true
    }
  )

export { connectToDatabase }
```

Notice that we are using an environment variable, `DB_CONNECTION_STRING`, which we have not defined yet.

In the root of your project, add a new file called `.env` and add the following code;

```text
DB_CONNECTION_STRING=<INSERT YOUR MONGO DB CONNECTION STRING HERE>
```

It does not matter if you use a local instance of MongoDB, or a hosted instance, like MongoDB Atlas.

<div class="alert alert-primary">
<p class="mb-0">We do not cover setting up MongoDB in this post.  If you need help, check out our guide on<a href="/mongodb/connect-mongo-atlas-mongoose/">How to connect to MongoDB Atlas using Mongoose and Node</a> for more details.</p>
</div>

With your connection string in place, we can now connect to the database.

We need to spec out our database schema.

### What data do we need to store about each image?

All we really need to know about each uploaded image is what its URL is, so that we can download it later. When each image is uploaded, it will be added to an AWS S3 bucket, using the AWS SDK. As part of the call to S3, we get a bunch of other metadata back about each image, which we will also store (for future reference).

We will then assign the `_id` generated for us by Mongo to the `ExternalImageId` field we mentioned earlier (we will see this properly later when we come to wiring up the AWS SDK). If this all sounds a bit confusing, don't worry... I promise this will all make sense.

Make the following changes;

```diff
-import { connect } from "mongoose";
+import { model, Schema, connect } from 'mongoose'

const connectToDatabase = async () =>
  await connect(
    process.env.DB_CONNECTION_STRING || "",
    {
      useFindAndModify: false,
      autoIndex: false, // Don't build indexes
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 500, // Reconnect every 500ms
      poolSize: 10, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0,
      useNewUrlParser: true
    }
  );

+const PictureSchema = new Schema({
+  filename: String,
+  mimeType: String,
+  bucket: String,
+  contentType: String,
+  location: String,
+  etag: String
+})

+const PictureModel = model("Picture", PictureSchema);

-export { connectToDatabase };
+export { connectToDatabase, PictureModel };
```

With our schema and model defined, we can start thinking about adding Express routes/endpoints for the client to call.

## Adding face recognition endpoints to our Express app

We will need two endpoints, `/api/upload` and `/api/face`.

- `/api/upload` will be the endpoint that gets called when the user wants to add images to the Rekognition collection.
- `/api/face` will be the endpoint that gets called when the user wants to upload their own face captured via the webcam.

Let's start by wiring up our router and the `upload` endpoint first.

We will put all of our routes into their own file, called `router.js` to keep our concerns separated. In the `server` directory, create a new file called `router.js`, and add the following code;

```javascript
import express from 'express'

const router = express.Router()

router.post('/upload')

function Router(app) {
  app.use(`/api`, router)
}

export default Router
```

And open `server/index.js` and add the code to initialise the router;

```diff
require("dotenv").config();

import express from "express";
import next from "next";
import { connectToDatabase } from "./database";
+import router from './router'

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const port = 3000;

nextApp.prepare().then(async () => {
  const app = express();

+  router(app)

  app.get("*", (req, res) => {
    return handle(req, res);
  });

  await connectToDatabase();

  app.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on localhost:${port}`);
  });
});
```

Let's take a moment to think about what we want this `upload` route to do.

As per our flow discussed at the beginning of this post, the `upload` route will be used from the front-end to upload images to Rekognition, and they will be stored in an AWS S3 bucket.

Uploading images in Node can be quite tricky, so we will use [Multer S3](https://www.npmjs.com/package/multer-s3) to simplify the process. Multer reduces (although, does not eliminate) the pain associated with accessing files from the request. Multer S3 is a layer on top of Multer, which enables us to pass in details of our S3 bucket.

First things first, install Multer and Multer S3. We also need the AWS SDK, as we need to define our AWS credentials and pass them to Multer so it has access to our bucket. We will use **uuid** to ensure the uploaded image has a unique filename.

```shell
npm install multer multer-s3-transform aws-sdk uuid --save
```

With Multer installed, import it into `router.js` as follows;

```diff
+require("dotenv").config();

import express from "express";
+import multer from "multer";
+import multerS3 from "multer-s3-transform";
+import uuid from "uuid/v4";
+import aws from 'aws-sdk'

const router = express.Router();

+const s3 = new aws.S3({
+  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
+  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
+  region: process.env.AWS_REGION
+});
+
+const setMetadata = file => ({ filename: file.originalname });
+const setKey = file =>
+  `${uuid()}${file.originalname.substring(file.originalname.lastIndexOf("."))}`;
+
+const upload = () =>
+  multer({
+    storage: multerS3({
+      s3,
+      bucket: process.env.AWS_BUCKET,
+      acl: "public-read",
+      metadata: (_req, file, cb) => {
+        cb(null, setMetadata(file));
+      },
+      key: (_req, file, cb) => {
+        cb(null, setKey(file));
+      }
+    })
+  });

-router.post('/upload')
+router.post("/upload", upload().single("filepond"));

function Router(app) {
  app.use(`/api`, router);
}

export default Router
```

That's quite a lot of change. Let's discuss;

- Start by importing the libraries we are depending on; Multer, Multer S3, UUID and AWS.
- Next, create a new instance of `S3`, from the AWS SDK. Use environment variables to keep sensitive secrets out of the code base (make sure you add them to your `.env` file).
- Next we have two functions; `setMetadata` and `setKey`. `setMetadata` will be used to set the file name in S3. If we don't set a unique filename, we run the risk of files being overwritten. `setKey` returns an object that contains the original filename.
- Then we created an instance of `multer` and tell it we want to use `multerS3` for storage. We pass `multerS3` the credentials for our S3 bucket, and we set the metadata and keys using the functions we just discussed.
- Finally, we updated the router to call through to `multer`, which will extract the image from the request for us. We tell it that our image is in a field called `filepond` on the request. This is named so because we will use and open source library called [Filepond](https://github.com/pqina/react-filepond) on the front-end later.

Multer S3 will take care of uploading the image for us. When that is done we need to ensure that we save a record of the upload to the database. The file will be available on the request, along with all the metadata returned from S3.

To keep things simple, we will create a function inside `database.js` which takes care of saving to the database for us.

Open `database.js` and make the following edits;

```diff
// Code omitted for brevity

+const savePicture = async (req, res) => {
+  try {
+    const originalFile = req.file
+
+    if (!originalFile) {
+      throw new Error('Unable to find original file!')
+    }
+
+    const { originalname, mimetype } = originalFile
+
+    const picture = {
+      filename: originalname,
+      mimeType: mimetype,
+      bucket: originalFile.bucket,
+      contentType: originalFile.contentType,
+      location: originalFile.location,
+      etag: originalFile.etag
+    }
+
+    const result = await new PictureModel(picture).save()
+
+    // TODO... Add to AWS Rekognition
+
+    return res.status(200).json({ success: true, data: 'Upload complete' })
+  } catch (e) {
+    return res.status(500).json({
+      success: false,
+      data: e
+    })
+  }
+}

-export { connectToDatabase, PictureModel }
+export { connectToDatabase, savePicture, PictureModel }
```

Let's take a moment to digest this code;

- Grab the uploaded file from the request, and extract metadata from it.
- Reshape the metadata so that it matches the `PictureModel` schema that we defined earlier.
- Save the new picture to the database.
- Add the image to our Rekognition collection (TODO).

We just need to wire up the `savePicture` method to run _after_ the upload has completed.

Open `server/router.js` again and make the following alterations;

```diff
import express from "express";
+import { savePicture } from "./database"

// Code omitted for brevity

-router.post("/upload", upload().single("filepond"));
+router.post("/upload", upload().single("filepond"), savePicture);

function Router(app) {
  app.use(`/api`, router);
}

export default Router;
```

Now, when the upload is completed, our `savePicture` function will be called and a record of the upload will be added to the database.

## How to use Material UI with Next.js

Configuring and setting up Material UI with Next.js has been covered extensively on this website. In a nutshell, you can set-up Material UI as simply as installing its dependencies and importing the components in to your own components.

```shell
npm install --save @material-ui/core
```

For a more detailed explanation of how to use Material UI with Next.js,

<div class="alert alert-primary">
<p class="mb-0">For a much more detailed explanation, check out our post <a href="/react/how-to-set-up-nextjs-material-ui/">How to set-up Next.js and Material UI</a>.</p>
</div>

From this point forward, we will assume that you have Material UI set up, configured and working correctly, so we can get on with wiring up our front-end.

## Using MulterS3 with FilePond to upload images to AWS S3

Currently we have some boilerplate code in `pages/index.js`. Go ahead and delete that file and create a new file called `index.jsx` in the `pages` directory.

Add the following code;

```javascript
import React from 'react'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'

import { FileUpload } from '../components/FileUpload'

const useStyles = makeStyles(theme => ({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    paddingTop: '56.25%'
  },
  paper: {
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(8),
      padding: `${theme.spacing(6)}px ${theme.spacing(4)}px`
    }
  },
  container: {
    marginBottom: theme.spacing(10)
  }
}))

const SelectYourPictures = () => {
  const classes = useStyles({})

  return (
    <Container className={classes.container} maxWidth="md">
      <main className={classes.layout}>
        <Paper className={classes.paper} elevation={2}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Find your face using AWS Rekognition
          </Typography>
          <Typography component="h5" variant="h5" gutterBottom>
            Start by uploading images to your Rekognition collection
          </Typography>
          <FileUpload />
        </Paper>
      </main>
    </Container>
  )
}

export default SelectYourPictures
```

This gives us some very basic layout and copy. We have defined a component here, called `FileUpload`, that does not currently exist. Let's go ahead and fix that.

Our `FileUpload` component will be a basic wrapper around [React FilePond](https://github.com/pqina/react-filepond) (a high level wrapper around **FilePond** itself).

Install React FilePond, and associated plugins, as follows;

```shell
npm install --save filepond filepond-plugin-image-exif-orientation filepond-plugin-image-preview react-filepond
```

In the root of your project, create a new directory called `components`, and add a new file called `FileUpload.jsx`. Add the following code;

```javascript
import * as React from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import { makeStyles } from '@material-ui/core/styles'

import 'filepond/dist/filepond.min.css'

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2)
  }
}))

const FileUpload = () => {
  const [state, setState] = React.useState([])
  const classes = useStyles({})

  return (
    <section id="upload" className={classes.container}>
      <FilePond
        files={state}
        allowMultiple={true}
        server="/api/upload"
        onupdatefiles={items => {
          setState(items.map(item => item.file))
        }}
      />
    </section>
  )
}

export { FileUpload }
```

Let's discuss what we have here;

- First, import the React FilePond component, for use in our functional component
- Import styling directly from FilePond so that we get a nice-looking component out of the box with no customisation required
- We import the `FilePondPluginImageExifOrientation` and `FilePondPluginImagePreview` plugins and register them with FilePond, so that we can get a really nice image preview whilst each picture is uploading.
- Use a React state hook to store information about each uploading file
- We specified that images being uploaded are to be sent to the `/api/upload` endpoint that we created earlier.

Next.js does not support importing `.css` files directly, so we need to make a small modification to Next's config. Next have made available a package, exactly for this purpose.

```shell
npm install --save @zeit/next-css
```

With this installed, in the root of your project, create a new file called `next.config.js`. Add the following code;

```javascript
const webpack = require('webpack')
const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  webpack(config, options) {
    return config
  }
})
```

Calling `withCSS` adds the support we need.

Re-running `npm run dev` should work properly now and our page should load. FilePond should be rending you a droppable area where you can upload your images. Upload an image and refer to your S3 bucket.

![FilePond upload image to AWS S3 Bucket](filepond-image-aws-s3-bucket.png)

You should be able to find the uploaded image in your S3 bucket, complete with unique filename.

On the back-end, once the image has finished uploading, a call is made through to our `savePicture` function that we wrote earlier. When I tested it, this is the result I got;

```text
{
  _id: 5da33d1097e56f105f2085ba,
  filename: '20190914_171858.jpg',
  mimeType: 'image/jpeg',
  bucket: 'photonow-api-test-bucket',
  contentType: 'application/octet-stream',
  location: 'https://photonow-api-test-bucket.s3.us-east-2.amazonaws.com/5d42f14b-b9ad-4873-9ecc-fbc7ee1d0c35.jpg',
  etag: '"d510a411575e9c9d00375c73bba4c7a8"',
  __v: 0
}
```

We have touched on this already, but it's worth a recap. There are three interesting bits of information here;

- `_id` was the unique Id generated by Mongo for this image. We will need to pass this Id to Rekognition, so we can retrieve this image later.
- The original `filename`. This can be very helpful for future reference, although we will not actually use it.
- `location` is the URL to the image in the S3 bucket. We need this so we can download the image later.

We have a large `TODO` in our back-end code, the process of adding the image to the Rekognition image collection. We will take care of that next.

## How to add an image to a collection in AWS Rekognition

We have the facility in place now to enable uploads to our AWS Rekognition collection. We need to add some basic set-up code. This set-up code will run exactly one time, when the server starts up, and will ensure that our collection exists before we start adding to it.

Open `server/index.js` and make the following edits;

```diff
require('dotenv').config()

import express from 'express'
import next from 'next'

import { connectToDatabase } from './database'
import router from './router'
+import { initialise } from './faceRecognition'

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const port = 3000

nextApp.prepare().then(async () => {
  const app = express()

  router(app)

  app.get('*', (req, res) => {
    return handle(req, res)
  })

+  await initialise()
  await connectToDatabase()

  app.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on localhost:${port}`)
  })
})
```

All we're doing here is calling through to an `initialise` function, which will take care of some housekeeping for us.

Inside the `server` directory, create a new file called `faceRecognition.js` and add the following code;

```javascript{7}
require('dotenv').config()

import AWS from 'aws-sdk'
import { Types } from 'mongoose'

const rekognition = new AWS.Rekognition({ region: process.env.AWS_REGION })
const collectionName = 'my-rekognition-collection'

async function listCollections() {
  return new Promise((resolve, reject) => {
    rekognition.listCollections((err, collections) => {
      if (err) {
        return reject(err)
      }

      return resolve(collections)
    })
  })
}

async function createCollection(collectionName) {
  return new Promise((resolve, reject) => {
    rekognition.createCollection({ CollectionId: collectionName }, (err, data) => {
      if (err) {
        return reject(err)
      }

      return resolve(data)
    })
  })
}

async function initialise() {
  AWS.config.region = process.env.AWS_REGION

  const collections = await listCollections()
  const hasCollections =
    collections && collections.CollectionIds && collections.CollectionIds.length
  const collectionIds = hasCollections ? collections.CollectionIds : []
  const hasCollection = collectionIds.find(c => c === collectionName)

  if (!hasCollection) {
    await createCollection(collectionName)
  }
}

export { initialise }
```

Hopefully, the code here is fairly straightforward. The `initialise` function does the following;

- Calls through to `listCollections`, which uses the AWS SDK to query Rekognition, and return a list of collections that already exist. The whole thing is wrapped in `Promise`s, because I think they're easier to deal with than callbacks.
- If there are no collections already in existence, then default `collectionIds` to an empty array to prevent errors
- If our collection (named on line 7) has not been created, it is then created by calling `createCollection`.

This code should guarantee that when we come to add images to our collection later, that the collection does indeed exist (to avoid unnecessary errors).

We left a `TODO` in `server/database.js` for adding images to our Rekognition collection, so let's discuss that now.

Open `server/database.js` and make the following edits;

```diff
+import { addImageToCollection } from './faceRecognition'

// Code omitted for brevity

const savePicture = async (req, res) => {
  try {
    const originalFile = req.file.transforms.find(t => t.id === 'original')

    if (!originalFile) {
      throw new Error('Unable to find original file!')
    }

    const { originalname, mimetype } = req.file

    const picture = {
      filename: originalname,
      mimeType: mimetype,
      bucket: originalFile.bucket,
      contentType: originalFile.contentType,
      location: originalFile.location,
      etag: originalFile.etag
    }

    const result = await new PictureModel(picture).save()

-   // TODO... Add to AWS Rekognition

+    await addImageToCollection(
+      originalFile.bucket,
+      result._id.toString(),
+      originalFile.key
+    )

    return res.status(200).json({ success: true, data: 'Upload complete' })
  } catch (e) {
    return res.status(500).json({
      success: false,
      data: e
    })
  }
}

export { connectToDatabase, savePicture, PictureModel }
```

Once our image has been uploaded to S3, and added to our own database, we will add it to our Rekognition collection by calling `addImageToCollection`, which we will write now.

Open `faceRecognition.js` and make the following changes;

```diff{8}
// Code omitted for brevity

+async function addImageToCollection(bucket, pictureId, s3Filename) {
+  return new Promise((resolve, reject) => {
+    rekognition.indexFaces(
+      {
+        CollectionId: collectionName,
+        ExternalImageId: pictureId,
+        Image: {
+          S3Object: {
+            Bucket: bucket,
+            Name: s3Filename
+          }
+        }
+      },
+      err => {
+        if (err) {
+          return reject(err);
+        }
+        return resolve();
+      }
+    );
+  });
+}

-export { initialise };
+export { initialise, addImageToCollection };
```

The AWS SDK gives us a function, unintuitively called `indexFaces`, which we can call with the location of our image in S3.

The key to all this working is line 8 (highlighted);

```javascript
ExternalImageId: pictureId,
```

We associate `ExternalImageId` with the `_id` we were given by MongoDB. When we get matches later, we will use this `ExternalImageId` to query the location (URL) of the image from our database.

At the time of writing, there is not any kind of visual tool on Rekognition's website that can be used for verifying everything is working, so we must persevere to the next step to recognise the fruits of our hard work.

## How to use React-Webcam

We will use React-Webcam to capture an image of the user from their webcam, and then upload that image to AWS. AWS will respond with a collection of images in which it _thinks_ the user appears in. From testing, I have found this process to be quite accurate, and I have had a lot of fun with it.

In more detail, we need to do the following;

- Install **React Webcam** and configure it to capture images at the right aspect ratio.
- Tell Next.js not to server-side render this code, because it will not work on the server.
- Use Material UI to add a nice UI, and a _Capture_ button
- When the capture button is clicked, we need to grab the current frame, convert it to a `Blob` and then upload it to a new API endpoint (which we will create in the final step).

Let's get started.

Rather than exposing React Webcam directly to our page, we will create a new component and wrap up as much logic as we can.

Start by installing React Webcam as follows;

```shell
npm install --save react-webcam
```

Inside the `components` directory, create a new file called `Webcam.jsx`, and add the following code.

```javascript
import React from 'react'
import ReactWebcam from 'react-webcam'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      marginLeft: 0
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12
    },
    wrapper: {
      position: 'relative'
    }
  })
)

const getVideoConstraints = () => {
  const padding = 16
  const aspectRatio = 1.777777777777778
  const width = window.innerWidth > 640 + padding ? 640 : window.innerWidth - padding

  return {
    width,
    height: width / aspectRatio,
    facingMode: 'user'
  }
}

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: contentType })
}

const Webcam = ({ onCapture, isUploading }) => {
  const classes = useStyles({})

  const [state, setState] = React.useState({
    loaded: false,
    uploading: false,
    pictures: []
  })

  React.useEffect(() => {
    setState({ ...state, uploading: isUploading })
  }, [isUploading])

  const webcamRef = React.useRef(null)

  const capture = React.useCallback(async () => {
    if (webcamRef && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        const split = imageSrc.split(',')
        const contentType = 'image/jpeg'
        const blob = b64toBlob(split[1], contentType)
        onCapture(blob)
      }
    }
  }, [webcamRef])

  const videoConstraints = getVideoConstraints()

  return (
    <>
      <ReactWebcam
        audio={false}
        height={videoConstraints.height}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={videoConstraints.width}
        videoConstraints={videoConstraints}
        screenshotQuality={1}
      />
      <div className={classes.wrapper}>
        <Button
          color="primary"
          variant="contained"
          disabled={state.uploading}
          className={classes.button}
          onClick={capture}
          type="button"
        >
          {state.uploading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
          Capture Photo
        </Button>
      </div>
    </>
  )
}

export { Webcam }
```

This code is a bit long and a bit complicated looking, so let's digest it.

- Starting with the `return` method of the functional component. We define a basic layout. We mount the `ReactWebcam` component, and then directly underneath we render a button that will show a spinner when uploading to our API. This is controlled externally. This component has two external factors; `onCapture` and `isUploading`. `onCapture` is a callback which we raise when an image is captured and processed, and `isUploading` is passed to us when the upload is in progress.
- Reading the code upwards, we hit a variable called `webcamRef`, whose value can change whilst the application is loading. We use the `useRef` hook to store the value of this object, and then watch it.
- We pass a `videoConstraints` object to `ReactWebcam`, which describes the shape (`width` and `height`) of the capture. We set the `width` and `height` based on the width of the window. We also specify that we want to use the `facingMode` of `user`. This defaults to either the webcam, or the "selfie-cam" when used on a mobile device.
- We have a function called `b64toBlob`, which I [pinched from Stackoverflow and just tweaked a bit](https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript). This converts the captured data into Base64 format and then turns it into a `Blob`, which we can upload.
- When the user clicks the _Capture_ button, the `capture` function is called, which calls `getScreenshot` from React Webcam, converts the image to a `Blob` and then invokes the `onCapture` callback function and the result is passed back up to the parent for further processing (which we will cover later).

With our `Webcam` component created, we need to import it into our page and use it.

Open `pages/index.js` and make the following changes;

```diff
import React from "react";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
+import dynamic from 'next/dynamic'

import { FileUpload } from "../components/FileUpload";
+const Webcam = dynamic(import('../components/Webcam').then(instance => instance.Webcam), {
+  ssr: false
+})

const useStyles = makeStyles(theme => ({
  layout: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  paper: {
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(8),
      padding: `${theme.spacing(6)}px ${theme.spacing(4)}px`
    }
  },
  container: {
    marginBottom: theme.spacing(10)
  }
}));

const SelectYourPictures = () => {
  const classes = useStyles({});

  return (
    <Container className={classes.container} maxWidth="md">
      <main className={classes.layout}>
        <Paper className={classes.paper} elevation={2}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Find your face using AWS Rekognition
          </Typography>
          <Typography component="h5" variant="h5" gutterBottom>
            Start by uploading images to your Rekognition collection
          </Typography>
          <FileUpload />
+         <Typography component="h5" variant="h5" gutterBottom>
+           Next, upload a picture of yourself
+         </Typography>
+         <Webcam />
        </Paper>
      </main>
    </Container>
  );
};

export default SelectYourPictures;
```

Not what you were expecting huh? As Next server-side renders all of our code, this creates a problem for us. We cannot have our `Webcam` component server-side rendered because it uses the `window` and other things that are just not available on the server. Next supports the [upcoming (ES2010) dynamic imports proposal](https://github.com/tc39/proposal-dynamic-import), which enables lazy loading of modules. We pass in the `{ ssr: false }` flag to instruct Next.js that this is a client-side only component.

We will take care of wiring in the final step. For now, you should at least be able to see yourself from your webcam on the page, when you refresh.

## Tying it all together to find your face within a collection of images in AWS Rekognition

We're on the home straight of this marathon post. All that is left to do is;

- Wire up the _Capture_ button we wrote in the previous step to post the image from our webcam to the server.
- Write a back-end endpoint to accept the image, and run it through Rekognition to find a list of matches.
- Return those matches back to the client, so that we can display them.

Let's start with the front-end. Open `pages/index.js`

```diff

// Code omitted for brevity

const SelectYourPictures = () => {
  const classes = useStyles({});

  return (
    <Container className={classes.container} maxWidth="md">
      <main className={classes.layout}>
        <Paper className={classes.paper} elevation={2}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Find your face using AWS Rekognition
          </Typography>
          <Typography component="h5" variant="h5" gutterBottom>
            Start by uploading images to your Rekognition collection
          </Typography>
          <FileUpload />
          <Typography component="h5" variant="h5" gutterBottom>
            Next, upload a picture of yourself
          </Typography>
-         <Webcam />
+          <Webcam onCapture={processImage} isUploading={uploading} />
+          {hasSearched &&
+            (pictures.length > 0 ? renderPictures() : renderNoPicturesFound())}
        </Paper>
      </main>
    </Container>
  );
};
```

We will define a few functions and properties here. First, we will add a function called `processImage`, which will take care of uploading the captured image. Then we will add a variable called `uploading`, which will show a loading spinner when the upload is in progress. We will also add a `hasSearched` variable and a `pictures` variable to show the results of the server request. Finally, if there were any matches, we will call `renderPictures()`, otherwise, we will call `renderNoPicturesFound()`.

Add the following two functions INSIDE the `SelectYourPictures` function;

```javascript
const renderNoPicturesFound = () => (
  <>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      mb={3}
      mt={3}
    >
      <Typography component="h1" variant="h4" align="center">
        Nothing to show
      </Typography>
      <Typography component="p" gutterBottom>
        Sorry, we were not able to find any pictures of you, please try again.
      </Typography>
    </Box>
  </>
)

const renderPictures = () => {
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        mb={3}
      >
        <Typography component="h1" variant="h4" align="center">
          We found you!
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {pictures.map(picture => (
          <Grid item key={picture.location} xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image={picture.location}
                title={picture.filename}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
```

In the case of matches being found, `renderPictures` will be called and we will iterate through each one, rendering it as a card. Otherwise, we will apologise and ask the user to try again, by calling `renderNoPicturesFound`.

Also, INSIDE the `SelectYourPictures` function, add the following code;

```javascript
const [pictures, setPictures] = React.useState([])
const [hasSearched, setHasSearched] = React.useState(false)
const [uploading, setUploading] = React.useState(false)

const processImage = async blob => {
  setUploading(true)
  const { success, data } = await uploadPhotoAsync('/face', 'A Face', blob)
  if (success) {
    setPictures(data)
  }
  setHasSearched(true)
  setUploading(false)
}
```

Here we use 3 hooks, to ensure that our component renders and re-renders accordingly when state changes;

- `pictures` stores the pictures retrieved from the server
- `hasSearched` is set to `true` when at least 1 search has been performed (so that we do not prematurely show the _No Pictures Found_ screen)
- `uploading` is set to `true` whilst uploading, and set to `false` when upload is completed.

[The full code for this file can be found on GitHub](https://github.com/jpreecedev/aws-rekognition-learning/blob/master/pages/index.jsx) (it is a bit long for even this post!).

The `processImage` function uploads the image to the server, using the `uploadPhotoAsync` function, which we will define next.

So that we do not forget, at the top of the file add the following import for our `uploadPhotoAsync` function;

```diff
+import { uploadPhotoAsync } from './utils'
```

Now, create a new file called `utils.js` in the `pages` directory, and add the following code;

```javascript
const serverUrl = 'http://localhost:3000/api'

const uploadPhotoAsync = async (apiUrl, filename, blob) => {
  const formData = new FormData()
  formData.append('photo', blob, filename)

  const options = {
    method: 'POST',
    body: formData
  }

  const response = await fetch(`${serverUrl}${apiUrl}`, {
    credentials: 'same-origin',
    ...options
  })

  if (response.status !== 200) {
    return {
      success: false,
      data: `Request failed with status code ${
        response.status
      }.  ${await response.text()}`
    }
  }

  return await response.json()
}

export { uploadPhotoAsync }
```

We use `formData` to add our `Blob` (the key `photo` is important because we will use this to fetch the image from the body later) to the body of the request, then use `fetch` to send a `POST` request to `http://localhost:3000/api/face`. If the request is successful, the response is returned back up to the page, otherwise, the error is passed up instead.

We have not created the `/face` endpoint yet, so let's do that now.

Open `server/router.js` and add the following code;

```diff
+import { recogniseFromBuffer } from './faceRecognition'

// Code omitted for brevity

+router.post('/face', multer().single('photo'), async (req, res) => {
+  try {
+    const result = await recogniseFromBuffer(req.file.buffer)
+
+    return res.status(200).json({
+      success: true,
+      data: result
+    })
+  } catch (error) {
+    return res.status(500).json({
+      success: false,
+      data: 'No faces were recognised'
+    })
+  }
+})

function Router(app) {
  app.use(`/api`, router)
}

export default Router
```

You may have noticed the `recogniseFromBuffer` function. This is it, dear reader, the moment you have been waiting for. `recogniseFromBuffer` will call through to Rekognition, passing along our image, and look for matches. All matches will be returned back to us, and we can return them to the client to be displayed.

Open `faceRecognition.js` and make the following changes;

```diff

// Code omitted for brevity

+async function recogniseFromBuffer(image) {
+  return new Promise((resolve, reject) => {
+    rekognition.searchFacesByImage(
+      {
+        CollectionId: collectionName,
+        FaceMatchThreshold: 95,
+        Image: { Bytes: image },
+        MaxFaces: 5
+      },
+      async (err, data) => {
+        if (err) {
+          return reject(err)
+        }
+
+        if (data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face) {
+          const sorted = data.FaceMatches.sort(
+            (a, b) => b.Face.Confidence - a.Face.Confidence
+          )
+
+          const matchSet = new Set()
+          sorted.forEach(match => {
+            matchSet.add(Types.ObjectId(match.Face.ExternalImageId.toString()))
+          })
+
+          const pictures = getPictures(Array.from(matchSet).map(c => Types.ObjectId(c)))
+
+          return resolve(pictures)
+        }
+        return reject('Not recognized')
+      }
+    )
+  })
+}

-export { initialise, addImageToCollection }
+export { recogniseFromBuffer, initialise, addImageToCollection }
```

This code is surprisingly simple! Rekognition gives us a function called `searchFacesByImage`, which we can call, passing in the users uploaded image. It then calls back with a collection of matches (`FaceMatches`). We take a moment to sort the collection into order of _most confident match, to least confident match_ (minimum threshold was set to 95%). We then extract the `ExternalImageId` and create a unique collection of those ids, so we can go fetch them from the database.

Yes, it really is that simple. Job almost done.

We only need to write our code for fetching pictures from the database, using an array of Ids. Add the following function to `database.js`;

```diff
// Code omitted for brevity

+const getPictures = async ids => {
+  return await PictureModel.find({
+    _id: {
+      $in: ids
+    }
+  }).exec()
+}

-export { connectToDatabase, savePicture, PictureModel }
+export { connectToDatabase, getPictures, savePicture, PictureModel }
```

And be sure to add an import for it to `faceRecognition.js`;

```diff
+import { getPictures } from './database'
```

Go back to your browser, capture a picture of your face, and observe, those sweet sweet matches should appear after just a few short seconds. Success.

## Summary

Yep, this was a long one, and it's been quite a journey. We started by discussing what **AWS Rekognition** is, and how much it costs. We moved on to discuss Next.js, and how to set it up with a custom Express back-end. When then dove into **MongoDB** with **Mognoose**, and used it in conjunction with **dotenv** to set-up our database and schema. We then wired up **Multer**, and **MulterS3** so that we can easily upload images to our **AWS S3** bucket using **React FilePond** on the front-end. We then moved on to wiring up **React Webcam**, which enables us to capture a picture from the users webcam, or the front-facing camera on their smartphone, and uploaded that image to the back-end so we could analyse it and look for matches in our Rekognition collection, with at least 95% certainty. We also heavily relied on **React Hooks** and **Material UI** for layout and behaviour.

I hope you have enjoyed this one! All comments and feedback are welcome and appreciated.
