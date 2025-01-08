import dbConnect from '../../../../lib/mongodb';
import { verifyToken } from '@/app/utils/verifyToken';
import User from '@/app/models/UserModel';
import { NextResponse } from 'next/server'; // Importation de NextResponse

export async function GET(req) {
	console.log('API reached');

	// Récupérer le token du cookie
	const token = req.cookies.get('access_token');
	const tokenValue = token ? token.value : null;
	console.log('Token:', tokenValue);

	if (!tokenValue) {
		return NextResponse.json({ error: 'Non autorisé, aucun token trouvé' }, { status: 401 });
	}

	try {
		// Vérifie et décode le token
		const decoded = verifyToken(tokenValue);
		console.log('Decoded Token:', decoded);

		// Connexion à la base de données
		await dbConnect();

		// Récupère l'utilisateur à partir de l'ID
		const user = await User.findById(decoded.id).select('-password'); // Exclure le mot de passe des résultats
		console.log('User:', user);

		if (!user) {
			return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
		}

		// Renvoie les données de l'utilisateur
		return NextResponse.json({ user });
	} catch (err) {
		console.error('Erreur lors de la vérification du token :', err);
		return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
	}
}
