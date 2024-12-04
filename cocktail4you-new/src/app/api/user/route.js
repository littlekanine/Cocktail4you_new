import dbConnect from '../../../lib/mongodb'; // Connexion à la DB
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

// Schéma d'utilisateur
const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { email, username, password } = req.body;

		// Vérifier que les champs ne sont pas vides
		if (!email || !username || !password) {
			return res.status(400).json({ error: 'Tous les champs sont requis' });
		}

		try {
			// Connexion à MongoDB
			await dbConnect();

			// Vérifier si l'utilisateur existe déjà
			const existingUser = await User.findOne({ $or: [{ email }, { username }] });
			if (existingUser) {
				return res.status(400).json({ error: "Email ou nom d'utilisateur déjà utilisé" });
			}

			// Hacher le mot de passe
			const hashedPassword = await bcrypt.hash(password, 10);

			// Créer un nouvel utilisateur
			const newUser = new User({ email, username, password: hashedPassword });
			await newUser.save();

			return res.status(200).json({ message: 'Utilisateur inscrit avec succès' });
		} catch (err) {
			console.error(err);
			return res.status(500).json({ error: 'Erreur interne du serveur' });
		}
	} else {
		res.status(405).json({ error: 'Méthode HTTP non autorisée' });
	}
}
