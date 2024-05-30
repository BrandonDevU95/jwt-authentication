const jwt = require('../utils/jwt');
const { ACCESS_TOKEN, REFRESH_TOKEN } = require('../utils/constants');

function userAuth(req, res, next) {
	const accessToken = req.cookies[ACCESS_TOKEN];
	const refreshToken = req.cookies[REFRESH_TOKEN];

	if (!accessToken && !refreshToken) {
		return res
			.status(401)
			.json({ error: 'Unauthorized: Token is required' });
	}

	try {
		let accessTokenPayload;
		let refreshTokenPayload;

		// Verificamos el access token
		if (accessToken) {
			accessTokenPayload = jwt.decodedToken(accessToken);
		}

		// Verificamos el refresh token
		if (refreshToken) {
			refreshTokenPayload = jwt.decodedToken(refreshToken);
		}

		const currentTime = Date.now();

		// Evaluamos si el access token ha expirado
		if (!accessTokenPayload || accessTokenPayload.exp <= currentTime) {
			// Si el refresh token ha expirado
			if (
				!refreshTokenPayload ||
				refreshTokenPayload.exp <= currentTime
			) {
				res.clearCookie(ACCESS_TOKEN);
				res.clearCookie(REFRESH_TOKEN);
				return res
					.status(401)
					.json({ error: 'Token has expired. Please log in again.' });
			} else {
				// Generamos un nuevo access token
				const newAccessToken = jwt.generateToken({
					_id: refreshTokenPayload.user_id,
				});
				res.cookie(ACCESS_TOKEN, newAccessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'Strict',
					maxAge: 5 * 60 * 1000, // 5 minutos
				});
				// Asignamos el payload del nuevo access token a req.user
				req.user = jwt.decodedToken(newAccessToken);
				return next();
			}
		}

		// Si el access token es válido, asignamos el payload a req.user
		req.user = accessTokenPayload;
		next();
	} catch (error) {
		res.clearCookie(ACCESS_TOKEN);
		res.clearCookie(REFRESH_TOKEN);
		return res.status(403).json({ error: 'Forbidden: Invalid token' });
	}
}

module.exports = { userAuth };
