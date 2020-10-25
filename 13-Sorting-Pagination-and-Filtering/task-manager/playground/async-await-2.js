require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndDelete('5f7d69deb1139280099b45c5')
//   .then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  console.log('task: ', task);
  const count = await Task.countDocuments({ completed: false });
  console.log('count: ', count);
  return count;
};

deleteTaskAndCount('5f7d69deb1139280099b45c5')
  .then((count) => {
    console.log('(2) count: ', count);
  })
  .catch((error) => {
    console.log('error: ', error);
  });
