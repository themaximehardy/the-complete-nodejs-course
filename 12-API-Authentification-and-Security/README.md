# API Authentification and Security (Task App)

### 1. Introduction

Right now all of the API endpoints are publicly accessible. That means anyone can come along and do something like delete every single piece of data in the database. And obviously that's a problem. So in this section we're going to lock all of that down putting it behind authentication.

### 2. Securely Storing Passwords: Part I

Right now the passwords we have in DB are exactly as they were provided. This is known as **storing the password in plain text** and for passwords this is a terrible idea! Now the problem with storing plain text passwords is that most users use these same password for multiple accounts. Let's say our database did get hacked. We've exposed the user to further hacks because now all of their credentials are out in the open.

So the solution is to store not a plain text a password but a **hashed password**. The hashed value is going to look nothing like the plain text password and if someone was to hack the database and get a hold of all of the users hashed passwords they would be useless because the algorithm we're going to use to generate it is **not reversible**.

We're going to use the [bcrypt](https://www.npmjs.com/package/bcryptjs) algorithm (hashing algorithm). It is a very secure and widely used hashing algorithm. It's great for all sorts of crypto graphical use cases including this one: securely storing a user's password. We can get access to an implementation of the bcrypt algorithm in our Nodejs code by installing and using an [NPM module](https://www.npmjs.com/package/bcryptjs).

```sh
yarn add bcryptjs
```

```js
const bcrypt = require('bcryptjs');

const myFunction = async () => {
  const password = 'Red1234!'; // plaintext password is what the user provides us
  const hashedPassword = await bcrypt.hash(password, 8); // hashed password is what will actually end up storing
  console.log('password: ', password); // Red1234!
  console.log('hashedPassword: ', hashedPassword); // $2a$08$V.8sVesxu6oGTDA/qvoZ5O463XFMASUHC48RQo4IzbRTquVyVS..e

  const isMatch = await bcrypt.compare('Red1234!', hashedPassword);
  console.log('isMatch: ', isMatch); // true
};

myFunction();
```

`bcrypt.hash` is a promise which takes two arguments. The first is the plain text password which we have access to via the `password` variable. And the second is the **number of rounds we want to perform**. It determines **how many times the hashing algorithm is executed**. And the good number is **eight**. It strikes a nice balance between security and speed. If we use too few rounds the algorithm is a bit easier to crack. If we use too many rounds it takes so long to run that our application becomes useless.

Now there's an important distinction between **hashing algorithms** and **encryption algorithms** with encryption we can get the original value back.

Let's say we'm trying to **encrypt** the string `'Max'` the output the encrypted value would look like some random series of characters `'Z5O463XFMASUHC48'` but using the encryption algorithm we could always turn that random series of characters back in to the original value.

`'Max' –> 'Z5O463XFMASUHC48' –> 'Max'`

**Hashing algorithms** are one way algorithms which means **we can't reverse the process**. The long hash we received as an output is something that we can not reverse... hashing algorithms by design are not reversible.

`'Max' –> '$08$V.8sVesxu6oG' –> X`

Then, how do you do log in where we want to take the password that someone provided and see if it actually matches the hash we've stored in the database?

**bcrypt** gives us a very easy way to do that. All we do is we hash the plaintext password that they provided when logging in and we can pair that hash with the hash stored in the database.

```js
const isMatch = await bcrypt.compare('Red1234!', hashedPassword);
console.log('isMatch: ', isMatch); // true
```

### 3. Securely Storing Passwords: Part II

There are **two main places where plaintext passwords are provided** to our application and we can explore both by heading over to the user router.

1. Post users this is when a **user is created** and it's impossible to create a user without providing a password.
2. When a **user is updated**, there is a chance that a new password is provided and if it is provided we want to make sure we hash it.

We won't touch the `src/routers/user.js` file. But we're going to customize the User model! Mongoose supports what's known as [middleware](https://mongoosejs.com/docs/middleware.html). Middleware is a way to customize the behavior of your Mongoose model. With middelware, we can register some functions to run before or after given events occur.

