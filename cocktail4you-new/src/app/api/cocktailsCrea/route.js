import dbConnect from '../../../../lib/mongodb';
import CocktailsCreaModel from '../../models/CocktailsCreaModel';
import moment from 'moment';
import { NextResponse } from 'next/server';

// Limite de création de cocktails par jour (par exemple, 3 cocktails par jour)
const MAX_COCKTAILS_PER_DAY = 3;

// Fonction pour vérifier la limite de création
const checkCocktailCreationLimit = async (userId) => {
	const todayStart = moment().startOf('day').toDate(); // Début de la journée (minuit)
	const todayEnd = moment().endOf('day').toDate(); // Fin de la journée (23h59)

	// Récupère tous les cocktails créés aujourd'hui par cet utilisateur
	const cocktailsToday = await CocktailsCreaModel.find({
		userId: userId, // On filtre par l'ID de l'utilisateur
		createdAt: { $gte: todayStart, $lt: todayEnd },
	});

	// Si l'utilisateur a dépassé la limite, renvoie une erreur
	if (cocktailsToday.length >= MAX_COCKTAILS_PER_DAY) {
		throw new Error("Tu as atteint la limite de créations de cocktails pour aujourd'hui.");
	}
};

export async function POST(req) {
	try {
		await dbConnect();
		console.log('Requête reçue:', req);

		const body = await req.json();
		console.log('Body received:', body);

		// On s'attend à ce que l'utilisateur soit authentifié et qu'on ait un ID utilisateur
		const userId = req.headers.get('user-id');
		console.log('User ID:', userId);
		if (!userId) {
			return NextResponse.json({ success: false, error: 'Utilisateur non authentifié' }, { status: 401 });
		}

		// Vérifier la limite de création de cocktails
		await checkCocktailCreationLimit(userId);

		// Vérifier les données envoyées
		if (!body.name || !body.ingredients || !body.instructions || !body.category || !body.glass_type || !body.img) {
			console.error('❌ Données incomplètes:', body);
			return NextResponse.json({ success: false, error: 'Données incomplètes' }, { status: 400 });
		}

		// Ajouter l'ID de l'utilisateur au cocktail créé
		const newCocktail = new CocktailsCreaModel({
			...body,
			userId: userId, // Ajout de l'ID de l'utilisateur
		});

		console.log('Nouveau cocktail:', newCocktail);

		await newCocktail.save();

		return NextResponse.json({ success: true, data: newCocktail }, { status: 201 });
	} catch (error) {
		console.error("Erreur lors de l'ajout du cocktail:", error.message);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
