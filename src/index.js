const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const tagsRouter = require('./routers/tag');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(tagsRouter);

app.listen(port, () => {
  console.log('Server running. Listening in PORT', port);
});
