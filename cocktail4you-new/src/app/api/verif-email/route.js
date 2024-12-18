import dbConnect from '../../../../lib/mongodb';
import User from './userModel'; // Assure-toi que le chemin vers ton modèle utilisateur est correct

export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url);
		const token = searchParams.get('token');

		// Connexion à MongoDB
		await dbConnect();

		// Trouver l'utilisateur par le token
		const user = await User.findOne({
			emailVerificationToken: token,
			emailVerificationExpires: { $gt: Date.now() }, // Vérifie si le token n'a pas expiré
		});

		if (!user) {
			return new Response(JSON.stringify({ error: 'Lien invalide ou expiré' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		// Mettre à jour l'état de l'utilisateur
		user.isEmailVerified = true;
		user.emailVerificationToken = undefined;
		user.emailVerificationExpires = undefined;
		await user.save();

		return new Response(JSON.stringify({ message: 'Email confirmé avec succès' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	}
}
