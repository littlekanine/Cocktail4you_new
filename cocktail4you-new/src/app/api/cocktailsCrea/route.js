import dbConnect from '../../../../lib/mongodb';
import CocktailsCreaModel from '../../models/CocktailsCreaModel';
import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		await dbConnect();
		console.log('Requête reçue:', req);

		const body = await req.json();
		console.log('Body received:', body);

		if (!body.name || !body.ingredients || !body.instructions || !body.category || !body.glass_type || !body.img) {
			console.error('❌ Données incomplètes:', body);
			return NextResponse.json({ success: false, error: 'Données incomplètes' }, { status: 400 });
		}

		const newCocktail = new CocktailsCreaModel(body);
		console.log('Nouveau cocktail:', newCocktail);

		await newCocktail.save();

		return NextResponse.json({ success: true, data: newCocktail }, { status: 201 });
	} catch (error) {
		console.error("Erreur lors de l'ajout du cocktail:", error);
		return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
	}
}
