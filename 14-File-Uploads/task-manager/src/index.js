const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3005;

const multer = require('multer');

const uploadWithMulterMiddleware = multer({
  dest: 'images',
  limits: {
    fileSize: 1000000, // number in bytes – here 1MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/i)) {
      return cb(new Error('File must be a Word document'));
    }

    cb(undefined, true);

    // cb(new Error('File must be a PDF')); // send an error back
    // cb(undefined, true); // no error and accept the upload
    // cb(undefined, false); // no error but reject silently the upload
  },
});

app.post(
  '/upload',
  uploadWithMulterMiddleware.single('upload_multer'),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  },
);

app.use(express.json());

// ROUTES
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log('Server is up on port ', port);
});
