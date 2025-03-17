export const runtime = 'nodejs';

import dbConnect from '../../../../lib/mongodb';
import CocktailsCreaModel from '../../models/CocktailsCreaModel';
import moment from 'moment';
import { NextResponse } from 'next/server';

const MAX_COCKTAILS_PER_DAY = 3;

const checkCocktailCreationLimit = async (userId) => {
	const todayStart = moment().startOf('day').toDate();
	const todayEnd = moment().endOf('day').toDate();

	const cocktailsToday = await CocktailsCreaModel.find({
		userId: userId,
		createdAt: { $gte: todayStart, $lt: todayEnd },
	});

	if (cocktailsToday.length >= MAX_COCKTAILS_PER_DAY) {
		throw new Error("Tu as atteint la limite de créations de cocktails pour aujourd'hui.");
	}
};

export async function POST(req) {
	try {
		await dbConnect();

		const body = await req.json();

		const userId = req.headers.get('user-id');
		if (!userId) {
			return NextResponse.json({ success: false, error: 'Utilisateur non authentifié' }, { status: 401 });
		}

		await checkCocktailCreationLimit(userId);

		if (!body.name || !body.ingredients || !body.instructions || !body.category || !body.glass_type || !body.img) {
			console.error('❌ Données incomplètes:', body);
			return NextResponse.json({ success: false, error: 'Données incomplètes' }, { status: 400 });
		}

		const newCocktail = new CocktailsCreaModel({
			...body,
			userId: userId,
		});

		await newCocktail.save();

		return NextResponse.json({ success: true, data: newCocktail }, { status: 201 });
	} catch (error) {
		console.error("Erreur lors de l'ajout du cocktail:", error.message);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
