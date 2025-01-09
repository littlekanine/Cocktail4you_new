import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../models/UserModel';
import jwt from 'jsonwebtoken';

export async function POST(req) {
	try {
		const token = req.cookies.get('access_token').value;
		console.log(token);

		await dbConnect();

		if (!token) {
			return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
		}

		// Décoder le token et vérifier sa validité
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (error) {
			console.error('Erreur JWT:', error.message); // Voir le message d'erreur
			return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
		}

		// Récupérer l'utilisateur à partir de l'ID du token
		const userId = decoded.id;
		const { cocktailId } = await req.json();

		const user = await User.findById(userId);

		console.log(typeof cocktailId); // Devrait être 'object' (pour un ObjectId)
		console.log(user.likedCocktails.map((id) => typeof id));

		if (!user) {
			return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
		}

		// Ajouter ou retirer le cocktail des "likedCocktails"
		if (user.likedCocktails && user.likedCocktails.includes(cocktailId)) {
			// Si déjà aimé, on retire
			user.likedCocktails = user.likedCocktails.filter((id) => id.toString() !== cocktailId.toString());
			console.log('Nouveaux favoris après modification :', user.likedCocktails);
		} else {
			// Sinon, on l'ajoute
			user.likedCocktails = user.likedCocktails ? [...user.likedCocktails, cocktailId] : [cocktailId];
		}

		// Sauvegarder l'utilisateur avec les nouveaux "likedCocktails"
		await user.save();
		return NextResponse.json({ message: 'Favoris mis à jour', favorites: user.favorites });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
}
