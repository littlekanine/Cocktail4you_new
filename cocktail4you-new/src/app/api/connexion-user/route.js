import dbConnect from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/UserModel';

export async function POST(req) {
	try {
		// Récupérer les cookies depuis l'entête de la requête
		const cookies = req.headers.get('cookie'); // Récupère les cookies de l'entête HTTP
		let token = null;

		// Vérifier si le cookie 'token' existe
		if (cookies) {
			const cookie = cookies.split(';').find((cookie) => cookie.trim().startsWith('token='));
			if (cookie) {
				token = cookie.split('=')[1]; // Extraire la valeur du cookie
				console.log('mon enculé de :', token);
			}
		}

		if (!token) {
			return new Response(JSON.stringify({ error: 'Token non trouvé dans les cookies' }), { status: 401 });
		}

		// Vérifier et décode le token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log('Decoded Token:', decoded);

		// Connexion à la base de données
		await dbConnect();

		// Récupérer l'utilisateur à partir de l'ID extrait du token
		const user = await User.findById(decoded.id).select('-password'); // Exclure le mot de passe
		console.log('User:', user);

		if (!user) {
			return new Response(JSON.stringify({ error: 'Utilisateur non trouvé' }), { status: 404 });
		}

		// Renvoie les données de l'utilisateur
		return new Response(JSON.stringify({ message: 'Connexion réussie', redirectTo: '/user-space' }), {
			status: 200, // Change de 302 à 200 pour éviter la redirection
			headers: {
				'Set-Cookie': `auth_token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`,
				'Content-Type': 'application/json',
			},
		});
	} catch (err) {
		console.error('Erreur lors de la vérification du token :', err);
		return new Response(JSON.stringify({ error: 'Token invalide ou expiré' }), { status: 401 });
	}
}
