export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../models/UserModel';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export async function POST(req) {
	try {
		const token = req.cookies.get('access_token')?.value;

		await dbConnect();

		if (!token) {
			return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
		}

		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (error) {
			console.error('Erreur JWT:', error.message);
			return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
		}

		const userId = decoded.id;
		const { cocktailId } = await req.json();

		const user = await User.findById(userId);
		if (!user) {
			return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
		}

		user.likedCocktails = user.likedCocktails.map((id) => (id instanceof mongoose.Types.ObjectId ? id : new mongoose.Types.ObjectId(id)));
		if (!mongoose.Types.ObjectId.isValid(cocktailId)) {
			return NextResponse.json({ error: 'ID de cocktail invalide' }, { status: 400 });
		}

		const cocktailIdObject = new mongoose.Types.ObjectId(cocktailId);

		if (user.likedCocktails.includes(cocktailIdObject)) {
			user.likedCocktails = user.likedCocktails.filter((id) => id.toString() !== cocktailIdObject.toString());
		} else {
			user.likedCocktails.push(cocktailIdObject);
		}

		await user.save();

		return NextResponse.json({
			message: 'Favoris mis à jour',
			likedCocktails: user.likedCocktails.map((id) => id.toString()),
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
}

export async function GET(req) {
	try {
		const token = req.cookies.get('access_token')?.value;

		await dbConnect();

		if (!token) {
			return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
		}

		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (error) {
			console.error('Erreur JWT:', error.message);
			return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
		}

		const userId = decoded.id;
		const user = await User.findById(userId);

		if (!user) {
			return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
		}

		return NextResponse.json({
			message: 'Favoris récupérés',
			favorites: user.likedCocktails.map((id) => id.toString()),
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
}

export async function DELETE(req) {
	try {
		const token = req.cookies.get('access_token')?.value;

		await dbConnect();

		if (!token) {
			return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
		}

		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (error) {
			console.error('Erreur JWT:', error.message);
			return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
		}

		const userId = decoded.id;
		const { cocktailId } = await req.json();

		const user = await User.findById(userId);
		if (!user) {
			return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
		}

		if (!mongoose.Types.ObjectId.isValid(cocktailId)) {
			return NextResponse.json({ error: 'ID de cocktail invalide' }, { status: 400 });
		}

		const cocktailIdObject = new mongoose.Types.ObjectId(cocktailId);

		user.likedCocktails = user.likedCocktails.filter((id) => id.toString() !== cocktailIdObject.toString());

		await user.save();

		return NextResponse.json({
			message: 'Favori supprimé',
			likedCocktails: user.likedCocktails.map((id) => id.toString()),
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
}
