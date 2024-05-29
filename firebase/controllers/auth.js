const { validateUser } = require('../models/user');
const { encryptPassword } = require('../utils/authPass');
const crypto = require('node:crypto');
const db = require('../firebase');

async function signUp(req, res) {
	const user = validateUser(req.body);

	if (!user.success) {
		return res.status(400).json({ error: JSON.parse(user.error.message) });
	}

	const hashedPassword = await encryptPassword(user.data.password);

	if (hashedPassword.error) {
		return res.status(500).json({ error: hashedPassword.message });
	}

	user.data.password = hashedPassword;
	user.data.id = crypto.randomUUID();

	const response = await db.collection('users').add(user.data);

	if (response.error) {
		return res.status(500).json({ error: response.message });
	}

	return res.status(201).json({ message: 'User created successfully' });
}

module.exports = { signUp };
