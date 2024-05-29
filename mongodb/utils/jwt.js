const jwt = require('jsonwebtoken');

function generateToken(user) {
	const expToken = new Date();
	// Establece el tiempo de expiración del token en 5 minutos
	expToken.setMinutes(expToken.getMinutes() + 5);

	const payload = {
		token_type: 'access',
		user_id: user._id,
		iat: Date.now(),
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
		iat: Date.now(),
		exp: expToken.getTime(),
	};

	return jwt.sign(payload, process.env.JWT_SECRET);
}

function decodedToken(token) {
	return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) return null;
		// El token es válido y `decoded` contiene el payload del token
		return decoded;
	});
}

module.exports = {
	generateToken,
	generateRefreshToken,
	decodedToken,
};
