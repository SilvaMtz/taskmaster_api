/**
 * User API endpoints
 */
const express = require('express');
const multer = require('multer');
const User = require('../models/user');
const authenticate = require('../middleware/auth');
const sharp = require('sharp');

/**
 * Multer instance for: PHOTO UPLOAD
 */
const photoUpload = multer({
  limits: {
    fileSize: 3_000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an Image file.'));
    }
    cb(undefined, true);
  }
});

const router = new express.Router();

/*============================================================================*
 * User authentication and registration endpoints
 *============================================================================/ 
/**
 * User Registration
 */
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * User Login
 */
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * User Logout
 * @authenticate
 */
router.post('/users/logout', authenticate, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

/**
 * User - log all sessions out
 * @authenticate
 */
router.post('/users/logoutAll', authenticate, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

/*=============================================================================*
 * User Profile and edit Endpoints
 /*============================================================================/
/**
 * User Basic Profile
 * @authenticate
 */
router.get('/users/me', authenticate, async (req, res) => {
  res.send(req.user);
});

/**
 * Edit User profile
 * @authenticate
 */
router.patch('/users/me', authenticate, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'lastName', 'email', 'password'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates!' });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * Upload Profile photo
 * @authenticate
 * @multer
 */
router.post(
  '/users/me/photo',
  authenticate,
  photoUpload.single('photo'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.photo = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

/**
 * Delete Profile photo
 * @authenticate
 */
router.delete('/users/me/photo', authenticate, async (req, res) => {
  req.user.photo = undefined;
  await req.user.save();
  res.send();
});

/**
 * Get Profile photo
 * @authenticate
 */
router.get('/users/:id/photo', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.photo) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(user.photo);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
