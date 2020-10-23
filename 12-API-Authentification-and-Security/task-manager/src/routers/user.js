const express = require('express');
const router = new express.Router();
const User = require('../models/user');

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    res.send(user);
  } catch (error) {
    res.status(400).send();
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/users/:id', async (req, res) => {
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

router.patch('/users/:id', async (req, res) => {
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

router.delete('/users/:id', async (req, res) => {
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

module.exports = router;
