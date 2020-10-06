# MongoDB and Promises (Task App)

### 1. Introduction

We're going to learn how to connect our Nodejs application to a **database** and store user data. We're gonna start by setting up the database server on our machine. Then, figure out how we can connect our database to our Nodejs app. And from there we'll move on to explore how we can perform those four basic **CRUD operations**.

### 2. MongoDB and NoSQL Databases

Let's go to [mongodb.com](https://www.mongodb.com/). It is an **open source** database and it's also available for all operating systems.

MongoDB is a NoSQL database >< SQL (Structured Query Language).

![sql-nosql](../img/s10/10-1-sql-nosql.png 'sql-nosql')

### 3. Installing MongoDB on macOS and Linux

Let's download MongoDB from [MongoDB Download Center](https://www.mongodb.com/try/download/community?tck=docs_server). We have to download the MongoDB Community `tgz`. Then, we need to (rename (not compulsory) and) move the folder to the `Users/`. We also create a folder for the data `mongodb-data`.

```sh
cd ~
pwd
# /Users/maximehardy
# launch mongod and define a path for the data
/Users/maximehardy/mongodb/bin/mongod --dbpath=/Users/maximehardy/mongodb-data
```

### 4. Installing Database GUI Viewer

Let's install **Robo 3T** from [here](https://robomongo.org/). Connect to the localhost MongoDB database and open the shell (> `Open Shell`).

```js
db.version();
// 4.4.1
```

### 5. Connecting and Inserting Documents

We're going to **connect to our MongoDB database from a Nodejs application** and we're going to learn how to **insert new documents** into the database. We'll be using the **MongoDB [native driver](https://docs.mongodb.com/drivers/node/)**. This is nothing more than an **npm module** we're going to install and it's going to allow us to interact with our database from Nodejs before we actually install anything.

Let's create a new project folder `task-manager`. Then go into it `cd task-manager`.

```sh
npm init -y
npm i mongodb
```

```js
// task-manager/mongodb.js
// CRUD create, read, update, delete
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017'; // `localhost` could cause some issues, better to use `127.0.0.1`
const databaseName = 'task-manager';

MongoClient.connect(
  connectionURL,
  {
    useNewUrlParser: true,
  },
  (error, client) => {
    // callback called when we connect (async)
    if (error) {
      console.log('error: ', error);
      return;
    }

    console.log('Connection with MongoDB successful');

    const db = client.db(databaseName);
    db.collection('users').insertOne({
      name: 'Max',
      age: 29,
    });
  },
);
```

_Note: MongoDB does not need to create the database using MongoDB or Robo 3T... simply by picking a name and accessing it, MongoDB will automatically create it for us._

![robo-3t](../img/s10/10-2-robo-3t.png 'robo-3t')

### 6. Inserting Documents

[`insertOne`](https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertOne) is async.

```js
// task-manager/mongodb.js
//...
const db = client.db(databaseName);
db.collection('users').insertOne(
  {
    name: 'Max',
    age: 29,
  },
  // callback
  (error, result) => {
    if (error) {
      console.log('error: ', error);
      return;
    }

    console.log('result: ', result);
    console.log('result.ops: ', result.ops); // ops: [ { name: 'Max', age: 29, _id: 5f7c14fa84ae9866c39feb68 } ]
  },
);
//...
```

