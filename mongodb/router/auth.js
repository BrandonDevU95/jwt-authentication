const express = require('express');
const AuthController = require('../controllers/auth');
const { userAuth } = require('../middlewares/authenticateToken');

const api = express.Router();

api.post('/signup', AuthController.signup);
api.post('/login', AuthController.login);
api.get('/logout', AuthController.logout);

api.get('/protected', userAuth, (req, res) => {
	res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = api;
