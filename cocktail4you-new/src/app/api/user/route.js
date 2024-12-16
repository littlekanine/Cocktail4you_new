import dbConnect from '../../../../lib/mongodb'; // Connexion à la DB
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

// Schéma d'utilisateur
const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export async function POST(req) {
	try {
		const { email, username, password } = await req.json();

		// Vérifier que les champs ne sont pas vides
		if (!email || !username || !password) {
			return new Response(JSON.stringify({ error: 'Tous les champs sont requis' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		// Connexion à MongoDB
		await dbConnect();

		// Vérifier si l'utilisateur existe déjà
		const existingUser = await User.findOne({ $or: [{ email }, { username }] });
		if (existingUser) {
			return new Response(JSON.stringify({ error: "Email ou nom d'utilisateur déjà utilisé" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		// Hacher le mot de passe
		const hashedPassword = await bcrypt.hash(password, 10);

		// Créer un nouvel utilisateur
		const newUser = new User({ email, username, password: hashedPassword });
		await newUser.save();

		return new Response(JSON.stringify({ message: 'Vous êtes inscrit ! Bienvenue !' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	}
}