We used the callback (here is the [documentation](https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#~insertOneWriteOpCallback)).

```js
// Log from `console.log('result: ', result);`
CommandResult {
  result: { n: 1, ok: 1 },
  connection: Connection {
    _events: [Object: null prototype] {
      error: [Function],
      close: [Function],
      timeout: [Function],
      parseError: [Function],
      message: [Function]
    },
    _eventsCount: 5,
    _maxListeners: undefined,
    id: 0,
    options: {
      host: '127.0.0.1',
      port: 27017,
      size: 5,
      minSize: 0,
      connectionTimeout: 10000,
      socketTimeout: 360000,
      keepAlive: true,
      keepAliveInitialDelay: 120000,
      noDelay: true,
      ssl: false,
      checkServerIdentity: true,
      ca: null,
      crl: null,
      cert: null,
      key: null,
      passphrase: null,
      rejectUnauthorized: true,
      promoteLongs: true,
      promoteValues: true,
      promoteBuffers: false,
      reconnect: true,
      reconnectInterval: 1000,
      reconnectTries: 30,
      domainsEnabled: false,
      legacyCompatMode: true,
      metadata: [Object],
      disconnectHandler: [Store],
      cursorFactory: [Function: Cursor],
      emitError: true,
      monitorCommands: false,
      promiseLibrary: [Function: Promise],
      servers: [Array],
      caseTranslate: true,
      useNewUrlParser: true,
      directConnection: true,
      sslValidate: true,
      dbName: 'test',
      socketTimeoutMS: 360000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      useRecoveryToken: true,
      readPreference: [ReadPreference],
      bson: BSON {}
    },
    logger: Logger { className: 'Connection' },
    bson: BSON {},
    tag: undefined,
    maxBsonMessageSize: 67108864,
    port: 27017,
    host: '127.0.0.1',
    socketTimeout: 360000,
    keepAlive: true,
    keepAliveInitialDelay: 120000,
    connectionTimeout: 10000,
    responseOptions: { promoteLongs: true, promoteValues: true, promoteBuffers: false },
    flushing: false,
    queue: [],
    writeStream: null,
    destroyed: false,
    timedOut: false,
    hashedName: '1af0a80ead1d9e3c1a02ad090ffe77ff1334aae9',
    workItems: [],
    socket: Socket {
      connecting: false,
      _hadError: false,
      _parent: null,
      _host: null,
      _readableState: [ReadableState],
      readable: true,
      _events: [Object: null prototype],
      _eventsCount: 5,
      _maxListeners: undefined,
      _writableState: [WritableState],
      writable: true,
      allowHalfOpen: false,
      _sockname: null,
      _pendingData: null,
      _pendingEncoding: '',
      server: null,
      _server: null,
      timeout: 360000,
      [Symbol(asyncId)]: 4,
      [Symbol(kHandle)]: [TCP],
      [Symbol(kSetNoDelay)]: true,
      [Symbol(lastWriteQueueSize)]: 0,
      [Symbol(timeout)]: Timeout {
        _idleTimeout: 360000,
        _idlePrev: [TimersList],
        _idleNext: [TimersList],
        _idleStart: 434,
        _onTimeout: [Function: bound ],
        _timerArgs: undefined,
        _repeat: null,
        _destroyed: false,
        [Symbol(refed)]: false,
        [Symbol(asyncId)]: 15,
        [Symbol(triggerId)]: 4
      },
      [Symbol(kBuffer)]: null,
      [Symbol(kBufferCb)]: null,
      [Symbol(kBufferGen)]: null,
      [Symbol(kCapture)]: false,
      [Symbol(kBytesRead)]: 0,
      [Symbol(kBytesWritten)]: 0
    },
    buffer: null,
    sizeOfMessage: 0,
    bytesRead: 0,
    stubBuffer: null,
    ismaster: {
      ismaster: true,
      topologyVersion: [Object],
      maxBsonObjectSize: 16777216,
      maxMessageSizeBytes: 48000000,
      maxWriteBatchSize: 100000,
      localTime: 2020-10-06T06:55:54.437Z,
      logicalSessionTimeoutMinutes: 30,
      connectionId: 11,
      minWireVersion: 0,
      maxWireVersion: 9,
      readOnly: false,
      ok: 1
    },
    lastIsMasterMS: 4,
    [Symbol(kCapture)]: false
  },
  message: BinMsg {
    parsed: true,
    //...
    bson: BSON {},
    opts: { promoteLongs: true, promoteValues: true, promoteBuffers: false },
    length: 45,
    requestId: 2271,
    responseTo: 1,
    opCode: 2013,
    fromCompressed: undefined,
    responseFlags: 0,
    checksumPresent: false,
    moreToCome: false,
    exhaustAllowed: false,
    promoteLongs: true,
    promoteValues: true,
    promoteBuffers: false,
    documents: [ [Object] ],
    index: 29,
    hashedName: '1af0a80ead1d9e3c1a02ad090ffe77ff1334aae9'
  },
  ops: [ { name: 'Max', age: 29, _id: 5f7c14fa84ae9866c39feb68 } ],
  insertedCount: 1,
  insertedId: 5f7c14fa84ae9866c39feb68
}
```

Let's use [insertMany](https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertMany).

```js
// task-manager/mongodb.js
//...
db.collection('users').insertMany(
  [
    {
      name: 'Morgane',
      age: 28,
    },
    {
      name: 'Thomas',
      age: 30,
    },
  ],
  (error, result) => {
    if (error) {
      console.log('error: ', error);
      return;
    }

    console.log('result.ops: ', result.ops);
  },
);
//...
```

Challenge Time –

```js
// My solution
//...
const newTasks = [
  {
    description: 'Velit explicabo aperiam.',
    completed: true,
  },
  {
    description: 'Deserunt voluptatem quibusdam eaque.',
    completed: true,
  },
  {
    description:
      'Consequatur facilis adipisci earum ut tenetur accusamus voluptatum deleniti eveniet.',
    completed: false,
  },
];

db.collection('tasks').insertMany(newTasks, (error, result) => {
  if (error) {
    console.log('error: ', error);
    return;
  }

  console.log('result.ops: ', result.ops);
});
//...
```

### 7. The ObjectID

Let's talk about the autogenerated `_id` by MongoDB. It's different than SQL database which generates id (which follows that autoincrementing integer pattern). MongoDB `_id` are `GUID` (stands for **globally unique identifier**).

They're designed to be unique using an algorithm without needing the server to determine what the next id value should be. It is switching from autoincrementing integers over to GUID allowed MongoDB to achieve one of its main goals which is the **ability to scale well in a distributed system**.

So we have multiple database servers running instead of just one allowing us to handle heavy traffic where we have a lot of queries coming in with MongoDB. There's no chance of an id collision across those database servers.

But with an auto incrementing integer, it's possible that we could have a user with an id of one in one database server and a user with an id of one in another database server and we could eventually run into an issue where those ids conflict. With MongoDB we don't run into that problem.

Let's generate one –

```js
// task-manager/mongodb.js
const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017'; // `localhost` could cause some issues, better to use `127.0.0.1`
const databaseName = 'task-manager';

const id = new ObjectID(); // create a new one
console.log(id); // 5f7c1e50ff0c9e69af8c6ae1
console.log(id.getTimestamp()); // 2020-10-06T07:39:47.000Z
```

Check the [`ObjectId` documentation](https://docs.mongodb.com/manual/reference/method/ObjectId/).

`ObjectId(<hexadecimal>)`
Returns a new `ObjectId` value. The **12-byte** ObjectId value consists of:

- a 4-byte timestamp value, representing the ObjectId’s creation, measured in seconds since the Unix epoch
- a 5-byte random value
- a 3-byte incrementing counter, initialized to a random value

### 8. Querying Documents

We're going to look at [`find`](https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#find) and [`findOne`](https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#findOne).

```js
// task-manager/mongodb.js
const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017'; // `localhost` could cause some issues, better to use `127.0.0.1`
const databaseName = 'task-manager';

MongoClient.connect(
  connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error, client) => {
    if (error) {
      console.log('error: ', error);
      return;
    }

    console.log('Connection with MongoDB successful');

    const db = client.db(databaseName);

    db.collection('users').findOne({ name: 'Thomas' }, (error, user) => {
      if (error) {
        console.log('error: ', error);
      }

      console.log(user); // { _id: 5f7c1874395b7167faa56f6b, name: 'Thomas', age: 30 }
    });
  },
);
```

```js
// task-manager/mongodb.js
//...
db.collection('users').findOne({ _id: new ObjectID('5f7b80cdf4ba8f62a15e5be8') }, (error, user) => {
  if (error) {
    console.log('error: ', error);
  }

  console.log(user); // { _id: 5f7b80cdf4ba8f62a15e5be8, name: 'Max', age: 29 }
});
//...
```

`find` is more special...

```js
// task-manager/mongodb.js
//...
// find doesn't have a callback but a cursor, let's use `toArray` to give us a callback
db.collection('users')
  .find({ age: 27 })
  .toArray((error, users) => {
    if (error) {
      console.log('error: ', error);
    }

    console.log(users);
  });

db.collection('users')
  .find({ age: 27 })
  .count((error, count) => {
    if (error) {
      console.log('error: ', error);
    }

    console.log(count);
  });
//...
```

Challenge Time –

```js
// My solution
//...
db.collection('tasks').findOne({ _id: new ObjectID('5f7c1a4586635868a02edb40') }, (error, task) => {
  if (error) {
    console.log('error: ', error);
  }

  console.log(task);
});

/*
{
  _id: 5f7c1a4586635868a02edb40,
  description: 'Consequatur facilis adipisci earum ut tenetur accusamus voluptatum deleniti eveniet.',
  completed: false
}
*/

db.collection('tasks')
  .find({ completed: true })
  .toArray((error, tasks) => {
    if (error) {
      console.log('error: ', error);
    }

    console.log(tasks);
  });

/*
[
  {
    _id: 5f7c1a4586635868a02edb3e,
    description: 'Velit explicabo aperiam.',
    completed: true
  },
  {
    _id: 5f7c1a4586635868a02edb3f,
    description: 'Deserunt voluptatem quibusdam eaque.',
    completed: true
  }
]
*/
//...
```

### 9. Promises

**Promises build on the callback pattern** so it's necessary to understand how callbacks work and how we can use them before we'll be able to understand promises. Promises are **nothing more than an enhancement for callbacks** making it a bit **easier to manage our asynchronous code**.

```js
// CALLBACK
const doWorkCallback = (callback) => {
  setTimeout(() => {
    // callback('This, is my error', undefined);
    callback(undefined, [1, 2, 3]);
  }, 2000);
};

doWorkCallback((error, result) => {
  if (error) {
    console.log(error);
    return;
  }

  console.log(result);
});
```

```js
// PROMISES
const doWorkPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    // reject('This went wrong!');
    resolve([1, 2, 3]);
  }, 2000);
});

doWorkPromise
  .then((result) => {
    console.log('Success! ', result);
  })
  .catch((error) => {
    console.log(error);
  });
```

```js
//
//                               fulfilled
//                              /
// Promise   -- pending -->
//                              \
//                               rejected
//
```

When we first create the promise, the promise is known as `pending`. So our promise is pending for the two seconds (in the example above) before `resolve` or `reject` is called. A promise is pending until either resolve or reject is executed.

### 10. Updating Documents

Let's concentrate on [updateOne](https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#updateOne) and [updateMany](https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#updateMany).

```js
// task-manager/mongodb.js
const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017'; // `localhost` could cause some issues, better to use `127.0.0.1`
const databaseName = 'task-manager';

MongoClient.connect(
  connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error, client) => {
    if (error) {
      console.log('error: ', error);
      return;
    }

    console.log('Connection with MongoDB successful');

    const db = client.db(databaseName);

    const updatePromise = db.collection('users').updateOne(
      {
        _id: new ObjectID('5f7c1874395b7167faa56f6b'),
      },
      {
        $set: {
          name: 'Mike',
        },
      },
    );

    updatePromise
      .then((result) => {
        console.log('result.modifiedCount: ', result.modifiedCount);
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  },
);
```

Or we can simplify it by –

```js
//...
db.collection('users')
  .updateOne(
    {
      _id: new ObjectID('5f7c1874395b7167faa56f6b'),
    },
    {
      $set: {
        name: 'Mike',
      },
    },
  )
  .then((result) => {
    console.log('result.modifiedCount: ', result.modifiedCount);
  })
  .catch((error) => {
    console.log('error: ', error);
  });
//...
```

More information about the [MongoDB update operators](https://docs.mongodb.com/manual/reference/operator/update/). For example using `$inc` –

```js
//...
db.collection('users')
  .updateOne(
    {
      _id: new ObjectID('5f7c1874395b7167faa56f6b'),
    },
    {
      $inc: {
        age: 1, // or decrement with `-1`
      },
    },
  )
  .then((result) => {
    console.log('result.modifiedCount: ', result.modifiedCount);
  })
  .catch((error) => {
    console.log('error: ', error);
  });
//...
```

Challenge Time –

```js
// My solution
//...
db.collection('tasks')
  .updateMany({ completed: false }, { $set: { completed: false } })
  .then((result) => {
    console.log('result.modifiedCount: ', result.modifiedCount);
  })
  .catch((error) => {
    console.log('error: ', error);
  });
//...
```

### 11. Deleting Documents

Let's concentrate on [deleteOne](https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#deleteOne) and [deleteMany](https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#deleteMany). It is very similar to the update below.

```js
const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017'; // `localhost` could cause some issues, better to use `127.0.0.1`
const databaseName = 'task-manager';

MongoClient.connect(
  connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error, client) => {
    if (error) {
      console.log('error: ', error);
      return;
    }

    console.log('Connection with MongoDB successful');

    const db = client.db(databaseName);

    db.collection('users')
      .deleteMany({ age: 31 })
      .then((result) => {
        console.log('result.deletedCount: ', result.deletedCount);
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  },
);
```
