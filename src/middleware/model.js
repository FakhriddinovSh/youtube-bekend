const path = require('path');
const fs = require('fs');
const { ServerError } = require('../utils/error');

const model = (req, res, next) => {
	req.select = function (fileName) {
		try {
			let files = fs.readFileSync(
				path.join(process.cwd(), 'src', 'database', fileName + '.json'),
				'UTF-8',
			);
			files = files ? JSON.parse(files) : [];
			return files;
		} catch (error) {
			return next(new ServerError(error.message));
		}
	};

	req.insert = function (fileName, data) {
		try {
			let files = fs.writeFileSync(
				path.join(process.cwd(), 'src', 'database', fileName + '.json'),
				JSON.stringify(data, null, 4),
			);
			return true;
		} catch (error) {
			return next(new ServerError(error.message));
		}
	};

	return next();
};

module.exports = model;
