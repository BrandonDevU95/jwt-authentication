const express = require('express');
const cors = require('cors');

const app = express();

//Importar rutas
const authRoutes = require('./router/auth');

//Configure Body Parser
app.use(express.json());

//Configuracion de Headers y CORS
app.use(cors());

//Configuracion de rutas
app.use('/auth', authRoutes);

module.exports = app;
