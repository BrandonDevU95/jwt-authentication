require('dotenv').config();

const admin = require('firebase-admin');

//Obtiene el archivo de credenciales de google
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

//Obtiene una instancia de la base de datos de firestore
const db = admin.firestore();

module.exports = db;
