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

### 7. The ObjectID

### 8. Querying Documents

### 9. Promises

### 10. Updating Documents

### 11. Deleting Documents
