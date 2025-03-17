export const runtime = 'nodejs';

import dbConnect from '../../../../lib/mongodb';
import CocktailsCreaModel from '../../models/CocktailsCreaModel';
import { NextResponse } from 'next/server';

export async function GET(req) {
	try {
		await dbConnect();

		const { searchParams } = new URL(req.url);
		const userId = searchParams.get('userId');

		let cocktails;

		if (userId) {
			cocktails = await CocktailsCreaModel.find({ userId });
		} else {
			cocktails = await CocktailsCreaModel.find({});
		}

		return NextResponse.json({ success: true, data: cocktails });
	} catch (error) {
		console.error('Erreur de connexion à la base de données:', error);
		return NextResponse.json({ success: false, error: 'Échec de la connexion à la base de données' }, { status: 500 });
	}
}
