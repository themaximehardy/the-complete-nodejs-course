const greeter = (name) => {
  console.log(`Hello ${name}`);
};

greeter('Max'); // Hello Max
greeter(); // Hello undefined

const greeterImproved = (name = 'User', age) => {
  console.log(`Hello ${name}`);
};

greeterImproved(); // Hello user

// ---

// Object destructuring (and default params)

const product = {
  label: 'Red notebook',
  price: 3,
  stock: 201,
  salePrice: undefined,
};

// const transaction = (type, { label, stock }) => {
//   console.log(type, label, stock);
// };

// transaction('order'); // TypeError: Cannot destructure property 'label' of 'undefined' as it is undefined.

const transactionImproved = (type, { label, stock = 0 } = {}) => {
  console.log(type, label, stock);
};

transactionImproved('order'); // order undefined 0
