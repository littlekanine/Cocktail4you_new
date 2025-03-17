export const runtime = 'nodejs';

import dbConnect from '../../../../lib/mongodb';
import CocktailsModels from '../../models/CocktailsModels';
import { NextResponse } from 'next/server';

export async function GET(req) {
	try {
		await dbConnect();

		const cocktails = await CocktailsModels.find({});

		return NextResponse.json({ success: true, data: cocktails });
	} catch (error) {
		console.error('Erreur de connexion à la base de données:', error);
		return NextResponse.json({ success: false, error: 'Échec de la connexion à la base de données' }, { status: 500 });
	}
}
