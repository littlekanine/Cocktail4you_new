import mongoose from 'mongoose';

// Schéma pour les décorations
const DecorationSchema = new mongoose.Schema({
	name: { type: String, required: false },
	quantity: { type: Number, required: false },
});

// Schéma pour les ingrédients
const IngredientSchema = new mongoose.Schema({
	name: { type: String, required: true },
	quantity: { type: [Number, String], required: true }, // Gère à la fois les nombres et les chaînes
	unit: { type: String, required: false },
});

// Schéma principal pour les cocktails
const CocktailSchema = new mongoose.Schema({
	name: { type: String, required: true },
	ingredients: [IngredientSchema], // Liste des ingrédients
	decoration: [DecorationSchema], // Liste des décorations
	instructions: { type: String, required: true },
	category: { type: String, required: true },
	tags: [{ type: String }], // Tableau de tags
	glass_type: { type: String, required: true },
	img: { type: String, required: true }, // Image optionnelle
	notes: { type: String, required: false }, // Notes optionnelles
	history: { type: String, required: false }, // Histoire optionnelle
});

// Création ou récupération du modèle Mongoose
const Cocktail = mongoose.models.Cocktail || mongoose.model('Cocktail', CocktailSchema, 'CocktailCrea');

export default Cocktail;
