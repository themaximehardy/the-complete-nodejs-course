setTimeout(() => {
  console.log('2 sec are up!');
}, 2000);

const names = ['Andrew', 'Max', 'Emilie'];
const shortNames = names.filter((name) => {
  return name.length <= 4;
});

// ---

const geocode = (address, callback) => {
  setTimeout(() => {
    const data = {
      latitude: 0,
      longitude: 0,
    };

    callback(data);
  }, 2000);
};

geocode('Philadelphia', (data) => {
  console.log(data);
});

// ---

const add = (a, b, cb) => {
  setTimeout(() => {
    cb(a + b);
  }, 2000);
};

add(1, 4, (sum) => {
  console.log(sum); // Should print: 5
});

// ---

const doWorkCallback = (callback) => {
  setTimeout(() => {
    // callback('This, is my error', undefined);
    callback(undefined, [1, 2, 3]);
  }, 2000);
};

doWorkCallback((error, result) => {
  if (error) {
    console.log(error);
    return;
  }

  console.log(result);
});
