const fs = require('fs');

const book = {
  title: 'Ego is the Enemy',
  author: 'Ryan Holiday',
};

const bookJSON = JSON.stringify(book); // -> string
console.log(bookJSON);
console.log(bookJSON.title); // undefined

const parsedData = JSON.parse(bookJSON); // -> JSON
console.log(parsedData.author); // Ryan Holiday

fs.writeFileSync('1-json.json', bookJSON); // write in the file

const dataBuffer = fs.readFileSync('1-json.json'); // read from the file

console.log(dataBuffer); // <Buffer 7b 22 74 69 74 6c 65 22 3a 22 45 67 6f 20 69 73 20 74 68 65 ...
console.log(dataBuffer.toString()); // {"title":"Ego is the Enemy","author":"Ryan Holiday"}

const dataJSON = dataBuffer.toString();
const data = JSON.parse(dataJSON);

console.log(data.title);

/**
 * START
 * *** CHALLENGE ***
 */

// const dataBuffer = fs.readFileSync('1-json.json');
// const dataJSON = dataBuffer.toString();
// const data = JSON.parse(dataJSON);

// data.name = 'Max';
// data.age = 29;

// fs.writeFileSync('1-json.json', JSON.stringify(data));

// END
