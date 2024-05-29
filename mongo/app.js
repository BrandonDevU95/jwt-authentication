const express = require('express');
const cors = require('cors');

const app = express();

//Import Routes

//Configure Body Parser
app.use(express.json());

//Configure CORS
app.use(cors());
//Configure Routes

module.exports = app;
