// /src/app/api/favorites/route.js
import dbConnect from '../../../../lib/mongodb';
import User from '../../models/UserModel';
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		await dbConnect();
		const { userId, cocktailId } = await req.json();

		if (!userId || !cocktailId) {
			return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
		}

		// Récupérer l'utilisateur
		const user = await User.findById(userId);
		if (!user) {
			return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
		}

		// Ajouter ou retirer le cocktail des favoris
		if (user.favorites && user.favorites.includes(cocktailId)) {
			// Si déjà favori, on retire
			user.favorites = user.favorites.filter((id) => id !== cocktailId);
		} else {
			// Sinon, on l'ajoute
			user.favorites = user.favorites ? [...user.favorites, cocktailId] : [cocktailId];
		}

		await user.save();
		return NextResponse.json({ message: 'Favoris mis à jour', favorites: user.favorites });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
}
