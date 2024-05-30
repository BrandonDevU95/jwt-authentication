const User = require('../models/user');
const { encryptPassword, verifyPassword } = require('../utils/authPass');
const { validateUser } = require('../schemas/user');
const jwt = require('../utils/jwt');
const { ACCESS_TOKEN, REFRESH_TOKEN } = require('../utils/constants');

async function signup(req, res) {
	const userFields = validateUser(req.body);

	if (!userFields.success) {
		return res
			.status(400)
			.json({ error: JSON.parse(userFields.error.message) });
	}

	const hashedPassword = await encryptPassword(userFields.data.password);

	if (hashedPassword.error) {
		return res.status(500).json({ error: hashedPassword.message });
	}

	const tempUser = {
		...userFields.data,
		email: userFields.data.email.toLowerCase(),
		password: hashedPassword,
		role: 'user',
		active: true,
	};

	const userSchema = new User(tempUser);
	try {
		const user = await userSchema.save();
		const accessToken = jwt.generateToken(user);
		const refreshToken = jwt.generateRefreshToken(user);

		//Guardar los tokens en las cookies para mayor seguridad y que el cliente pueda acceder a ellos
		// Configurar cookies
		res.cookie(ACCESS_TOKEN, accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // 'secure' asegura que la cookie solo se envíe a través de HTTPS
			sameSite: 'Strict', // 'Strict' asegura que la cookie solo se envíe en solicitudes del mismo sitio
			maxAge: 5 * 60 * 1000, // 5 minutos y se elimina la cookie
		});

		res.cookie(REFRESH_TOKEN, refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'Strict',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 1 semana y se elimina la cookie
		});

		return res.status(201).json({
			accessToken,
			refreshToken,
		});
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

async function login(req, res) {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ error: 'Username/Email and password are required' });
	}

	const loginField = username.includes('@')
		? { email: username.toLowerCase() }
		: { username: username.toLowerCase() };

	try {
		const user = await User.findOne(loginField);

		if (!user) {
			return res.status(400).json({ error: 'Invalid credentials' });
		}

		if (!user.active)
			return res.status(400).json({ error: 'User is not active' });

		const isValidPassword = await verifyPassword(password, user.password);

		if (isValidPassword.error) {
			return res.status(400).json({ error: isValidPassword.message });
		}

		const accessToken = jwt.generateToken(user);
		const refreshToken = jwt.generateRefreshToken(user);

		//Guardar los tokens en las cookies para mayor seguridad y que el cliente pueda acceder a ellos
		// Configurar cookies
		res.cookie(ACCESS_TOKEN, accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // 'secure' asegura que la cookie solo se envíe a través de HTTPS
			sameSite: 'Strict', // 'Strict' asegura que la cookie solo se envíe en solicitudes del mismo sitio
			maxAge: 5 * 60 * 1000, // 5 minutos y se elimina la cookie
		});

		res.cookie(REFRESH_TOKEN, refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'Strict',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 1 semana y se elimina la cookie
		});

		res.status(200).json({ accessToken, refreshToken });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
}

async function logout(req, res) {
	res.clearCookie(ACCESS_TOKEN);
	res.clearCookie(REFRESH_TOKEN);
	res.status(200).json({ message: 'Logout successfully' });
}

module.exports = {
	signup,
	login,
	logout,
};
