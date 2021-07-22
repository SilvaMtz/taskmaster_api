const mongoose = require('mongoose');
const HexType = require('../db/schemas/hex-type');
const Task = require('../models/task');
mongoose.Schema.Types.HexType = HexType;
/**
 * TO DO: Add the following properties to the Tag object:
 */

const tagSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		color: {
			type: HexType
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

tagSchema.pre('deleteOne', {document: true}, async function (next) {
  const tag = this;
	const owner = tag.owner;

  await Task.find({ owner: mongoose.Types.ObjectId(owner), tags: { $elemMatch: { $eq: tag._id } } }, async (err, tasks) => {
		await tasks.forEach(async (task) => {
			const index = task.tags.indexOf(tag._id);
			if (index > -1) {
				task.tags.splice(index, 1);
			}
			await task.save();
		});
	});

  next();
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
