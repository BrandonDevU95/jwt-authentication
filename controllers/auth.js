const { use } = require('../app');
const { validateUser } = require('../model/user');
const { encryptPassword } = require('../utils/authPass');

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

	console.log(user.data);
}

module.exports = { signUp };
