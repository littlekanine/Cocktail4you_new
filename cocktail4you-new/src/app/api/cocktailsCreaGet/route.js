import dbConnect from "../../../../lib/mongodb";
import CocktailsCreaModel from "@/app/models/CocktailsCreaModel";
import { NextResponse } from "next/server";

export async function Get(req) {
    try {
        await dbConnect();
        const cocktails = await CocktailsCreaModel.find({});
        return NextResponse.json({ success: true, data: cocktails });
    } catch (error) {
        console.error("Erreur de connexion à la base de données:", error);
        return NextResponse.json(
            { success: false, error: "Échec de la connexion à la base de données" },
            { status: 500 }
        );
    }
}

