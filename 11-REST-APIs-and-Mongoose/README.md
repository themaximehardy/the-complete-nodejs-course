# REST APIs and Mongoose (Task App)

### 1. Introduction

RESWe're going to create our very own **Express based REST API** using what we now know about data storage. We're also going to explore **Mongoose**! Mongoose is a really popular library when working with Nodejs and MongoDB. It gives us an easy system for modeling our data.

### 2. Setting up Mongoose

[Mongoose](https://mongoosejs.com/) is an **object data modeling** (**ODM**) library that provides a rigorous modeling environment for your data, enforcing structure as needed while still maintaining the flexibility that makes MongoDB powerful.

First of all, let's install `mongoose`:

```sh
yarn add mongoose
```

Then, let's create the file/folder structure that allows us to scale the application up! – `src/db/mongoose.js`.

```js
// src/db/mongoose.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const userSchema = {
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
};

const User = mongoose.model('User', userSchema);

const aUser = new User({
  name: 'Max',
  age: 29,
});

aUser
  .save()
  .then((result) => console.log('New user saved! – ', result))
  .catch((error) => {
    console.log('error: ', error);
  });
```

### 3. Creating a Mongoose Model

```js
// src/db/mongoose.js
//...
const taskSchema = {
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
  },
};

const Task = new mongoose.model('Task', taskSchema);

const task = new Task({
  description: 'Rerum reprehenderit sed sit quia a eius.',
  completed: false,
});

task
  .save()
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
//...
```

### 4. Data Validation and Sanatization: Part I

**Data validation** means we can enforce that the data conforms to some rules. As an example we could say that the _users age needs to be greater than or equal to 18_. Here is the [documentation](https://mongoosejs.com/docs/validation.html) about validation.

**Data sanitization** allows us to alter the data before saving it. An example of that would be _removing empty spaces around the user's name_.

Let's start by make some schema types `required`.

```js
// src/db/mongoose.js
//...
const userSchema = {
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
};
//...
```

Now, all **[SchemaTypes](https://mongoosejs.com/docs/schematypes.html)** have the built-in **required** validator. The required validator uses the SchemaType's `checkRequired()` function to determine if the value satisfies the required validator.
**Numbers** have `min` and `max` validators.
**Strings** have `enum`, `match`, `minlength`, and `maxlength` validators.

But as we can see, it is a bit limited. How to validate email, credit card, phone number... Mongoose wasn't supposed to have all of those built in but it does provide us with a way to setup custom validation which is going to allow us to validate literally anything we'd like.

```js
// src/db/mongoose.js
//...
const userSchema = {
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    },
  },
};
//...
```

**Andrew's recommendation for validation is [`validator.js`](https://www.npmjs.com/package/validator)!!**

```sh
yarn add validator
```

```js
// src/db/mongoose.js
const mongoose = require('mongoose');
const validator = require('validator'); // ADD

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const userSchema = {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      // ADD – using `validator.isEmail`
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    },
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    },
  },
};

const User = mongoose.model('User', userSchema);

const aUser = new User({
  name: 'Luc',
  email: 'luc@gmail.com',
  age: 18,
});

aUser
  .save()
  .then((result) => console.log('New user saved! – ', result))
  .catch((error) => {
    console.log('error: ', error);
  });
```

It's a good idea to look at the [SchemaTypes](https://mongoosejs.com/docs/schematypes.html) page. Here are all the types supported by Mongoose:

- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- ObjectId
- Array
- Decimal128
- Map
- Schema

And all the **Schema Types**:

- `required`: boolean or function, if true adds a required validator for this property
- `default`: Any or function, sets a default value for the path. If the value is a function, the return value of the function is used as the default.
- `select`: boolean, specifies default projections for queries
- `validate`: function, adds a validator function for this property
- `get`: function, defines a custom getter for this property using `Object.defineProperty()`.
- `set`: function, defines a custom setter for this property using `Object.defineProperty()`.
- `alias`: string, mongoose >= 4.10.0 only. Defines a virtual with the given name that gets/sets this path.
- `immutable`: boolean, defines path as immutable. Mongoose prevents you from changing immutable paths unless the parent document has `isNew: true`.
- `transform`: function, Mongoose calls this function when you call `Document#toJSON()` function, including when you `JSON.stringify()` a document.

```js
// src/db/mongoose.js
//...
const userSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    },
  },
};
//...
```

### 5. Data Validation and Sanatization: Part II

Challenge Time –

```js
// src/db/mongoose.js
//...
password: {
  type: String,
  required: true,
  minlength: 7,
  trim: true,
  validate(value) {
    if (/password/i.test(value)) {
      throw new Error('Email is invalid');
    }
  }
},
//...
```

```js
// src/db/mongoose.js
//...
const taskSchema = {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
};

const Task = new mongoose.model('Task', taskSchema);

const task = new Task({
  description: 'Vero consectetur eos.',
});

task
  .save()
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
```

### 6. Structuring a REST API

What is exactly a **REST API**, it stands for **Representational State Transfer**. And **API** stands for **Application Programming Interface** (REST API or RESTful API).

Let's have a look at the task resource.

| Action            | HTTP method             |
| ----------------- | ----------------------- |
| **Create**        | **POST** `/tasks`       |
| **Read** (all)    | **GET** `/tasks`        |
| **Read** (single) | **GET** `/tasks/:id`    |
| **Update**        | **PATCH** `/tasks/:id`  |
| **Delete**        | **DELETE** `/tasks/:id` |

It is good to know what is makes up an HTTP request. Below we have a example request and there are three main pieces.

1. The first line is known as the **request line**. This contains the HTTP method being used, the path and the HTTP protocol. In this case we know that the combination of **POST** with `/tasks` means that we're trying to create a new task resource.

Now after that request line we have as many request headers as we need. Here we have three `Accept`, `Connection` and `Authorization` headers. They are nothing more than key value pairs which allow us to attach meta information to their request.

So here we are using `Accept` to say that we're expecting JSON data back which is what we'll get. We're using connection to say that we're likely to make other requests shortly. So let's go ahead and keep this `Connection` open to keep things fast. And we're also setting `Authorization` to setup authentication.

After we're done with the headers we have an **empty line** followed by the **request body**. So when we post data to `/tasks` we have to provide that data and we provide it.

![rest-api](../img/s11/11-1-rest-api.png 'rest-api')

### 7. Installing Postman

Let's go to [Postman](https://www.postman.com/).

### 8. Resource Creation Endpoints: Part I

Let's first install `nodemon` and `Express`.

```sh
yarn add -D nodemon
yarn add express
```

```js
// src/models/user.js
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    validate(value) {
      if (/password/i.test(value)) {
        throw new Error('Email is invalid');
      }
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    },
  },
};

const User = mongoose.model('User', userSchema);

module.exports = User;
```

```js
// src/index.js
const express = require('express');
require('./db/mongoose');
const User = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

// enable the body parsing
app.use(express.json());

app.post('/users', (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((user) => res.send(user))
    .catch((error) => {
      res.status(400).send(error);
    });
});

app.listen(port, () => {
  console.log('Server is up on port ', port);
});
```

Note: it is a good idea to have a look at [httpstatuses.com](https://httpstatuses.com/) –

```md
**1×× Informational**
`100` Continue
`101` Switching Protocols
`102` Processing
**2×× Success**
`200` OK
`201` Created
`202` Accepted
`203` Non-authoritative Information
`204` No Content
`205` Reset Content
`206` Partial Content
`207` Multi-Status
`208` Already Reported
`226` IM Used
**3×× Redirection**
`300` Multiple Choices
`301` Moved Permanently
`302` Found
`303` See Other
`304` Not Modified
`305` Use Proxy
`307` Temporary Redirect
`308` Permanent Redirect
**4×× Client Error**
`400` Bad Request
`401` Unauthorized
`402` Payment Required
`403` Forbidden
`404` Not Found
`405` Method Not Allowed
`406` Not Acceptable
`407` Proxy Authentication Required
`408` Request Timeout
`409` Conflict
`410` Gone
`411` Length Required
`412` Precondition Failed
`413` Payload Too Large
`414` Request-URI Too Long
`415` Unsupported Media Type
`416` Requested Range Not Satisfiable
`417` Expectation Failed
`418` I'm a teapot
`421` Misdirected Request
`422` Unprocessable Entity
`423` Locked
`424` Failed Dependency
`426` Upgrade Required
`428` Precondition Required
`429` Too Many Requests
`431` Request Header Fields Too Large
`444` Connection Closed Without Response
`451` Unavailable For Legal Reasons
`499` Client Closed Request
**5×× Server Error**
`500` Internal Server Error
`501` Not Implemented
`502` Bad Gateway
`503` Service Unavailable
`504` Gateway Timeout
`505` HTTP Version Not Supported
`506` Variant Also Negotiates
`507` Insufficient Storage
`508` Loop Detected
`510` Not Extended
`511` Network Authentication Required
`599` Network Connect Timeout Error
```

### 9. Resource Creation Endpoints: Part II

```js
// src/index.js
const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

app.post('/tasks', (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then((task) => res.status(201).send(task))
    .catch((error) => {
      res.status(400).send(error);
    });
});

app.listen(port, () => {
  console.log('Server is up on port ', port);
});
```

### 10. Resource Reading Endpoints: Part I

### 11. Resource Reading Endpoints: Part II

### 12. Promise Chaining

### 13. Promise Chaining Challenge

### 14. Async/Await: Part I

### 15. Async/Await: Part II

### 16. Integrating Async/Await

### 17. Resource Updating Endpoints: Part I

### 18. Resource Updating Endpoints: Part II

### 19. Resource Deleting Endpoints

### 20. Separate Route Files
