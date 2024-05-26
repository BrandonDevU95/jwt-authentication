const z = require('zod');

const userSchema = z.object({
	firstname: z.string({
		required_error: 'First name is required',
		invalid_type_error: 'First name must be a string',
	}),
	lastname: z.string({
		required_error: 'Last name is required',
		invalid_type_error: 'Last name must be a string',
	}),
	email: z
		.string({
			required_error: 'Email is required',
			invalid_type_error: 'Email must be a string',
		})
		.email({
			message: 'Invalid email address',
		})
		.unique(),
	password: z
		.string({
			required_error: 'Password is required',
			invalid_type_error: 'Password must be a string',
		})
		.min(6, {
			message: 'Password must be at least 6 characters long',
		}),
	role: z.string(),
	active: z.boolean(),
	avatar: z.string().url(),
	created_at: z.date(),
	updated_at: z.date(),
});

//safeParse devuelve un objeto con un error si no se cumple el schema, y
//si se cumple, devuelve un booleano.
function validateUser(user) {
	return userSchema.safeParse(user);
}

//el partial es para cuando se quiera actualizar solo una parte del objeto,
//hace que todas las propiedades sean opcionales
function validateUserPartial(user) {
	return userSchema.partial().safeParse(user);
}

module.exports = {
	validateUser,
	validateUserPartial,
};
