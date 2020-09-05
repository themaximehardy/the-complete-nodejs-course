// // (1)
// const square = function (x) {
//   return x * x;
// };

// // (2)
// const square = (x) => {
//   return x * x;
// };

// // (3)
// const square = (x) => x * x;

// console.log(square(3));

// -----

// const event = {
//   name: 'Birthday Party',
//   printGuestList: function () {
//     console.log('Guest list for ' + this.name);
//   },
// };

// event.printGuestList(); // Guest list for Birthday Party

// const event = {
//   name: 'Birthday Party',
//   printGuestList: () => {
//     console.log('Guest list for ' + this.name);
//   },
// };

// event.printGuestList(); // Guest list for undefined

// Because arrow functions they don't bind their own `this` value, which means that we don't have access to `this` as a reference to the object.
// So, arrow function are well suited for methods properties that are functions when we want to access this.
// It means in this case, it would be better to use a standard function.

const event = {
  name: 'Birthday Party',
  guestList: ['Max', 'Jane', 'Mike'],
  printGuestList() {
    console.log('Guest list for ' + this.name);

    this.guestList.forEach((guest) => {
      console.log(`${guest} is attending ${this.name}`);
    });
  },
};

event.printGuestList();
/*
Guest list for Birthday Party
Max is attending Birthday Party
Jane is attending Birthday Party
Mike is attending Birthday Party
*/
