const mongoose = require('mongoose');
dotenv = require('dotenv');
const app = require('./app');
dotenv.config();

const PORT = process.env.PORT || 3000;
const IP_SERVER = process.env.IP_SERVER || 'localhost';
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;

(async () => {
	try {
		await mongoose.connect(
			`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/`
		);

		app.listen(PORT, () => {
			console.log(`Server running on port http://${IP_SERVER}:${PORT}`);
		});
	} catch (error) {
		console.log('Error connecting to the database', error);
	}
})();
