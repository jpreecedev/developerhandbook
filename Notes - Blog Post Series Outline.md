# Getting started with Next.js

- Why Next.js
- Getting started
- How to use Express.js with Next.js
  - How to use Nodemon
- Next.js convention based routing
- Next.js dynamic routing
- Fetch data server-side using Next.js getInitialProps
- Next.js automatic code splitting and lazy loading
- Styling in Next
  - CSS, CSS Modules, CSS-in-Js
- Next.js static site generator

# How to configure VS Code for success, weather you're a team of one or many

- Linting/formatting
- Terminal
- Extensions
- Keyboard shortcuts
- Pre-commit/pre-push hooks

# An introduction to Test Driven Development (TDD) on the front-end

- What is TDD, how does this compare to writing tests retrospectively?
  - Pros and cons (slower, more confidence going forward)
- Install Jest, VS Code extension, NPM script, watch, basic "Hello, World!" examples
- Testing using React Testing Library (integration testing)
- Simulating clicks and other events, mocking
- Accessibility tests with Storybook and various plugins

# How to implement Passport.js, with Local Strategy, Google OAuth and Facebook Login

- Passport.js, Local, JWT, Google, Facebook
- Login page
- Registration page
- Secure page
- Authorisation/roles

# How to use AWS Rekognition JavaScript API

- Create a face recogition collection
- Add images
- List collections
- Delete collection
- Count number of faces in image
- Search faces by image
- Use `ExternalImageId` to retrieve image later from Mongo

# How to use React Webcam, upload image to S3, Multer, Sharp

- Set up React webcam
  - Add `useWindowSize` hook to resize camera as appropriate, maintain aspect ratio
  - Capture image, convert base64 to blob
  - Use `lodash.throttle` to not hurt performance too much

# How to decide which React state management tool to use

- Context API
- React Hooks
- Redux (talk about Redux hooks)
- Apollo GraphQL

# How to accept payments using Stripe

- Capture card details using Stripe input fields
- Create token
- Pass token to back-end (and re-calculate order value)
- Optional: Create a customer, associate charge with customer (customer must be logged in)
- Bonus: Send confirmation email using AWS SES

# How to deploy your website to Digital Ocean and use Cloudflare for effective caching

- Create a droplet
- Connect, basic setup
- Locally, use PM2, semantic version to decide when to release
- Front website using Cloudflare CDN, get SSL for free
- Bonus: CI/CD pipeline using Github actions?!?!
