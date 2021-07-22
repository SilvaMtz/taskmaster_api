const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email provided is not invalid.');
        }
      }
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error("Password cannot contain the word 'password'");
        }
      }
    },
		photo: {
			type: Buffer
		},
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.virtual('tags', {
	ref: 'Tag',
	localField: '_id',
	foreignField: 'owner'
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
	delete userObject.photo;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = JWT.sign({ _id: user._id.toString() }, 'newcourse');

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Email or password are incorrect.');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Email or password are incorrect.');
  }

  return user;
};

// Hash plain text password
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
