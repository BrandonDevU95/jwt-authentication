const User = require('../models/user');
const { encryptPassword, verifyPassword } = require('../utils/authPass');
const { validateUser } = require('../schemas/user');
const jwt = require('../utils/jwt');

async function signup(req, res) {
	const user = validateUser(req.body);

	if (!user.success) {
		return res.status(400).json({ error: JSON.parse(user.error.message) });
	}

	const hashedPassword = await encryptPassword(user.data.password);

	if (hashedPassword.error) {
		return res.status(500).json({ error: hashedPassword.message });
	}

	user.data.email = user.data.email.toLowerCase();
	user.data.password = hashedPassword;

	const newUser = new User(user.data);
	try {
		const user = await newUser.save();
		const accessToken = jwt.generateToken(user);
		const refreshToken = jwt.generateRefreshToken(user);

		//Guardar los tokens en las cookies para mayor seguridad y que el cliente pueda acceder a ellos
		// Configurar cookies
		res.cookie('access_token', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // 'secure' asegura que la cookie solo se envíe a través de HTTPS
			sameSite: 'Strict', // 'Strict' asegura que la cookie solo se envíe en solicitudes del mismo sitio
			maxAge: 5 * 60 * 1000, // 5 minutos y se elimina la cookie
		});

		res.cookie('refresh_token', refreshToken, {
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
			return res.status(400).json({ error: 'User not found' });
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
		res.cookie('access_token', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // 'secure' asegura que la cookie solo se envíe a través de HTTPS
			sameSite: 'Strict', // 'Strict' asegura que la cookie solo se envíe en solicitudes del mismo sitio
			maxAge: 5 * 60 * 1000, // 5 minutos y se elimina la cookie
		});

		res.cookie('refresh_token', refreshToken, {
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

async function refreshToken(req, res) {
	const { token } = req.body;

	if (!token) {
		return res.status(400).json({ error: 'Token is required' });
	}

	const { user_id } = jwt.verifyToken(token);

	try {
		const user = await User.findOne({ _id: user_id });
		if (!user) {
			return res.status(400).json({ error: 'User not found' });
		}

		const newToken = jwt.generateToken(user);

		// Configurar cookies
		res.cookie('access_token', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // 'secure' asegura que la cookie solo se envíe a través de HTTPS
			sameSite: 'Strict', // 'Strict' asegura que la cookie solo se envíe en solicitudes del mismo sitio
			maxAge: 5 * 60 * 1000, // 5 minutos y se elimina la cookie
		});

		return res.status(200).json({ accessToken: newToken });
	} catch (error) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
}

module.exports = {
	signup,
	login,
	refreshToken,
};
