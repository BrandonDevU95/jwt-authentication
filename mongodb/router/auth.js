const express = require('express');
const AuthController = require('../controllers/auth');
const authenticateToken = require('../middlewares/authenticateToken');

const api = express.Router();

api.post('/signup', AuthController.signup);
api.post('/login', AuthController.login);
api.post('/refresh-token', AuthController.refreshToken);

api.get('/protected', authenticateToken, (req, res) => {
	res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = api;
