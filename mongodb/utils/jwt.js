const jwt = require('jsonwebtoken');

function generateToken(user) {
	const expToken = new Date();
	// Establece el tiempo de expiración del token en 1 hora
	expToken.setHours(expToken.getHours() + 1);

	const payload = {
		token_type: 'access',
		user_id: user._id,
		iat: new Date.now(),
		exp: expToken.getTime(),
	};

	return jwt.sign(payload, process.env.JWT_SECRET);
}

function generateRefreshToken(user) {
	const expToken = new Date();
	// Establece el tiempo de expiración del token en 1 semana
	expToken.setDate(expToken.getDate() + 7);

	const payload = {
		token_type: 'refresh',
		user_id: user._id,
		iat: new Date.now(),
		exp: expToken.getTime(),
	};

	return jwt.sign(payload, process.env.JWT_SECRET);
}

function verifyToken(token) {
	return jwt.verify(token, process.env.JWT_SECRET, true);
}

module.exports = {
	generateToken,
	generateRefreshToken,
	verifyToken,
};