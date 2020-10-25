const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3005;

app.use(express.json());

// ROUTES
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log('Server is up on port ', port);
});

// const bcrypt = require('bcryptjs');

// const myFunction = async () => {
//   const password = 'Red1234!'; // plaintext password is what the user provides us
//   const hashedPassword = await bcrypt.hash(password, 8); // hashed password is what will actually end up storing
//   console.log('password: ', password);
//   console.log('hashedPassword: ', hashedPassword);

//   const isMatch = await bcrypt.compare('Red1234!', hashedPassword);
//   console.log('isMatch: ', isMatch);
// };

// myFunction();

// // ----------

// const jwt = require('jsonwebtoken');

// const myFunction = async () => {
//   const token = jwt.sign({ _id: 'abc123' }, 'SECRET_RANDOM_SERIES_OF_CHARS', {
//     expiresIn: '7 days',
//   });
//   console.log('token: ', token); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhYmMxMjMiLCJpYXQiOjE2MDM0Mzg1NTN9.DPtNkzYULXYpCm4zptpIK-U_vDtdRF8UizLFESsVJOY

//   const dataOk = jwt.verify(token, 'SECRET_RANDOM_SERIES_OF_CHARS');
//   console.log('dataOk: ', dataOk);
//   // OK – data:  { _id: 'abc123', iat: 1603439346 }

//   const dataNope = jwt.verify(token, 'NOPE_SECRET_RANDOM_SERIES_OF_CHARS');
//   console.log('dataNope: ', dataNope);
//   // Nope – JsonWebTokenError: invalid signature
// };

// myFunction();

// // ----------

// const pet = {
//   name: 'Hal',
//   age: 3,
//   password: 'abc123',
// };

// pet.toJSON = function () {
//   console.log(this); // { name: 'Hal', age: 3, password: 'abc123', toJSON: [Function] }
//   delete this.password;
//   return this;
// };

// console.log(JSON.stringify(pet)); // {"name":"Hal","age":3}

// // ----------

// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {
//   // ONE WAY – populate user info from the task id!
//   const task = await Task.findById('5f954643ef13668529cdaff1'); // task id
//   await task.populate('owner').execPopulate(); // populate
//   console.log('owner: ', task.owner);

//   // THE OTHER WAY – populate tasks info from a user id!
//   const user = await User.findById('5f9543420e75268479a39dc7'); // user id
//   await user.populate('tasks').execPopulate(); // populate (look at the code above)
//   console.log('tasks: ', user.tasks);
// };

// main();
