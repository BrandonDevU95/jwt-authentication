const jwt = require('../utils/jwt');

function userAuth(req, res, next) {
	const accessToken = req.cookies['access_token'];
	const refreshToken = req.cookies['refresh_token'];

	if (!accessToken && !refreshToken)
		return res
			.status(401)
			.json({ error: 'Unauthorized the token is required' });

	try {
		const accessTokenPayload = jwt.decodedToken(accessToken);
		const refreshTokenPayload = jwt.decodedToken(refreshToken);

		if (!accessTokenPayload || !refreshTokenPayload) {
			res.clearCookie('access_token');
			res.clearCookie('refresh_token');
			return res
				.status(401)
				.json({ error: 'Unauthorized invalid token' });
		}

		const expAccessToken = accessTokenPayload.exp;
		const expRefreshToken = refreshTokenPayload.exp;

		const currentDate = new Date().getTime();

		//Evaluamos si el access_token ha expirado, si ya ha expirado, se evalua si el refresh_token ha expirado
		if (expAccessToken <= currentDate) {
			if (expRefreshToken <= currentDate) {
				//Si el refresh_token ha expirado, se elimina la cookie y se envía un error
				res.clearCookie('access_token');
				res.clearCookie('refresh_token');
				return res.status(401).json({ error: 'Token has expired' });
			} else {
				//Si el refresh_token no ha expirado, se genera un nuevo access_token y se asigna a la cookie
				const newAccessToken = jwt.generateToken(accessTokenPayload);
				console.log('newAccessToken', newAccessToken);
				res.cookie('access_token', newAccessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'Strict',
					maxAge: 5 * 60 * 1000,
				});
			}
		}

		//Si el access_token no ha expirado, se asigna el payload del access_token a req.user
		req.user = accessTokenPayload;
		next();
	} catch (error) {
		return res.status(403).json({ error: 'Forbidden' });
	}

	next();
}

module.exports = { userAuth };
