# File System and Command Line Args (Notes App)

### 1. Introduction

We're going to build the **Notes App**. How to get input from user and even how to store it.

### 2. Getting Input from Users

We're going to handle getting input from the user via a **command line arguments**.

```sh
# We pass a first argument
node app.js Maxime
```

```js
console.log(process.argv);
```

```
[
  '/Users/maximehardy/.nvm/versions/node/v12.18.0/bin/node',
  '/Users/maximehardy/projects/the-complete-nodejs-course/04-File-System-and-Command-Line-Args/node-course/notes-app/app.js',
  'Maxime'
]
```

```js
console.log(process.argv[2]); // Maxime
```

---

```js
// node-course/notes-app/app.js
const command = process.argv[2];

if (command === 'add') {
  console.log('Adding note!');
} else if (command === 'remove') {
  console.log('Removing note!');
}
```

```sh
node app.js add
# Adding note!
node app.js remove
# Removing note!

# We can pass even more structured information
node app.js add --title="This is my title"
```

### 3. Argument Parsing with Yargs: Part I

`--title="This is my title"` is not parsed. Let's install `yargs` then.

```sh
npm i yargs
```

```js
// node-course/notes-app/app.js
const yargs = require('yargs');

console.log(process.argv);
console.log(yargs.argv);
```

```
# (1)
[
  '/Users/maximehardy/.nvm/versions/node/v12.18.0/bin/node',
  '/Users/maximehardy/projects/the-complete-nodejs-course/04-File-System-and-Command-Line-Args/node-course/notes-app/app.js',
  '--title=Things to buy'
]
# (2)
{ _: [], title: 'Things to buy', '$0': 'app.js' }
```

1. `process.argv` not parsed
2. `yargs.argv` perfectly parsed 👍

```js
// node-course/notes-app/app.js
const yargs = require('yargs');

// Customize yargs version
yargs.version('1.1.0');

// Create add command
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  handler: () => {
    console.log('Adding a new note!');
  },
});

// Create remove command
yargs.command({
  command: 'remove',
  describe: 'Remove a note',
  handler: () => {
    console.log('Removing a note!');
  },
});

// Create read command
yargs.command({
  command: 'read',
  describe: 'Read a note',
  handler: () => {
    console.log('Reading a note!');
  },
});

// Create list command
yargs.command({
  command: 'list',
  describe: 'List your notes',
  handler: () => {
    console.log('Listing out all notes!');
  },
});

console.log(yargs.argv);
```

```sh
node app.js --help
```

### 4. Argument Parsing with Yargs: Part II

```js
// node-course/notes-app/app.js
//...
// Create add command
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: {
      decribe: 'Note title',
      demandOption: true, // it means title is required
      type: 'string',
    },
  },
  handler: (argv) => {
    console.log('Adding a new note!', argv);
  },
});
//...
yargs.parse(); // WE NEED THIS LINE!
```

```sh
node app.js add --title="Shopping list"
# Adding a new note! { _: [ 'add' ], title: 'Shopping list', '$0': 'app.js' }
# { _: [ 'add' ], title: 'Shopping list', '$0': 'app.js' }
```

### 5. Storing Data with JSON

### 6. Adding a Note

### 7. Removing a Note

### 8. ES6 Aside: Arrow Functions

### 9. Refactoring to Use Arrow Functions

### 10. Listing Notes

### 11. Reading a Note
