import dbConnect from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/UserModel';

export async function POST(req) {
	try {
		// Récupérer les données de la requête ou des cookies
		const { username, password } = await req.json().catch(() => ({})); // Pour le cas où aucune donnée JSON n'est fournie
		const cookies = req.headers.get('cookie'); // Récupère les cookies de l'entête HTTP

		await dbConnect(); // Connexion à la base de données

		// Cas 1 : Authentification avec nom d'utilisateur et mot de passe
		if (username && password) {
			const user = await User.findOne({ username });
			if (!user) {
				return new Response(JSON.stringify({ error: "Nom d'utilisateur ou mot de passe incorrect" }), { status: 401 });
			}

			const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
			if (!isPasswordValid) {
				return new Response(JSON.stringify({ error: "Nom d'utilisateur ou mot de passe incorrect" }), { status: 401 });
			}

			// Générer un token JWT
			const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '3h' });

			// Réponse réussie avec un nouveau cookie
			return new Response(JSON.stringify({ message: 'Connexion réussie', redirectTo: '/user-space' }), {
				status: 200,
				headers: {
					'Set-Cookie': `auth_token=${token}; HttpOnly; Path=/; Max-Age=10800; SameSite=Strict`,
					'Content-Type': 'application/json',
				},
			});
		}

		// Cas 2 : Vérification d'un token existant dans les cookies
		if (cookies) {
			const cookie = cookies.split(';').find((cookie) => cookie.trim().startsWith('token='));
			const token = cookie ? cookie.split('=')[1] : null;

			if (!token) {
				return new Response(JSON.stringify({ error: 'Token non trouvé dans les cookies' }), { status: 401 });
			}

			// Vérifier et décoder le token
			let decoded;
			try {
				decoded = jwt.verify(token, process.env.JWT_SECRET);
			} catch (err) {
				if (err instanceof jwt.TokenExpiredError) {
					return new Response(JSON.stringify({ error: 'Token expiré' }), { status: 401 });
				}
				return new Response(JSON.stringify({ error: 'Token invalide' }), { status: 401 });
			}

			// Récupérer l'utilisateur depuis l'ID décodé
			const user = await User.findById(decoded.id).select('-password');
			if (!user) {
				return new Response(JSON.stringify({ error: 'Utilisateur non trouvé' }), { status: 404 });
			}

			// Réponse réussie
			return new Response(JSON.stringify({ message: 'Token valide', user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
		}

		// Si aucun des cas n'est valide
		return new Response(JSON.stringify({ error: 'Requête invalide : fournir un token ou des identifiants' }), { status: 400 });
	} catch (err) {
		console.error('Erreur interne :', err);
		return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500 });
	}
}
