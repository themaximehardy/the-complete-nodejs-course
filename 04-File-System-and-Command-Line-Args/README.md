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

How to store the data? In **JSON**...

```js
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
```

### 6. Adding a Note

```js
// node-course/notes-app/notes.js
const fs = require('fs');

const FILE_NAME = 'notes.json';

const addNote = (title, body) => {
  const notes = loadNotes();
  const duplicateNote = notes.find((note) => note.title === title);

  if (!duplicateNote) {
    notes.push({
      title,
      body,
    });
    saveNotes(notes);
    console.log('New note added!');
  } else {
    console.log('Note title taken!');
  }
};

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync(FILE_NAME, dataJSON);
};

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync(FILE_NAME);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

module.exports = {
  addNote,
};
```

```js
// node-course/notes-app/app.js
const yargs = require('yargs');
const notes = require('./notes.js');
//...
// Create add command
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true, // it means title is required
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
  },
  handler: (argv) => {
    notes.addNote(argv.title, argv.body);
  },
});
//...
yargs.parse();
```

### 7. Removing a Note

```js
// node-course/notes-app/notes.js
const fs = require('fs');
const chalk = require('chalk');
const log = console.log;

const FILE_NAME = 'notes.json';

//...

const removeNote = (title) => {
  const notes = loadNotes();
  const notesToKeep = notes.filter((note) => note.title !== title);

  if (notes.length !== notesToKeep.length) {
    log(chalk.green.inverse('Note removed!'));
    saveNotes(notesToKeep);
  } else {
    log(chalk.red.inverse('No note found!'));
  }
};

//...

module.exports = {
  //...
  removeNote,
};
```

```js
// node-course/notes-app/app.js
const yargs = require('yargs');
const notes = require('./notes.js');
//...
// Create add command
yargs.command({
  command: 'remove',
  describe: 'Remove a note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler: (argv) => {
    notes.removeNote(argv.title);
  },
});
//...
yargs.parse();
```

### 8. ES6 Aside: Arrow Functions

```js
// (1)
const square = function (x) {
  return x * x;
};

// (2)
const square = (x) => {
  return x * x;
};

// (3)
const square = (x) => x * x;

console.log(square(3));
```

---

```js
const event = {
  name: 'Birthday Party',
  printGuestList: function () {
    console.log('Guest list for ' + this.name);
  },
};

event.printGuestList(); // Guest list for Birthday Party
```

```js
const event = {
  name: 'Birthday Party',
  printGuestList: () => {
    console.log('Guest list for ' + this.name);
  },
};

event.printGuestList(); // Guest list for undefined
```

Because arrow functions don't bind their own `this` value, which means that we don't have access to `this` as a reference to the object. So, arrow function are well suited for methods properties that are functions when we want to access this. It means in this case, it would be better to use a standard function.

```js
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
```

### 9. Refactoring to Use Arrow Functions

```js
const tasks = {
  tasks: [
    {
      text: 'Grocery shopping',
      completed: true,
    },
    {
      text: 'Clean yard',
      completed: false,
    },
    {
      text: 'Film course',
      completed: false,
    },
  ],
  getTasksToDo() {
    return this.tasks.filter((task) => !task.completed);
  },
};

console.log(tasks.getTasksToDo());
```

### 10. Listing Notes

It's very similar to the above.

```js
const listNotes = () => {
  const notes = loadNotes();
  log(chalk.inverse('Your notes'));
  notes.forEach((note) => {
    log(note.title);
  });
};
```

### 11. Reading a Note

It's very similar to the above.

```js
const readNote = (title) => {
  const notes = loadNotes();
  const note = notes.find((note) => note.title === title);

  if (note) {
    log(chalk.inverse(note.title));
    log(note.body);
  } else {
    log(chalk.red.inverse('Note not found!'));
  }
};
```
