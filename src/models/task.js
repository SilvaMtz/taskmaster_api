const mongoose = require('mongoose');
const TaskPriorityType = require('../db/schemas/task-priority');
mongoose.Schema.Types.TaskPriorityType = TaskPriorityType;
/**
 * TO DO: Add the following properties to the Task object:
 * 		- Category/column (new model?) (you can create new categories/columns)
 * 		- StartDateTime/EndDateTime
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
    startDateTime: {
      type: Date
    },
    endDateTime: {
      type: Date
    },
    priority: {
      type: TaskPriorityType
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ]
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
