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
