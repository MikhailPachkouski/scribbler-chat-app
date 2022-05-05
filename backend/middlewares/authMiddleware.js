const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const asycHandler = require('express-async-handler');

const protect = asycHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1];
			console.log(req.headers);
			const decode = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);

			req.user = await User.findById(decode.id).select('-password');
			next();
		} catch (error) {
			req.status(401);
			throw new Error('Not authorized, token failed');
		}
	}

	if (!token) {
		req.status(401);
		throw new Error('Not authorized, no token');
	}
});

module.exports = { protect };
