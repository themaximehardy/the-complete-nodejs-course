require('../src/db/mongoose');
const User = require('../src/models/user');

User.findByIdAndUpdate('5f7d6c42fb099c80bf80e081', { age: 1 })
  .then((user) => {
    console.log(user);
    return User.countDocuments({ age: 1 });
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
