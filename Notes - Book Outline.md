Want to start your own SASS business? This book tells you every step of the way how to build your own SASS website.

1. Introduction

- What you will learn
- Who should read this book?

2. System design

- What features do we require for MVP? (Scope)
- Mock out screens needed using Balsamiq
- Storybook for building components in isolation
- Experiment with AWS Rekognition on website
- Create an account with Mongo Atlas, get familiar with the UI

3. Getting started

- Create a basic repo with Next.js, TypeScript, dotenv
  - Discuss server side rendering, client side hydration
- Git, NPM, Prettier, ESLint, EditorConfig, VS Code
- Material UI
- Custom Express code
- MongoDB, Mongoose
- Jest, Mongo Memory Server, React Testing Library
- As an example, get the front-end talking to the back-end

4. Authentication and Authorisation

- Passport.js, local strategy, registration page
- Login page
- Authorisation, create secure page and redirect back to login if not authorised, roles
  - One for administrators, one for photographers, one for customers
- Add Google OAuth
- Add Facebook OAuth

5. Face Recognition

- Allow photographer to create a new collection, set their own price
- Allow photographer to upload image to collection, image should be added to Rekognition collection
  - Upload to S3 using Multer. Resize and watermark image.
- As a customer, use React Webcam to capture image
- Image should be used to find matches in Rekognition
- Display matches back to user

6. Checkout using Stripe

- Customer should be able to review moments, add to basket, remove from basket
- Capture billing, shipping details
- Capture card details using Stripe
  - Confirm payment
- Show order confirmation, allow user to download high-res version of their image
- View order in Stripe
- Email confirmation using Amazon SES
- State management discussions (Redux or Apollo)

7. Back-end systems

- Allow administrators to review all orders
- Allow photographers to review orders of their images

8. Deployment

- Digital ocean, pm2, semantic versioning
- Cloudflare CDN
