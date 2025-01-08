import dbConnect from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/UserModel';

export async function POST(req) {
	try {
		// Récupérer les données de la requête
		const { username, password } = await req.json();

		// Connexion à la base de données
		await dbConnect();

		// Authentification avec nom d'utilisateur et mot de passe
		if (username && password) {
			const user = await User.findOne({ username });

			// Vérification de l'utilisateur
			if (!user) {
				return new Response(JSON.stringify({ error: "Nom d'utilisateur ou mot de passe incorrect" }), { status: 401 });
			}

			// Vérification du mot de passe
			const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
			if (!isPasswordValid) {
				return new Response(JSON.stringify({ error: "Nom d'utilisateur ou mot de passe incorrect" }), { status: 401 });
			}

			// Générer les tokens
			const auth_token = jwt.sign(
				{ id: user._id, email: user.email },
				process.env.JWT_SECRET,
				{ expiresIn: '3h' } // Durée de l'access token
			);

			const refreshToken = jwt.sign(
				{ id: user._id },
				process.env.REFRESH_TOKEN_SECRET,
				{ expiresIn: '7d' } // Durée du refresh token
			);

			// Réponse avec les cookies
			return new Response(JSON.stringify({ message: 'Connexion réussie', redirectTo: '/user-space' }), {
				status: 200,
				headers: {
					'Set-Cookie': [
						`access_token=${auth_token}; HttpOnly; Path=/; Max-Age=10800; SameSite=Strict; Secure`,
						`refresh_token=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`,
					].join(', '),
					'Content-Type': 'application/json',
				},
			});
		}

		// Si aucun identifiant n'est fourni
		return new Response(JSON.stringify({ error: 'Requête invalide : fournir un nom d’utilisateur et un mot de passe' }), { status: 400 });
	} catch (err) {
		console.error('Erreur interne :', err);
		return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500 });
	}
}