We're going to run some code just before a user is saved. We're gonna check if there's a plain text password and if there is we'll go ahead and hash it.

```js
// src/models/user.js
const mongoose = require('mongoose');
const validator = require('validator');

// Add `new mongoose.Schema`
const userSchema = new mongoose.Schema({
  //...
});

// we can't use the `() =>` because of this binding...
userSchema.pre('save', async function (next) {
  const user = this; // easier to understand
  console.log('user: ', user); // we can see the user when we create it... but not when we update it
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
```

The problem when we update currently is we use `findByIdAndUpdate` which bypasses mongoose. It performs a direct operation on the database.

```js
// src/routers/user.js
//...
router.patch('/users/:id', async (req, res) => {
  const { body, params } = req;
  const _id = params.id;

  const updates = Object.keys(body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    // 1 – below is bypassing mongoose as a result, or middlewares... (previous way to do it)
    // const user = await User.findByIdAndUpdate(_id, body, { new: true, runValidators: true });

    // 2 – we need to use another way then
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    // 2.1 – then...
    updates.forEach((update) => {
      user[update] = body[update];
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
//...
```

```js
// src/models/user.js
//...
// here is the middleware | we can't use the `() =>` because of this binding...
userSchema.pre('save', async function (next) {
  const user = this; // easier to understand
  // in case of an update, we don't want to hash a password unchanged :p
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
//...
```

### 4. Logging in Users

```js
// src/routers/user.js
//...
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    res.send(user);
  } catch (error) {
    res.status(400).send();
  }
});
//...
```

```js
// src/models/user.js
//...
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};
//...
```

Note: we've also added `unique: true` to email, to index email and not allow same email for multiple users

```js
// src/models/user.js
//...
email: {
  type: String,
  unique: true, // ADDED
//...
```

### 5. JSON Web Tokens

Every single express route we define will fall into one of two categories. It'll either be **public** and accessible to anyone or it **sit behind authentication** and we'll have to be correctly authenticated to use it.

Now **the only two routes that are going to be public** will be these **sign up** route and the **log in** route everything else whether it's related to users or tasks is going to require you to be authenticated.

For example if a user is trying to delete a task we need to be sure he is authenticated so we can make sure that he is the one who create it. We don't want him to be able to delete a task created by some other user.

What we need to do is **set up the log in request** to **send back and authentication token**. This is something that the requester will be able to use later on with other requests where they need to be authenticated.

How are we going to create and manage those authentication tokens?

We're going to use a JSON Web Token or JWT for short. It is very popular. We'll be able to do things like **have tokens expire after a certain amount of time** so users can stay logged in for ever optionally we could never expire the token and allow a user to use it indefinitely.

[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) provides us everything we need for creating these authentication tokens and validating them making sure they are still valid for example making sure they haven't expired.

`jwt.sign`

```js
const myFunction = async () => {
  const token = jwt.sign({ _id: 'abc123' }, 'SECRET_RANDOM_SERIES_OF_CHARS');
  console.log('token: ', token);
  // token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhYmMxMjMiLCJpYXQiOjE2MDM0Mzg1NTN9.DPtNkzYULXYpCm4zptpIK-U_vDtdRF8UizLFESsVJOY
};

myFunction();
```

The JWT is actually made up of three distinct parts separated by the period.

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9(.)` – This is a base64 encoded JSON string. And this is known as the **header**. It contains some meta information about what type of token it is. It's a JWT and the algorithm that was used to generate it.

`(.)eyJfaWQiOiJhYmMxMjMiLCJpYXQiOjE2MDM0Mzg1NTN9(.)` – This is known as the **payload** or **body**. This is also a base64 encoded JSON string. And it contains the data that we provided which in our case would be the `_id` from up above.

`(.)DPtNkzYULXYpCm4zptpIK-U_vDtdRF8UizLFESsVJOY` – At the very end of the JSON Web Token we have the signature. And this is used to verify the token later on when we verify it.

**The goal of the JSON Web Token** isn't to hide the data that we've provided... The data is actually publicly viewable to anyone who has the token they don't need the secret to see that! The whole point of the JWT is to create data that's verifiable via these signature. So if someone else comes along and tries to change the data right here they're not going to be able to do so successfully because they won't know what secret was used with the algorithm so things will fail to prove this real quick.

Let's go to [base64decode.org](https://www.base64decode.org/) and copy the payload/body into it. Then decode it. We can see `{"_id":"abc123","iat":1603438553}` we've the data we provided `_id` and then we've the `iat` (which stands for **issued at**), this is a timestamp letting us know when the token was created.

`jwt.verify`

```js
const jwt = require('jsonwebtoken');

