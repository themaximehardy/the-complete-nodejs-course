# Sorting, Pagination, and Filtering (Task App)

### 1. Introduction

Right now, whenever the client requests a list of data from the server like a list of tasks for a user, the client has **very little control over what data comes back**. If the client does request the list of tasks for a specific user they get back every single task for that user in the order in which it was originally created. And that's not ideal.

As users add more tasks to the database all of those tasks are constantly going to get transferred back and forth **which is going to slow down our app significantly**. It would be much better to give the client a little bit of control choosing what exactly it wants back.

This is going to allow us to add some awesome features to the application where a client can provide a search term and it just gets back tasks that have that search text in the task description.

### 2. Working with Timestamps

Let's add timestamps to our data: `createdAt` and `updatedAt`.

```js
// src/models/user.js
//...
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    //...
  },
  { timestamps: true }, // the second arg to the new mongoose.Schema
);
//...
```

Now we create a new user –

```json
{
  "user": {
    "age": 0,
    "_id": "5f967c07c211b791d63fab75",
    "name": "John Smith",
    "email": "john@smith.com",
    "createdAt": "2020-10-26T07:34:31.474Z",
    "updatedAt": "2020-10-26T07:34:31.474Z",
    "__v": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Zjk2N2MwN2MyMTFiNzkxZDYzZmFiNzUiLCJpYXQiOjE2MDM2OTc2NzF9.T11akdzJDspLJoVEvqnOYq8yHQoguqlqUMVroJUqRA4"
}
```

---

```js
// src/models/task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
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
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
```

### 3. Filtering Data

Let's focus on the task router when we get the tasks. Eventually we're gonna have so many tasks in the database and using this request to fetch all of them is going to do two things. One it's going to be slow because it has to fetch so many old and unnecessary documents and two it's gonna be fetching things that the user interface isn't going to actually use if we're just trying to render the three tasks that I have not completed.

So what we're going to do is set up helpful options allowing the consumer of the API to better target the data they want to get and we're going to do this using the query string as part of the URL structure.

```js
// src/routers/task.js
//...
/**
 * GET ALL TASKS (for the current user)
 * AS TO BE AUTHENTICATED
 * RETURN ALL TASKS (created by the current user)
 */
router.get('/tasks', auth, async (req, res) => {
  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  try {
    // 1st method
    // const tasks = await Task.find({ owner: req.user._id });
    // res.send(tasks);
    // 2nd method
    // await req.user.populate('tasks').execPopulate();
    await req.user
      .populate({
        path: 'tasks',
        match,
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});
//...
```

### 4. Paginating Data

Here, we're going to enable pagination.

```js
// GET /tasks?limit=10&skip=0 (first set of 10)
// GET /tasks?limit=10&skip=10 (second set of 10)
```

```js
//...
await req.user
  .populate({
    path: 'tasks',
    match,
    options: {
      // limit: 2, // limit to only two results
      limit: parseInt(req.query.limit), // limit to the query limit number passed
    },
  })
  .execPopulate();
res.send(req.user.tasks);
//...
```

```js
// src/routers/task.js
//...
/**
 * GET ALL TASKS (for the current user)
 * AS TO BE AUTHENTICATED
 * RETURN ALL TASKS (created by the current user)
 */
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0 (first set of 10)
// GET /tasks?limit=10&skip=10 (second set of 10)
router.get('/tasks', auth, async (req, res) => {
  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  try {
    await req.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});
//...
```

### 5. Sorting Data

```js
// GET /tasks?sortBy=createdAt:asc (createdAt:desc)
```

```js
//...
await req.user
  .populate({
    path: 'tasks',
    match,
    options: {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
      sort: {
        createdAt: -1, // last created first
        // completed: -1 // completed true first
      },
    },
  })
  .execPopulate();
res.send(req.user.tasks);
//...
```

```js
// src/routers/task.js
//...
/**
 * GET ALL TASKS (for the current user)
 * AS TO BE AUTHENTICATED
 * RETURN ALL TASKS (created by the current user)
 */
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0 (first set of 10)
// GET /tasks?limit=10&skip=10 (second set of 10)
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');

    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});
//...
```
