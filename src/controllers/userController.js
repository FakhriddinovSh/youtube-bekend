const model = require('../middleware/model');

const GET = (req, res, next) => {
	try {
		const { userId } = req.params;
		const { page, limit } = req.query;
		const users = req.select('users');
		if (userId) {
			const findedUser = users.find((item) => {
				const result = item.userId == userId;
				return result;
			});
			return res.send(findedUser);
		} else if (userId || page || limit) {
			const paginatedUsers = users.slice(
				limit * page - limit,
				limit * page,
			);
			return res.json(paginatedUsers);
		} else {
			return res.json(users);
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	GET,
};
