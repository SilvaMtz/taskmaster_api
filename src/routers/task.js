/**
 * Tasks Router API endpoints
 */
const express = require('express');
const Task = require('../models/task');
const authenticate = require('../middleware/auth');

const router = express.Router();

/**
 * Create a individual user's task
 * @method POST
 */
router.post('/tasks', authenticate, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * GET ALL the user's tasks
 * @method GET
 * @query_params 
 * 	completed: boolean, 
 * 	limit: number,
 * 	page: number,
 * 	sortBy: property:order
 */
router.get('/tasks', authenticate, async (req, res) => {
	const match = {};
	const sortOptions = {};

	const page = req.query.page && parseInt(req.query.page);
	const skip_multiplier = page && page > 0 ? (page - 1) : 0;

	if (req.query.completed) {
		match.completed = req.query.completed === 'true'
	}

	if (req.query.sortBy) {
		const sortBy = req.query.sortBy.split(':');
		sortOptions[sortBy[0]] = sortBy[1] === 'desc' ? -1 : 1;
	}

  try {
		await req.user.populate({
			path: 'tasks',
			match,
			options: {
				limit: parseInt(req.query.limit),
				skip: parseInt(req.query.limit) * skip_multiplier,
				sort: sortOptions
			}
		}).execPopulate();
    res.status(200).send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

/**
 * GET an individual user's task
 * @method GET
 */
router.get('/tasks/:id', authenticate, async (req, res) => {
	const _id = req.params.id
  try {
		const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

/**
 * UPDATE an individual user's task
 * @method PATCH
 */
router.patch('/tasks/:id', authenticate, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed', 'title'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates!' });
  }

	const _id = req.params.id;
	const owner = req.user._id;

  try {
		const task = await Task.findOne({ _id, owner })

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * DELETE an individual user's task
 * @method DELETE
 */
router.delete('/tasks/:id', authenticate, async (req, res) => {
	const _id = req.params.id;
	const owner = req.user._id;

  try {
		const task = await Task.findOneAndDelete({ _id, owner });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
	} catch (e) {
		res.status(500).send();
	}
});

module.exports = router;
