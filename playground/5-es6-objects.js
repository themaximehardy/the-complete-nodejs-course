// Object property shorthand

const name = 'Max';
const userAge = 29;

const user = {
  name, // shorthand syntax
  age: userAge,
  location: 'Brussels',
};

console.log(user);

// Object destructuring

const product = {
  label: 'Red notebook',
  price: 3,
  stock: 201,
  salePrice: undefined,
};

// const label = product.label;
// const stock = product.stock;

const { label: newNameLabel, stock, rating = 5 } = product;
console.log(newNameLabel);
console.log(stock);
console.log(rating); // default is used 5, otherwise, undefined

// Object destructuring (as param)

const transaction = (type, { label, stock }) => {
  console.log(type, label, stock);
};

transaction('order', product);
