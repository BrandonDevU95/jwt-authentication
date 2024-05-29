const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	username: {
		type: String,
		unique: true,
	},
	email: {
		type: String,
		unique: true,
	},
	password: String,
	role: String,
	active: Boolean,
	avatar: {
		type: String,
		default: 'default.jpg',
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('User', userSchema);
