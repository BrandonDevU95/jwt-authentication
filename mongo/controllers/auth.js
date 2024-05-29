const User = require('../model/user');
const { encryptPassword } = require('../utils/authPass');
const { validateUser } = require('../schema/user');

async function signup(req, res) {
	const user = validateUser(req.body);

	if (!user.success) {
		return res.status(400).json({ error: JSON.parse(user.error.message) });
	}

	const hashedPassword = await encryptPassword(user.data.password);

	if (hashedPassword.error) {
		return res.status(500).json({ error: hashedPassword.message });
	}

	user.data.password = hashedPassword;

	const newUser = new User(user.data);
	try {
		await newUser.save();
		return res.status(201).json({ message: 'User created successfully' });
	} catch (error) {
		if (error.code === 11000) {
			// Código de error de duplicación
			const duplicateField = Object.keys(error.keyPattern)[0]; // Obtener el campo duplicado
			let errorMessage = '';

			if (duplicateField === 'username') {
				errorMessage = 'Username already in use.';
			} else if (duplicateField === 'email') {
				errorMessage = 'Email already in use.';
			} else {
				errorMessage = 'Duplicate field error.';
			}

			res.status(400).json({ error: errorMessage });
		} else {
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
}

module.exports = {
	signup,
};
