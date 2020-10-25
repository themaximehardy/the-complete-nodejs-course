require('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findByIdAndDelete('5f7d69deb1139280099b45c5')
  .then((task) => {
    console.log(task);
    return Task.countDocuments({ completed: false });
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
