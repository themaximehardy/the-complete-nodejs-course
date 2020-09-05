const chalk = require('chalk');
const yargs = require('yargs');
const getNotes = require('./notes.js');

// Customize yargs version
yargs.version('1.1.0');

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
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
  },
  handler: (argv) => {
    console.log('Title: ' + argv.title);
    console.log('Body: ' + argv.body);
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

// console.log(yargs.argv);
yargs.parse();
