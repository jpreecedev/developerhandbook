# Getting started with Next.js

1. Get started fast with `create-next-app`. Really stripped down and basic, very simple compared to Create React App
2. Has built in support for dynamic imports
3. Built in support for TypeScript
4. Uses styled-jsx for css-in-js styling, css modules, global css supported as well (using global attribute)
5. Supports importing CSS files, and proper CSS modules
6. Automatic code splitting, each page gets its own bundle
7. Has dynamic routing
8. Built in pre-rendering for static pages
9. Static HTML export (think Gatsby competitor)

- Styles are inlined, which might be problematic for caching

# How to configure VS Code for success, weather you're a team of one or many

- Add NPM scripts for linting CSS and JS
- Pre-commit, pre-push hooks using Husky
- Jest, React Testing Library
- For back-end, use TS Node, Nodemon
- Prettier, Stylelint, ESLint, EditorConfig
- Storybook

# An introduction to Test Driven Development (TDD) (React Testing Library, Mongo Memory Server)

- Lots of examples of writing tests
  - Front-end tests using Jest/React Testing Library
  - Back-end tests using Jest/Mongo Memory Server

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
