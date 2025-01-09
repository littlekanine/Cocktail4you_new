import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../models/UserModel';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export async function POST(req) {
	try {
		// Récupérer le token à partir des cookies
		const token = req.cookies.get('access_token')?.value;
		console.log(token);

		await dbConnect();

		// Vérifier si le token est présent
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
		if (!user) {
			return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
		}

		// Assurer que les ObjectId sont correctement convertis en ObjectId
		user.likedCocktails = user.likedCocktails.map((id) => (mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id));

		// Vérifier que l'ID du cocktail est valide
		if (!mongoose.Types.ObjectId.isValid(cocktailId)) {
			return NextResponse.json({ error: 'ID de cocktail invalide' }, { status: 400 });
		}

		const cocktailIdObject = new mongoose.Types.ObjectId(cocktailId); // Assurez-vous que c'est un ObjectId

		// Ajouter ou retirer le cocktail des "likedCocktails"
		if (user.likedCocktails.includes(cocktailIdObject)) {
			// Si déjà aimé, on retire
			user.likedCocktails = user.likedCocktails.filter((id) => id.toString() !== cocktailIdObject.toString());
		} else {
			// Sinon, on l'ajoute
			user.likedCocktails.push(cocktailIdObject);
		}

		// Sauvegarder l'utilisateur avec les nouveaux "likedCocktails"
		await user.save();

		// Retourner la réponse avec la liste des "likedCocktails" mise à jour
		return NextResponse.json({
			message: 'Favoris mis à jour',
			likedCocktails: user.likedCocktails.map((id) => id.toString()), // Retourner les ObjectId sous forme de chaînes
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
}

export async function GET(req) {
	try {
		const token = req.cookies.get('access_token')?.value;
		console.log(token);

		// Connectez à la base de données
		await dbConnect();

		// Vérifiez si le token est présent
		if (!token) {
			return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
		}

		// Décoder le token et vérifier sa validité
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (error) {
			console.error('Erreur JWT:', error.message);
			return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
		}

		// Récupérer l'utilisateur à partir de l'ID du token
		const userId = decoded.id;
		const user = await User.findById(userId);

		// Si l'utilisateur n'existe pas
		if (!user) {
			return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
		}

		// Retourner les favoris de l'utilisateur
		return NextResponse.json({
			message: 'Favoris récupérés',
			favorites: user.likedCocktails.map((id) => id.toString()), // Retourner les ObjectId sous forme de chaînes
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
}
