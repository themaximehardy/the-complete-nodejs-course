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

    // db.collection('users')
    //   .updateOne(
    //     {
    //       _id: new ObjectID('5f7c1874395b7167faa56f6b'),
    //     },
    //     {
    //       // $set: {
    //       //   name: 'Mike',
    //       // },
    //       $inc: {
    //         age: 1, // -1
    //       },
    //     },
    //   )
    //   .then((result) => {
    //     console.log('result.modifiedCount: ', result.modifiedCount);
    //   })
    //   .catch((error) => {
    //     console.log('error: ', error);
    //   });

    db.collection('tasks')
      .updateMany({ completed: false }, { $set: { completed: false } })
      .then((result) => {
        console.log('result.modifiedCount: ', result.modifiedCount);
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  },
);
