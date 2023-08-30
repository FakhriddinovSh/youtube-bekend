const { verify } = require('../utils/jwt');
const { ClientError } = require('../utils/error');

module.exports = (req, res, next) => {
	try {
		const { token } = req.headers;
		if (!token) {
			throw new ClientError(401, 'User is not authorized');
		}

		const { userId, agent } = verify(token);
		req.userId = userId;

		if (req.headers['user-agent'] != agent) {
			throw new Error('Token key is expired');
		}

		return next();
	} catch (error) {
		return next(error);
	}
};
