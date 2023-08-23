const express = require('express');
const app = express();
const { PORT } = require('../config');
const multer = require('multer');
const photoUpload = multer();
const modelMiddleware = require('./middleware/model');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(photoUpload.single('file'));
// app.use(fileUpload.single('video'));
app.use(modelMiddleware);

const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

app.use('/users', userRouter);
app.use('/', authRouter);

app.use((error, req, res, next) => {
	return res.send({ message: error.message });
});

app.listen(PORT, () =>
	console.log('Server running on PORT: http://localhost:' + PORT),
);
