const userValidation = require('../utils/validation');
const sha256 = require('sha256');
const { sign } = require('../utils/jwt');
const path = require('path');
const fs = require('fs');

const REGISTER = (req, res, next) => {
	try {
		const { error, value: user } = userValidation.validate(req.body);
		if (error) return next(error);
		const { mimetype, size, buffer, originalname } = req.file;

		if (size > 10485760) {
			throw new Error('File must not be larger than 10MB!');
		}
		if (!['image/jpg', 'image/jpeg', 'image/png'].includes(mimetype)) {
			throw new Error('File must be JPG/PNG');
		}

		const fileName = originalname.replace(/\s/g, '');
		const filePath = path.join(process.cwd(), 'files', 'images' + fileName);
		fs.writeFileSync(filePath, buffer);

		const users = req.select('users');
		const new_user = {
			userId: users.length ? users[users.length - 1].userId + 1 : 1,
			username: user.username,
			profileImg: '/images' + fileName,
			password: sha256(user.password),
			userCreatedAt: Date(),
		};
		users.push(new_user);
		req.insert('users', users);
		delete new_user.password;

		return res.status(201).json({
			message: 'The user successfully registerd',
			token: sign({
				user: new_user,
				userId: new_user.userId,
				agent: req.headers['user-agent'],
			}),
		});
	} catch (error) {
		return next(error);
	}
};

const LOGIN = (req, res, next) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			throw new Error('Username and password are required');
		}
		const users = req.select('users');
		const user = users.find(
			(item) =>
				item.username == username && item.password == sha256(password),
		);

		if (!user) throw new Error('wrong username or password');

		delete user.password;
		return res.json({
			user,
			message: 'The user sucessfully logged in',
			stats: 400,
			token: sign({
				userId: user.userId,
				agent: req.headers['user-agent'],
			}),
		});
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	REGISTER,
	LOGIN,
};
