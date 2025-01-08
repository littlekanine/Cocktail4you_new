import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		},
		username: {
			type: String,
			required: true,
			unique: true,
			minlength: 3,
			maxlength: 30,
		},
		password: {
			type: String,
			required: true,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		emailVerificationToken: {
			type: String,
		},
		emailVerificationExpires: {
			type: Date,
		},
		lastLogin: {
			type: Date,
		},
		likedCocktails: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Cocktail', // Référence au modèle Cocktail
			},
		],
	},
	{ timestamps: true }
);

// Middleware pour hacher le mot de passe
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	const bcrypt = require('bcryptjs');
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
