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
