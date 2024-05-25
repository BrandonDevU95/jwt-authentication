const express = require('express');
const cors = require('cors');
const db = require('./firebase');

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

// app.get('/', async (req, res) => {
// 	//Conecion a la base de datos de firestore a la coleccion contact
// 	const response = await db.collection('contact').get();
// 	//Devuelve el primer documento de la coleccion contact
// 	console.log(response.docs[0].data());
// 	res.send('Hello World!');
// });
