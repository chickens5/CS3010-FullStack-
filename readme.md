
# CS 3010 ~ Spring 2025

## Eden App 

![Home Page of App](image.png)

*A React/Vite + Express/Node/PostgreSQL full stack framework*

- Register an account
- Update Account
- Login
- Logout

## Getting Started

#### Overview:

Each new user gets a JWT on register/login (signed server-side against Postgres-verified credentials via bcrypt). The frontend stores that token in `localStorage` and a shared axios instance (`frontend/src/utils/api.js`) automatically attaches it as a `Bearer` header on every API call via a request interceptor. Express verifies the token on protected routes (checking the token's `user_id` against the requested resource) before querying Postgres through the service/repository layers, and a response interceptor globally handles expired/invalid tokens (401s) by clearing storage and redirecting to login.


### Frontend 

*Dependencies*
  - axios
  - body-parser
  - bootstrap
  - cors
  - express
  - lit
  - react
  - react-dom
  - react-router-dom

* After cloning the repo...
Open terminal of working dir:

`cd frontend`
`npm install`
`npm run dev`

#### Backend
 *Dependencies:*
   - brycypt
   - jsonwebtoken
   - bcryptjs
   - cors
   - express
   - pg
   - winston

`cd backend`
`npm install`
`npm run start`

### DB setup

 * user_accounts
    - id 
    - username
    - password

  * user_account_details
    - id
    - user_id
    - firstname
    - lastname
    - email
    - profile_picture

  