const myFunction = async () => {
  const token = jwt.sign({ _id: 'abc123' }, 'SECRET_RANDOM_SERIES_OF_CHARS');
  console.log('token: ', token); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhYmMxMjMiLCJpYXQiOjE2MDM0Mzg1NTN9.DPtNkzYULXYpCm4zptpIK-U_vDtdRF8UizLFESsVJOY

  const dataOk = jwt.verify(token, 'SECRET_RANDOM_SERIES_OF_CHARS');
  console.log('dataOk: ', dataOk);
  // OK – data:  { _id: 'abc123', iat: 1603439346 }

  const dataNope = jwt.verify(token, 'NOPE_SECRET_RANDOM_SERIES_OF_CHARS');
  console.log('dataNope: ', dataNope);
  // Nope – JsonWebTokenError: invalid signature
};

myFunction();
```

One more thing we can do with JWT is expire them after a certain amount of time which can be a really useful thing to do. When we create the token we provide a third argument, an object where we can customize it with some options. One option is _expires_ in expires in allows you to provide as a string the amount of time you want your token to be valid.

```js
const token = jwt.sign({ _id: 'abc123' }, 'SECRET_RANDOM_SERIES_OF_CHARS', {
  expiresIn: '7 days', // here it will expire in 7 days
});
```

### 6. Generating Authentication Tokens

We're going to turn our attention back to the login end point and we're going to set this up to actually generate a JSON Web token and send it back to the user. We'll also do the exact same thing for signing up. If we just signed up we shouldn't have to log in in order to start doing things. We know we're that user because we just created our account. So both of these requests are going to end up sending back JWT authentication tokens.

```js
// src/routers/user.js
//...
const user = await User.findByCredentials(email, password); // look at the User (User = model)
const token = await user.generateAuthToken(); // look at the user (user = instance)
//...
```

```js
// src/models/user.js
//...
userSchema.methods.generateAuthToken = async function () {...} // `methods`
userSchema.statics.findByCredentials = async (email, password) => {...} // `statics`
//...
```

So **statics** methods are accessible on the **model** sometimes called **Model methods** and our **methods** are accessible on the **instances** sometimes called **instance methods**.

---

```js
// src/routers/user.js
//...
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});
//...
```

```js
// src/models/user.js
//...
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'OUR_SECRET');
  return token;
};
//...
```

Now currently no request requires authentication but we're work on fixing that shortly!

One thing we'll notice about the current setup is that **we're not keeping track of this token value anywhere on the server**. The server simply generates it with the correct secret and sends it back. This has an important implication: **users can't truly log out**. This token as long as it exists means the user is logged in.

So if it gets in the wrong hands a user has no way to log out and invalidate a given token. We can go ahead and fix that by tracking tokens we generate for users. This will allow a user to log in from multiple devices like their laptop and a phone then they'd be able to log out of one while still being logged in to the other. So all we're going to do is store all of the tokens we generate for a user.

Then let's add the tokens in our User model:

```js
// src/models/user.js
const userSchema = new mongoose.Schema({
  //...
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
//...
```

```js
// src/routers/user.js
//...
// When the user signup
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
//...
```

### 7. Express Middleware

Remember every single request to the API is going to **require authentication** with the exception of **sign up** and **log in** for everything else the client is going to need to provide that authentication token and the server is going to validate it before performing whatever operation they're trying to do.

**Express middleware** is going to be at the core of allowing us to get all of this done.

```js
// MIDDLEWARES
// without middleware: new request -> run route handler
// with middleware: new request -> do something -> run route handler
app.use((req, res, next) => {
  console.log(req.method, req.path); // for example GET / users
  next();
});
```

Maybe we want to log out some statistics about the request so we can keep track of it in our server logs or maybe we want to check if there is a valid authentication token... And once the middleware runs we can continue to choose to run the regular route handler so the given operation is completed successfully. We could allow the route handler to run or we could prevent it from running if the user isn't authenticated as an example.

```js
// src/index.js
//...
app.use((req, res, next) => {
  // just an example where we "disable" all the GET request
  if (req.method === 'GET') {
    res.send('GET requests are disable');
  } else {
    next();
  }
});
//...
```

---

Challenge time: setup a middleware for maintenance mode!

```js
// src/index.js
//...
app.use((req, res, next) => {
  res.status(503).send('Site is currently down. Check back soon!');
});
//...
```

### 8. Accepting Authentication Tokens

We will check for an incoming authentication token, it will verify that it is a valid JSON Web Token. Then it will find the associated user. How to set up middleware for an individual route?

```js
// src/middleware/auth.js
const auth = async (req, res, next) => {
  console.log('[auth-middleware]');
  next();
};

module.exports = auth;
```

```js
// src/routers/user.js
const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth'); // import auth middleware
const User = require('../models/user');
//...
// router . get (route path, MIDDLEWARE, roothandler)
router.get('/users/me', auth, async (req, res) => {
  //...
});
//...
module.exports = router;
```

Now remember it's only ever going to run the root handler if the middleware calls that next function...

Then we should go to Postman, "Read users" (`GET /users`) and add a header property.

```sh
Key: Authorization
Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjkyN2VhOGVlMWFhNzViYzMyZTQ5NTIiLCJpYXQiOjE2MDM1MzgzNTR9.aYY8yLjfBD909fGsMG91ZMbb1DvtK4TIUlY5hnfpiPE
```

So this is no one as a **bearer token** in which the client provides the token with the request. They're trying to perform and this is all the client is going to need to do to actually provide the information necessary to get authenticated.

Let's go back to our middleware. We're going to load two things: the JWT library so we can validate the token being provided and we're also going to load in the User model so we can find them in the database once we've validated the auth token.

```js
const jsonwebtoken = require('jsonwebtoken');

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    // 1 – we get the token in the header request
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('*** token: ', token); // token:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjkyN2VhOGVlMWFhNzViYzMyZTQ5NTIiLCJpYXQiOjE2MDM1MzgzNTR9.aYY8yLjfBD909fGsMG91ZMbb1DvtK4TIUlY5hnfpiPE
    // 2 – we verify it and we decode it
    const decode = jwt.verify(token, 'OUR_SECRET');
    console.log('*** decode: ', decode); // decode:  { _id: '5f927ea8ee1aa75bc32e4952', iat: 1603538354 }
    // 3 – we find the user based on the decoded _id and we check if the token exists inside of this user
    const user = await User.findOne({ _id: decode._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }
    console.log('*** user: ', user); // user: [user data]
    req.user = user; // passing the user to the root handler to avoid doing it twice...
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate!' });
  }
};

module.exports = auth;
```

The other thing we're going to do is give that root handler access to the user that we fetched from the database we already fetched them and there's no need for the root handlers to have to fetch the user again as that would just **waste resources and time**. We can actually add a property onto request to store this. And the root handlers will be able to access it later on.

```js
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user); // req.user to get the user save previously in the middleware
});
```

---

Summary:

1. The first thing we did is **we set up a middleware function to run for this specific routes** to the route that we want to lock down with authentication.
2. We passed the **middleware function in as the second argument**. And the **root handler in as the third**.
3. The middleware function itself starts by **looking for the header** that the user is supposed to provide and then **validates** that header and it **finds the associated user** from there.
4. One of two things happen either we call next. **Letting the root handler run** or if they're not authenticated we go ahead and send back an error letting them know that they're not able to perform the operation that they're trying to perform.

### 9. Advanced Postman

Let's focus on Postman, and especially **Postman environments** and **Postman environment variables**.

To illustrate how environments are going to play a role in postman let's start off with an example. So right now all of our requests are being made to `localhost:3000` and that's good because that's where our server is running. Later on, we're also going to deploy the task manager API to Heroku and in that case we'll have a different URL.

We're also going to want to test those production end points from Postman and that would mean us manually swapping out every URL for each different requests. Let's use the **Postman environments**.

Let's also define our authentication Bearer token for all requests. Via `Edit` the collection, then `Authorization`. We should also go to the specific requests where we don't need the `Authorization`. For example in our case, **signup** and **login**. Then we should specify `No Auth` for them.

Now there's just one more thing we're going to do to **take this to the next level**. And this is going to require us to set up a little bit of JavaScript code to perform some automation. So what's the one manual part of this workflow. The manual part is either creating a user and logging in then getting that off token going back over to the menu to update the value and then being able to make their requests. We can have all of that done automatically for us by writing just three or four lines of JavaScript code.

So we have `Pre-request Script` where we can add some **JavaScript code to run before the request** is sent off. And we also have `Tests`. Now **this runs after the response is received** and in here we can write some JavaScript code to extract that token property on the body and set an environment variable whose value is equal to that token. From there we'll use the environment variable inside of the collection to get everything working as expected.

![postman](../img/s12/12-1-postman.png 'postman')
![postman](../img/s12/12-2-postman.png 'postman')

```js
// inside `Tests` in our Login user request
if (pm.response.code === 200) {
  pm.environment.set('authToken', pm.response.json().token);
}
```

The code above is checking we get `200` response status and then wet the token (`authToken`) which will be automatically available for us.

```js
// inside `Tests` in our Create user request
if (pm.response.code === 201) {
  pm.environment.set('authToken', pm.response.json().token);
}
```

---

Summary:

1. We started by creating Postman environments. An environment is nothing more than a name for our environment and a key value pair of values we can access when working in that environment. Now once we have our environments in place we can switch between them.
2. We saw the collections edit page where we set up authentication for every single request in the collection except for signing up or logging in.

### 10. Logging Out

Let's create the route and the logic for logout a user.

Remember if we have five different sessions where we are logged in such as for our personal computer or our phone and our work computer and we log out of one we don't want to log out of everything. So we want to target these specific token that was used when they authenticated right here.

```js
// src/routers/user.js
//...
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token; // don't forget to pass `req.token` from the middleware
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});
//...
```

Now what if you wanted to create a variation of this route that allows you to log out of all sessions so you can see services like Netflix and Gmail that allow you to do this.

### 11. Hiding Private Data

We're going to take a few moments to talk about how we can better secure the user profile data we're sending from these server. When we log in currently, what we receive is –

```json
{
  "user": {
    "age": 0,
    "_id": "5f927ea8ee1aa75bc32e4952",
    "name": "Maxime H.",
    "email": "max@hardy.com",
    "password": "$2a$08$wmTlJdpeHXhPjqfFpadueukvBxxltGcl98Ptg.i4ZLkY1aDzPJvCK", // WE DON'T WANT TO EXPOSE IT
    "__v": 10,
    "tokens": [
      {
        //... NO NEED TO EXPOSE ALL THE TOKENS
      }
    ]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjkyN2VhOGVlMWFhNzViYzMyZTQ5NTIiLCJpYXQiOjE2MDM2MTE2MjN9.vPKT18XRt328R0jpYqxh1sLVrb2GR4Ix7zYvTuKHpmc"
}
```

Let's make some changes to prevent the signup and login to expose everything...

```js
// src/routers/user.js
//...
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user: user.getPublicProfile(), token }); // we add `getPublicProfile` which will return only data we want to expose
  } catch (error) {
    res.status(400).send();
  }
});
//...
```

```js
// src/models/user.js
//...
userSchema.methods.getPublicProfile = function () {
  const user = this;
  const userObject = user.toObject(); // we can actually manipulate user object to change what we expose

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};
//...
```

Here is the result:

```json
{
  "user": {
    "age": 0,
    "_id": "5f927ea8ee1aa75bc32e4952",
    "name": "Maxime H.",
    "email": "max@hardy.com",
    "__v": 11
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjkyN2VhOGVlMWFhNzViYzMyZTQ5NTIiLCJpYXQiOjE2MDM2MTIyNTR9.ePTtHOssV1QHhD1Pk_7AtLsP8edRpevr6zcifqC3Uw4"
}
```

So now that we have this in place we have a **pretty manual way** to get the job done. And it's manual because we have to call our function `getPublicProfile` every single time we're sending the user back...

**There is a way to automate this**. That's not going to require us to make any changes to our route handlers. That's the second solution.

It is important to write `toJSON` exaclty like this (and we can remove the call to `getPublicProfile`) from the `routers`. It automatically works!

```js
// src/models/user.js
//...
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};
//...
```

How does it work?

```js
const pet = {
  name: 'Hal',
  age: 3,
  password: 'abc123',
};

