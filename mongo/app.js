const express = require('express');
const cors = require('cors');

const app = express();

//Import Routes
const authRoutes = require('./router/auth');

//Configure Body Parser
app.use(express.json());

//Configure CORS
app.use(cors());

//Configure Routes
app.use('/api', authRoutes);

module.exports = app;
