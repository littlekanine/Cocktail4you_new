import dbConnect from '../../../../lib/mongodb';
import User from '@/app/models/UserModel';

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const token = searchParams.get('token'); // Récupérer le token depuis les paramètres de l'URL
	const id = searchParams.get('id'); // Récupérer l'ID

	console.log('Requête reçue pour la vérification de token :', token);

	if (!token || !id) {
		return new Response(JSON.stringify({ error: 'Token ou ID manquant' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		// Connexion à MongoDB
		await dbConnect();

		// Rechercher un utilisateur avec le token et vérifier qu'il n'est pas expiré
		const user = await User.findOne({
			emailVerificationToken: token,
			emailVerificationExpires: { $gt: Date.now() }, // Vérifie que le token n'a pas expiré
		});

		if (!user) {
			return new Response(JSON.stringify({ error: 'Token invalide ou expiré' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Activer le compte
		user.isEmailVerified = true; // Vous devez avoir ce champ dans votre modèle utilisateur
		user.emailVerificationToken = undefined; // Supprime le token
		user.emailVerificationExpires = undefined; // Supprime l'expiration
		await user.save();

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/verify-issue/success', // Redirection vers la page de succès
			},
		});
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
