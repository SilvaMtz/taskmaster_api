/**
 * Tags Router API endpoints
 */
const express = require('express');
const Tag = require('../models/tag');
const authenticate = require('../middleware/auth');

const router = express.Router();

/**
 * TO DO:
 * Delete the 
 */

/**
 * Create a tag
 * @method POST
 */
router.post('/tags', authenticate, async (req, res) => {
  const tag = new Tag({
    ...req.body,
    owner: req.user._id
  });

  try {
    await tag.save();
    res.status(201).send(tag);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * GET ALL the user's tags
 * @method GET
 */
router.get('/tags', authenticate, async (req, res) => {
  try {
    await req.user.populate({ path: 'tags' }).execPopulate();
    res.status(200).send(req.user.tags);
  } catch (e) {
    res.status(500).send(e);
  }
});

/**
 * GET a specific tag
 * @method GET
 */
router.get('/tags/:id', authenticate, async (req, res) => {
  const _id = req.params.id;
  try {
    const tag = await Tag.findOne({ _id, owner: req.user._id });

    if (!tag) {
      return res.status(404).send();
    }
    res.send(tag);
  } catch (e) {
    res.status(500).send();
  }
});

/**
 * UPDATE an individual user's tag
 * @method PATCH
 */
router.patch('/tags/:id', authenticate, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'color'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates!' });
  }

  const _id = req.params.id;
  const owner = req.user._id;

  try {
    const tag = await Tag.findOne({ _id, owner });

    if (!tag) {
      return res.status(404).send();
    }

    updates.forEach((update) => (tag[update] = req.body[update]));
    await tag.save();

    res.send(tag);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * DELETE an individual user's tag
 * @method DELETE
 */
router.delete('/tags/:id', authenticate, async (req, res) => {
  const _id = req.params.id;
  const owner = req.user._id;

  try {
    const tag = await Tag.findOne({ _id, owner });
		
    if (!tag) {
      return res.status(404).send();
    }

		await tag.deleteOne()

    res.send(tag);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
