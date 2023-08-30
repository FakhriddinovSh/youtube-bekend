const jwt = require('jsonwebtoken');
const { tokenConfig } = require('../../config.js');

module.exports = {
	sign: (payload) =>
		jwt.sign(payload, tokenConfig.key, { expiresIn: tokenConfig.time }),
	verify: (token) => jwt.verify(token, tokenConfig.key),
};
