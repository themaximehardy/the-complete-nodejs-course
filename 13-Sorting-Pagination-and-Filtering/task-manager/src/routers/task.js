const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Task = require('../models/task');

/**
 * CREATE A NEW TASK
 * AS TO BE AUTHENTICATED
 * CREATE A NEW TASK (and link it with the current user id)
 */
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * GET ALL TASKS (for the current user)
 * AS TO BE AUTHENTICATED
 * RETURN ALL TASKS (created by the current user)
 */
router.get('/tasks', auth, async (req, res) => {
  try {
    // 1st method
    // const tasks = await Task.find({ owner: req.user._id });
    // res.send(tasks);
    // 2nd method
    await req.user.populate('tasks').execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * GET ALL TASKS
 * AS TO BE ADMIN
 * RETURN ALL TASKS
 */
router.get('/tasks_all', admin, async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * GET ANY TASK INFORMATION (by providing the id and linked with the currrent user account)
 * AS TO BE AUTHENTICATED
 * RETURN ALL INFO ABOUT A SPECIFIC TASK (created by the current user)
 */
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * GET ANY TASK INFORMATION (by providing the id)
 * AS TO BE ADMIN
 * RETURN ALL INFO ABOUT A SPECIFIC TASK
 */
router.get('/tasks_all/:id', admin, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * UPDATE ANY TASK INFORMATION (by providing the id and linked with the currrent user account)
 * AS TO BE AUTHENTICATED
 * UPDATE ALL INFO ABOUT ANY SPECIFIC TASK (created by the current user)
 */
router.patch('/tasks/:id', auth, async (req, res) => {
  const { body, params } = req;
  const _id = params.id;

  const updates = Object.keys(body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      task[update] = body[update];
    });
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * UPDATE ANY TASK INFORMATION (by providing the id)
 * AS TO BE ADMIN
 * UPDATE ALL INFO ABOUT ANY SPECIFIC TASK
 */
router.patch('/tasks_all/:id', admin, async (req, res) => {
  const { body, params } = req;
  const _id = params.id;

  const updates = Object.keys(body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    // const task = await Task.findByIdAndUpdate(_id, body, { new: true, runValidators: true });
    const task = await Task.findById(_id);

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      task[update] = body[update];
    });
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * DELETE ANY TASK INFORMATION (by providing the id and linked with the currrent user account)
 * AS TO BE AUTHENTICATED
 * DELETE ANY SPECIFIC TASK (created by the current user)
 */
router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

/**
 * DELETE ANY TASK INFORMATION (by providing the id)
 * AS TO BE ADMIN
 * DELETE ANY SPECIFIC TASK
 */
router.delete('/tasks_all/:id', admin, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findByIdAndDelete(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
