const validator = require('validator');
const chalk = require('chalk');
const log = console.log;

const getNotes = require('./notes.js');

console.log(chalk.green('Success!'));
log(chalk.blue.bgRed.bold('Hello world!'));

const msg = getNotes();

console.log(msg);

console.log(validator.isURL(''));
