const mongoose = require('mongoose');

/**
 * TO DO: Add the following properties to the Task object:
 * 		- Tag (new model?) (you can create new tags)
 * 		- Category/column (new model?) (you can create new categories/columns)
 * 		- StartDateTime/EndDateTime
 * 		- Priority
 * 		- Location
 */

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      minLength: 20,
      trim: true
    },
    completed: {
      type: Boolean,
      required: true,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
