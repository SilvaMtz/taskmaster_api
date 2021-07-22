const mongoose = require('mongoose');

class TaskPriorityType extends mongoose.SchemaType {
  constructor(key, options) {
    super(key, options, 'TaskPriorityType');
  }

  cast(val) {
		const allowedValues = [1, 2, 3, 4];
    let _val = Number(val);
    if (isNaN(_val)) {
      throw new Error('TaskPriority: ' + val + ' is not a number');
    }
    _val = Math.round(_val);
    if (!allowedValues.includes(_val)) {
      throw new Error('TaskPriority: ' + val +
        ' is not a recognizable Priority Enumerable');
    }
    return _val;
  }
}

module.exports = TaskPriorityType;