pet.toJSON = function () {
  console.log(this); // { name: 'Hal', age: 3, password: 'abc123', toJSON: [Function] }
  delete this.password;
  return this;
};

console.log(JSON.stringify(pet)); // {"name":"Hal","age":3}
```

### 12. Authenticating User Endpoints

We've added a middleware `admin` which check if `isAdmin` is `true`.

```js
// src/middleware/admin.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    // 1 – we get the token in the header request
    const token = req.header('Authorization').replace('Bearer ', '');
    // 2 – we verify it and we decode it
    const decode = jwt.verify(token, 'OUR_SECRET');
    // 3 – we find the user based on the decoded _id and we check if the token exists inside of this user
    const admin = await User.findOne({ _id: decode._id, isAdmin: true, 'tokens.token': token });

    if (!admin) {
      throw new Error();
    }

    req.token = token;
    req.user = admin;
    next();
  } catch (error) {
    res.status(401).send({ error: 'No access' });
  }
};

module.exports = auth;
```

```js
//...
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  if (!userObject.isAdmin) {
    delete userObject.isAdmin; // we also don't want to return the value if `isAdmin` is `false` (security reasons)
  }
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};
//...
```

```js
// src/routers/user.js
const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/user');

/**
 * SIGNUP
 * NOT PROTECTED
 * CREATE A NEW USER (and generates a new token)
 */
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * LOGIN
 * NOT PROTECTED
 * LOG IN A USER (and generates a new token)
 */
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

