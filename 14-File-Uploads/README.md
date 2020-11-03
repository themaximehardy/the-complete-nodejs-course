# File Uploads (Task App)

### 1. Introduction

We know how to send a basic JSON data from the client to the server and from the server to the client. The question is: **how do we do this with images**? We want to allow the client to upload an image to the server, we want to store that image in the database and we want the server to be able to serve it up so the client can access it later on.

### 2. Adding Support for File Uploads

How do we add support for file uploads to Express? Express by default actually doesn't support file uploads but there is an npm library also released and maintained by the same team that releases and maintains Express.

[Multer](https://www.npmjs.com/package/multer) is a **Nodejs middleware** for handling `multipart/form-data`, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.

_NOTE: Multer will not process any form which is not multipart (multipart/form-data)._

When it comes to file uploads we're no longer going to send a JSON body. Instead we'll be using form data. So Multer is what's going to allow us to upload files.

```sh
yarn add multer
```

We're going to add a few empty lines in the `index.js` and write a little example in isolation of how we could add file upload to Express. Sometimes we might want to accept just PDF files upload. Other times we just might want to accept images so we'll end up creating new instances of Multer depending on the needs of our application.

Let's create a new end point where the client will be able to upload these files. We're gonna use an HTTP post method which is required for uploading images.

```js
// src/index.js
//...
const multer = require('multer');

const uploadWithMulterMiddleware = multer({
  dest: 'images',
});

// upload_multer is just a name (we are going to use as a key)
app.post('/upload', uploadWithMulterMiddleware.single('upload_multer'), (req, res) => {
  res.send();
});
//...
```

When we send it off, the following is gonna happen. First stop it's going to match with the route we've created. We're using post and upload then mult there is going to look for the file called upload in the request. It's going to find it and it's gonna save it to the images directory which it's actually already created. Now that folder is empty but it won't be in just a moment. Now if the image gets uploaded correctly then it will continue on running our function and we'll get our 200 response back over and Postman.

![postman](../img/s14/s14-1-postman.png 'postman')

---

```js
// src/routers/user.js
const multer = require('multer');
//...
const upload = multer({
  dest: 'avatars',
});

router.post('/users/me/avatar', upload.single('avatar'), async (req, res) => {
  res.send();
});
//...
```

### 3. Validating File Uploads

We're going to learn how to add validation to the files that are being uploaded to our server. Especially the **file size** and the **file type**.

```js
// src/index.js
const multer = require('multer');

const uploadWithMulterMiddleware = multer({
  dest: 'images',
  limits: {
    fileSize: 1000000, // number in bytes – here 1MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.endsWith('.pdf')) {
      return cb(new Error('File must be a PDF'));
    }

    cb(undefined, true);

    // cb(new Error('File must be a PDF')); // send an error back
    // cb(undefined, true); // no error and accept the upload
    // cb(undefined, false); // no error but reject silently the upload
  },
});

app.post('/upload', uploadWithMulterMiddleware.single('upload_multer'), (req, res) => {
  res.send();
});
```

```js
// src/index.js
const multer = require('multer');

const uploadWithMulterMiddleware = multer({
  dest: 'images',
  limits: {
    fileSize: 1000000, // number in bytes – here 1MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/i)) {
      return cb(new Error('File must be a Word document'));
    }

    cb(undefined, true);

    // cb(new Error('File must be a PDF')); // send an error back
    // cb(undefined, true); // no error and accept the upload
    // cb(undefined, false); // no error but reject silently the upload
  },
});

app.post('/upload', uploadWithMulterMiddleware.single('upload_multer'), (req, res) => {
  res.send();
});
```

### 4. Validation Challenge

```js
// src/routers/user.js
const multer = require('multer');
//...
const upload = multer({
  dest: 'avatars',
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      return cb(new Error('File must be jpg, jpeg or png only'));
    }

    cb(undefined, true);
  },
});

router.post('/users/me/avatar', upload.single('avatar'), async (req, res) => {
  res.send();
});
//...
```

### 5. Handling Express Errors

We're going to learn how to customize the errors that get sent back when the file upload fails. Whether it's because the file is not of the right type or whether it's because it's too large and doesn't meet the file size limitation we've set. Either way we can go ahead and send back a JSON error message instead of trying to render this HTML document which is what we're seeing right now.

```js
// src/index.js
const errorMiddleware = (req, res, next) => {
  throw new Error('From my middleware');
};

app.post(
  '/upload',
  errorMiddleware,
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  },
);

// in Postman, we get:
// {
//     "error": "From my middleware"
// }
```

---

```js
// src/index.js
const multer = require('multer');

const uploadWithMulterMiddleware = multer({
  dest: 'images',
  limits: {
    fileSize: 1000000, // number in bytes – here 1MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/i)) {
      return cb(new Error('File must be a Word document'));
    }

    cb(undefined, true);

    // cb(new Error('File must be a PDF')); // send an error back
    // cb(undefined, true); // no error and accept the upload
    // cb(undefined, false); // no error but reject silently the upload
  },
});

app.post(
  '/upload',
  uploadWithMulterMiddleware.single('upload_multer'),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  },
);
```

```js
(error, req, res, next) => {
  //...
},
```

**WE MUST USE this call signature** this set of arguments that it expects that's what let's express know that this is the function set up to handle any uncut errors. In this case any errors that have occurred because melter through an error when it got a bad upload.

---

```js
// src/routers/user.js
const multer = require('multer');
//...

const upload = multer({
  dest: 'avatars',
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      return cb(new Error('File must be jpg, jpeg or png only'));
    }

    cb(undefined, true);
  },
});

router.post(
  '/users/me/avatar',
  upload.single('avatar'),
  async (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  },
);
//...
```

### 6. Adding Images to User Profile

Step one is to **set up authentication**. Adding authentication is gonna be just as simple as it's been for all of the other routes we've worked with. Now the only difference is that this route already has one piece of middleware in place that is multer... All we're going to do is add our authentication middleware before. So we want to make sure they're authenticated before we worry about accepting their upload because if they're not authenticated we would never accept the upload.

```js
//...
router.post(
  '/users/me/avatar', // path
  auth, // 1st middleware – auth
  upload.single('avatar'), // 2nd middleware – validate and accept the upload
  async (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    // we handle the error
    res.status(400).send({ error: error.message });
  },
);
//...
```

The next step is to figure out **where exactly we're going to store that image**. We're actually not going to store it on the file system for the project like we've been doing so far. The reason behind this is that almost all deployment platforms require us to take our code and push it up to the repository on their servers. We saw this with Heroku and the same would be true if we were using something like AWS.

So the **file system actually gets wiped every time we deploy** which means that we would lose data when we deployed we would lose those user images.So instead of storing them on the file system we're actually going to add a field onto the User model to store the image of binary data. That means we're going to make a very small change to the user model.

```js
// src/models/user.js
//...

const userSchema = new mongoose.Schema(
  {
    //...
    avatar: {
      type: Buffer, // ADD
    },
  },
  { timestamps: true },
);

//...

module.exports = User;
```

We can copy the binary data from Robo 3T and go to CodePen for example, then add an `img` as the following:

```html
<img src="data:image/jpg;base64,BINARY_DATA_PASTED" />
```

---

```js
// src/routers/user.js
router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});
```

### 7. Serving up Files

### 8. Auto-Cropping and Image Formatting
