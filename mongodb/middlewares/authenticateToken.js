const jwt = require('../utils/jwt');

function authenticateToken(req, res, next) {
	const token = req.cookies['access_token'];
	if (!token) return res.sendStatus(401);

	const decoded = jwt.verifyToken(token);

	if (!decoded) return res.status(403).json({ error: 'Forbidden' });

	req.user = decoded;
	next();
}

module.exports = authenticateToken;
