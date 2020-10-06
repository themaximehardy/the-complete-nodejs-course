// CRUD create, read, update, delete

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017'; // `localhost` could cause some issues, better to use `127.0.0.1`
const databaseName = 'task-manager';

// const id = new ObjectID();
// console.log(id);
// console.log(id.getTimestamp());

MongoClient.connect(
  connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error, client) => {
    // callback called when we connect (async)
    if (error) {
      console.log('error: ', error);
      return;
    }

    console.log('Connection with MongoDB successful');

    const db = client.db(databaseName);
    // PART 1
    // db.collection('users').insertOne(
    //   {
    //     // _id: id,
    //     name: 'Vikram',
    //     age: 25,
    //   },
    //   (error, result) => {
    //     if (error) {
    //       console.log('error: ', error);
    //       return;
    //     }

    //     console.log('result.ops: ', result.ops); // ops: [ { name: 'Max', age: 29, _id: 5f7c14fa84ae9866c39feb68 } ]
    //   },
    // );

    // PART 2
    // db.collection('users').insertMany(
    //   [
    //     {
    //       name: 'Morgane',
    //       age: 28,
    //     },
    //     {
    //       name: 'Thomas',
    //       age: 30,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       console.log('error: ', error);
    //       return;
    //     }

    //     console.log('result.ops: ', result.ops);
    //   },
    // );

    // PART 3
    //   const newTasks = [
    //     {
    //       description: 'Velit explicabo aperiam.',
    //       completed: true,
    //     },
    //     {
    //       description: 'Deserunt voluptatem quibusdam eaque.',
    //       completed: true,
    //     },
    //     {
    //       description:
    //         'Consequatur facilis adipisci earum ut tenetur accusamus voluptatum deleniti eveniet.',
    //       completed: false,
    //     },
    //   ];

    //   db.collection('tasks').insertMany(newTasks, (error, result) => {
    //     if (error) {
    //       console.log('error: ', error);
    //       return;
    //     }

    //     console.log('result.ops: ', result.ops);
    //   });
  },
);
