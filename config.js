const PORT = process.env.PORT || 5000;
require('dotenv').config();

const tokenConfig = {
	time: 60 * 60 * 24,
	key: process.env.TOKEN_KEY,
};

module.exports = { PORT, tokenConfig };