/**
 * LOGOUT
 * AS TO BE AUTHENTICATED
 * LOG OUT A USER (by removing the right token)
 */
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * LOGOUT
 * AS TO BE AUTHENTICATED
 * LOG OUT A USER (by removing all the tokens)
 */
router.post('/users/logout_all', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * GET INFO USER
 * AS TO BE AUTHENTICATED
 * RETURN BASICS INFO ABOUT THE USER
 */
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

/**
 * GET ALL USERS INFO
 * AS TO BE ADMIN
 * RETURN ALL INFORMATION ABOUT ALL USERS
 */
router.get('/users', admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * GET INFO ABOUT A SPECIFIC USER
 * AS TO BE ADMIN
 * RETURN ALL INFORMATION ABOUT A SPECIFIC USER
 */
router.get('/users/:id', admin, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * UPDATE ITS OWN PROFILE
 * AS TO BE AUTHENTICATED
 * UPDATE SPECIFIC INFO ABOUT ITS OWN PROFILE
 */
router.patch('/users/me', auth, async (req, res) => {
  const { body } = req;

  const updates = Object.keys(body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    updates.forEach((update) => {
      req.user[update] = body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * UPDATE A SPECIFIC USER PROFILE
 * AS TO BE ADMIN
 * UPDATE SPECIFIC INFO ABOUT A SPECIFIC USER PROFILE
 */
router.patch('/users/:id', admin, async (req, res) => {
  const { body, params } = req;
  const _id = params.id;

  const updates = Object.keys(body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    // 1 – below is bypassing mongoose as a result, or middlewares...
    // const user = await User.findByIdAndUpdate(_id, body, { new: true, runValidators: true });

    // 2 – we need to use another way then
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    // 2.1 – then...
    updates.forEach((update) => {
      user[update] = body[update];
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * DELETE ITS OWN PROFILE
 * AS TO BE AUTHENTICATED
 * DELETE ITS OWN PROFILE (and automatically logout)
 */
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * DELETE A SPECIFIC USER PROFILE
 * AS TO BE ADMIN
 * DELETE A SPECIFIC USER PROFILE (and automatically logout it)
 */
router.delete('/users/:id', admin, async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
```

### 13. The User/Task Relationship

Now that the **user endpoints** are **sitting behind authentication** we're going to turn our attention towards our **tasks**. We haven't worked with tasks in a while and if we're going to set up authentication there's a few important things we need to do.

First up we need to figure out how to **create a relationship** between a **user** and the **tasks** that they've created. This is going to be important to make sure that users can only access and manage their tasks and that they can't mess with someone else's.

There are two ways to create the relationship between them. The user could store something like the `_id` of all of the tasks they've created OR the individual task could store the `_id` of the user who created it. The second approach is the better approach.

```js
// src/models/task.js
const mongoose = require('mongoose');

const taskSchema = {
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
```

In our `routers` task, we need to add our `auth` middleware and then add the information about the user.

```js
// src/routers/task.js
//...
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id, // we get it from our middleware
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});
//...
```

```json
{
  "completed": true,
  "_id": "5f954643ef13668529cdaff1",
  "description": "The PNG array is down, program the 1080p interface so we can bypass the AGP card!",
  "owner": "5f9543420e75268479a39dc7", // we got the owner
  "__v": 0
}
```

---

```js
const Task = require('./models/task');
const User = require('./models/user');

const main = async () => {
  const task = await Task.findById('5f954643ef13668529cdaff1');
  const user = await User.findById(task.owner);
  console.log('task: ', task);
  console.log('user: ', user); // ok but long and manual
};

main();
```

There's a way to actually set up the relationship between our two models and it's gonna provide us with some helper functions that will make this possible with very minimal code...

In the `task` model:

```js
//...
owner: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  ref: 'User' // Add the ref to the `User` model
},
//...
```

```js
const Task = require('./models/task');

const main = async () => {
  const task = await Task.findById('5f954643ef13668529cdaff1');
  await task.populate('owner').execPopulate();
  console.log('task: ', task);
};

main();
```

```js
// result
task:  {
  completed: true,
  _id: 5f954643ef13668529cdaff1,
  description: 'The PNG array is down, program the 1080p interface so we can bypass the AGP card!',
  owner: {
    isAdmin: false,
    age: 0,
    _id: 5f9543420e75268479a39dc7,
    name: 'Maxime Hardy',
    email: 'user@hardy.com',
    password: '$2a$08$8CWrvqA3hA1NSic/r5UfmudX3rn7E4cLQPJxeQ/Z5ZyvLSqbJEdbu',
    tokens: [ [Object], [Object], [Object], [Object] ],
    __v: 3
  },
  __v: 0
}
```

---

```js
// src/models/user.js
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});
```

```js
// src/index.js (as playground)
const Task = require('./models/task');
const User = require('./models/user');

const main = async () => {
  // ONE WAY – populate user info from the task id!
  const task = await Task.findById('5f954643ef13668529cdaff1'); // task id
  await task.populate('owner').execPopulate(); // populate
  console.log('owner: ', task.owner);

  // THE OTHER WAY – populate tasks info from a user id!
  const user = await User.findById('5f9543420e75268479a39dc7'); // user id
  await user.populate('tasks').execPopulate(); // populate (look at the code above)
  console.log('tasks: ', user.tasks);
};

main();
```

### 14. Authenticating Task Endpoints

### 15. Cascade Delete Tasks
