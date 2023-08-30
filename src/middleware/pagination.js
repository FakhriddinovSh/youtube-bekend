const { PAGINATION } = require('../../config');

module.exports = (req, res, next) => {
	req.PAGINATION = PAGINATION;
	return next();
};
