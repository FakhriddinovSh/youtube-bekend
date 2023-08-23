const Joi = require('joi');

const userValidation = Joi.object({
	username: Joi.string().max(30).alphanum().required(),
	password: Joi.string()
		.max(15)
		.min(5)
		.required()
		.pattern(new RegExp(/(?=.*[A-Za-z]+)(?=.*[0-9]+)(?=.*[@$!%*#?&]+)/)),
});

module.exports = userValidation;
