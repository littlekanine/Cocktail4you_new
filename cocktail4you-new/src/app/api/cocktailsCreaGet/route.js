import dbConnect from '../../../../lib/mongodb';
import CocktailsCreaModel from '../../models/CocktailsCreaModel';
import { NextResponse } from 'next/server';

export async function GET(req) {
	try {
		await dbConnect();

		// Récupérer l'ID de l'utilisateur depuis les paramètres de la requête
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get('userId');

		let cocktails;

		if (userId) {
			// Si un userId est fourni, on filtre les cocktails créés par cet utilisateur
			cocktails = await CocktailsCreaModel.find({ userId });
		} else {
			// Sinon, on récupère tous les cocktails
			cocktails = await CocktailsCreaModel.find({});
		}

		return NextResponse.json({ success: true, data: cocktails });
	} catch (error) {
		console.error('Erreur de connexion à la base de données:', error);
		return NextResponse.json({ success: false, error: 'Échec de la connexion à la base de données' }, { status: 500 });
	}
}
