const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/taskmaster-api', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(() => {
	console.log('Database Connection successful.')
}).catch((e) => {
	console.log('ERROR: ', e);
});