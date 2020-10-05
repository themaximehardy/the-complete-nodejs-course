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
