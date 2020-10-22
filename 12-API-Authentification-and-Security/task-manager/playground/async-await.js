require('../src/db/mongoose');
const User = require('../src/models/user');

// User.findByIdAndUpdate('5f7d6c42fb099c80bf80e081', { age: 1 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  console.log('user: ', user);
  const count = await User.countDocuments({ age });
  console.log('(1) count: ', count);
  return count;
};

updateAgeAndCount('5f7d6c42fb099c80bf80e081', 2)
  .then((count) => {
    console.log('(2) count: ', count);
  })
  .catch((error) => {
    console.log('error: ', error);
  });
