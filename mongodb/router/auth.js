const express = require('express');
const AuthController = require('../controllers/auth');

const api = express.Router();

api.post('/signup', AuthController.signup);

module.exports = api;