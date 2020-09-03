# Node.js Module System (Notes App)

### 1. Introduction

In this section the focus is going to be on one of the most fundamental features of Nodejs, the **Nodejs Module System**. It allows us to load functionality into our app and use it to do interesting things (read or write from the file system, connect to a database or start up a web server...).

There is three different ways to use it:

1. Load a core Nodejs module (included in the node installation).
2. Load in third party modules written by other developers.
3. Load in modules created by ourselves.

### 2. Importing Nodejs Core Modules

We're going to explore the `File system` module – this module is going to allow us to access the operating systems file system. We'll be able to read and write, append files and figure out if a given file or directory exists.

`fs.writeFile(file, data[, options], callback)` (async)
`fs.writeFileSync(file, data[, options])` (sync)

This method is used to write some data to a file on our file system from the Nodejs application.

```js
// node-course/notes-app/app.js
const fs = require('fs');

fs.writeFileSync('notes.txt', 'This file was created by Nodejs!');
fs.appendFileSync('notes.txt', '\nThis line should be append');
```

### 3. Importing Your Own Files

```js
// node-course/notes-app/utils.js
console.log('utils.js');

const name = 'Max';

module.exports = name;
```

```js
// node-course/notes-app/app.js
const name = require('./utils.js');

console.log(name);
```

---

```js
// node-course/notes-app/utils.js
console.log('utils.js');

const add = function (a, b) {
  return a + b;
};

module.exports = add;
```

```js
// node-course/notes-app/app.js
const add = require('./utils.js');

const sum = add(4, -2);
console.log(sum);
```

---

```js
// node-course/notes-app/notes.js
const getNotes = () => {
  return 'Your notes...';
};

module.exports = getNotes;
```

```js
// node-course/notes-app/app.js
const getNotes = require('./notes.js');

const msg = getNotes();

console.log(msg);
```

### 4. Importing npm Modules

```sh
node -v
# v12.18.0
npm -v
# 6.14.7
```

`npm init` to initialize npm. It creates a `package.json` file. This file is going to be used to manage all of the dependencies that our application needs to run.

Then, let's install a npm package – [validator](https://www.npmjs.com/package/validator).

```sh
npm i validator
# same as -> npm install validator
```

When we ran that command two things happened: `package-lock.json` is added and **node_modules** is created.

**node_modules** is a folder which contains all of the code for the dependencies we installed. We have a single directory `validator`. That's the package we installed. It should never be manually editing. NPM is maintaining this directory.

`package-lock.json` is a file which contains extra information, making NPM a bit faster and a bit more secure. It lists out the exact versions of all our dependencies as well as where they were fetched from. And we also have a char hash making sure that we're getting the exact code that we got previously if we were to install a dependency again. Once again this is not a file we should ever be editing. Once again this will be maintained by NPM.

```js
// node-course/notes-app/app.js
const validator = require('validator');

console.log(validator.isEmail('foo@bar.com'));
```

### 5. Printing in Color

```sh
# install a specific version here (just for the example)
npm i chalk@2.4.1
```

Loading `chalk` into `app.js`:

```js
const chalk = require('chalk');
const log = console.log;

console.log(chalk.green('Success!'));
// We can be a bit more creative – and composing multiple styles using the chainable API
log(chalk.green.inverse.bold('Success!'));
```

### 6. Global npm Modules and nodemon

Let's install `nodemon` globally.

```sh
# install globally
npm i nodemon -g

# test if nodemon exists
nodemon -v

# launch app with nodemon
nodemon app.js
```
