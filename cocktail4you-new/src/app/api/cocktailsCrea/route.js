import dbConnect from "../../../../lib/mongodb";
import CocktailsCrea from "../../../app/models/CocktailsCreaModel";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		await dbConnect();

		const body = await req.json();

		const newCocktail = new CocktailsCrea(body);

		await newCocktail.save();

		return NextResponse.json({ success: true, data: newCocktail }, { status: 201 });

	} catch (error) {
		console.error("Erreur lors de l'ajout du cocktail:", error);
		return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
	}
}
