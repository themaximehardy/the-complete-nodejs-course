const fs = require('fs');
const chalk = require('chalk');
const log = console.log;

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
    log(chalk.green.inverse('New note added!'));
  } else {
    log(chalk.red.inverse('Note title taken!'));
  }
};

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

const listNotes = () => {
  const notes = loadNotes();
  log(chalk.inverse('Your notes'));
  notes.forEach((note) => {
    log(note.title);
  });
};

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
  removeNote,
  listNotes,
  readNote,
};
