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
