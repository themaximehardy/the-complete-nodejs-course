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

### 7. Express Middleware

### 8. Accepting Authentication Tokens

### 9. Advanced Postman

### 10. Logging Out

### 11. Hiding Private Data

### 12. Authenticating User Endpoints

### 13. The User/Task Relationship

### 14. Authenticating Task Endpoints

### 15. Cascade Delete Tasks
