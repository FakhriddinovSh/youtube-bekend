const express = require('express');
const app = express();
const { PORT } = require('../config');
const modelMiddleware = require('./middleware/model');
const paginationMiddleware = require('./middleware/pagination');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(modelMiddleware);
app.use(paginationMiddleware);

const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const videoRouter = require('./routes/video');
const { ServerError } = require('./utils/error');

app.use('/users', userRouter);
app.use('/', authRouter);
app.use('/videos', videoRouter);

app.use((error, req, res, next) => {
	// if ([400, 401, 404, 413, 415].includes(error.status)) {
	// 	return res.status(error.status).send(error);
	// }
	// return res.status(500).send(new ServerError(''));
	return res.send(error.message);
});

app.listen(PORT, () =>
	console.log('Server running on PORT: http://localhost:' + PORT),
);
