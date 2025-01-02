import dbConnect from '../../../../lib/mongodb';
import { verifyToken } from '@/app/utils/verifyToken';
import User from '../../models/UserModel';

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Méthode non autorisée' });
	}

	await dbConnect();

	const token = req.cookies.token; // Récupère le token du cookie
	if (!token) {
		return res.status(401).json({ error: 'Non autorisé, aucun token trouvé' });
	}

	try {
		// Vérifie et décode le token
		const decoded = verifyToken(token);

		// Récupère l'utilisateur à partir de l'ID
		const user = await User.findById(decoded.id).select('-password'); // Exclure le mot de passe des résultats

		if (!user) {
			return res.status(404).json({ error: 'Utilisateur non trouvé' });
		}

		// Renvoie les données de l'utilisateur
		return res.status(200).json({ user });
	} catch (err) {
		console.error('Erreur lors de la vérification du token :', err);
		return res.status(401).json({ error: 'Token invalide ou expiré' });
	}
}
