const express = require('express');
const AuthController = require('../controllers/auth');

const api = express.Router();

api.post('/signup', AuthController.signup);
api.post('/login', AuthController.login);
api.post('/refresh-token', AuthController.refreshToken);

module.exports = api;
