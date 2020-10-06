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

    // db.collection('users').findOne({ name: 'Thomas' }, (error, user) => {
    // db.collection('users').findOne(
    //   { _id: new ObjectID('5f7b80cdf4ba8f62a15e5be8') },
    //   (error, user) => {
    //     if (error) {
    //       console.log('error: ', error);
    //     }

    //     console.log(user);
    //   },
    // );

    // find doesn't have a callback but a cursor
    // db.collection('users')
    //   .find({ age: 27 })
    //   .toArray((error, users) => {
    //     if (error) {
    //       console.log('error: ', error);
    //     }

    //     console.log(users);
    //   });

    db.collection('tasks').findOne(
      { _id: new ObjectID('5f7c1a4586635868a02edb40') },
      (error, task) => {
        if (error) {
          console.log('error: ', error);
        }

        console.log(task);
      },
    );

    db.collection('tasks')
      .find({ completed: true })
      .toArray((error, tasks) => {
        if (error) {
          console.log('error: ', error);
        }

        console.log(tasks);
      });
  },
);
