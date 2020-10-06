const doWorkPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    // reject('This went wrong!');
    resolve([1, 2, 3]);
  }, 2000);
});

doWorkPromise
  .then((result) => {
    console.log('Success! ', result);
  })
  .catch((error) => {
    console.log(error);
  });

//
//                               fulfilled
//                              /
// Promise   -- pending -->
//                              \
//                               rejected
//
