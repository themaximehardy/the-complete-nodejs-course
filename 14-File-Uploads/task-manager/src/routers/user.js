const express = require('express');
const multer = require('multer');
const router = new express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/user');

/**
 * SIGNUP
 * NOT PROTECTED
 * CREATE A NEW USER (and generates a new token)
 */
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * LOGIN
 * NOT PROTECTED
 * LOG IN A USER (and generates a new token)
 */
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

/**
 * LOGOUT
 * AS TO BE AUTHENTICATED
 * LOG OUT A USER (by removing the right token)
 */
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * LOGOUT
 * AS TO BE AUTHENTICATED
 * LOG OUT A USER (by removing all the tokens)
 */
router.post('/users/logout_all', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * GET INFO USER
 * AS TO BE AUTHENTICATED
 * RETURN BASICS INFO ABOUT THE USER
 */
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

/**
 * GET ALL USERS INFO
 * AS TO BE ADMIN
 * RETURN ALL INFORMATION ABOUT ALL USERS
 */
router.get('/users', admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * GET INFO ABOUT A SPECIFIC USER
 * AS TO BE ADMIN
 * RETURN ALL INFORMATION ABOUT A SPECIFIC USER
 */
router.get('/users/:id', admin, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * UPDATE ITS OWN PROFILE
 * AS TO BE AUTHENTICATED
 * UPDATE SPECIFIC INFO ABOUT ITS OWN PROFILE
 */
router.patch('/users/me', auth, async (req, res) => {
  const { body } = req;

  const updates = Object.keys(body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    updates.forEach((update) => {
      req.user[update] = body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * UPDATE A SPECIFIC USER PROFILE
 * AS TO BE ADMIN
 * UPDATE SPECIFIC INFO ABOUT A SPECIFIC USER PROFILE
 */
router.patch('/users/:id', admin, async (req, res) => {
  const { body, params } = req;
  const _id = params.id;

  const updates = Object.keys(body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    // 1 – below is bypassing mongoose as a result, or middlewares...
    // const user = await User.findByIdAndUpdate(_id, body, { new: true, runValidators: true });

    // 2 – we need to use another way then
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    // 2.1 – then...
    updates.forEach((update) => {
      user[update] = body[update];
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * DELETE ITS OWN PROFILE
 * AS TO BE AUTHENTICATED
 * DELETE ITS OWN PROFILE (and automatically logout)
 */
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * DELETE A SPECIFIC USER PROFILE
 * AS TO BE ADMIN
 * DELETE A SPECIFIC USER PROFILE (and automatically logout it)
 */
router.delete('/users/:id', admin, async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

const upload = multer({
  // dest: 'avatars', // remove it here to ge access to the file in the request
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      return cb(new Error('File must be jpg, jpeg or png only'));
    }

    cb(undefined, true);
  },
});

router.post(
  '/users/me/avatar',
  auth, // 1st middleware – auth
  upload.single('avatar'), // 2nd middleware – validate and accept the upload
  async (req, res) => {
    // we can only access `req.file.buffer` in our handler when we don't have that `dest` option setup
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    // we handle the error
    res.status(400).send({ error: error.message });
  },
);

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

module.exports = router;
