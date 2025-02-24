import mongoose from 'mongoose';

// Schéma pour les décorations
const DecorationSchema = new mongoose.Schema({
	name: { type: String, required: false },
	quantity: { type: Number, required: false },
});

// Schéma pour les ingrédients
const IngredientSchema = new mongoose.Schema({
	name: { type: String, required: true },
	quantity: { type: [Number], required: true }, // Gère à la fois les nombres et les chaînes
	unit: { type: String, required: false },
});

// Schéma principal pour les cocktails
const CocktailCreaSchema = new mongoose.Schema({
	name: { type: String, required: true },
	ingredients: [IngredientSchema], // Liste des ingrédients
	decoration: [DecorationSchema], // Liste des décorations
	instructions: { type: String, required: true },
	category: { type: String, required: true },
	tags: [{ type: String }], // Tableau de tags
	glass_type: { type: String, required: true },
	img: { type: String, required: false }, // Image optionnelle
	notes: { type: String, required: false }, // Notes optionnelles
	history: { type: String, required: false }, // Histoire optionnelle
});

// Création ou récupération du modèle Mongoose
const CocktailsCreaModel = mongoose.models.CocktailsCreaModel || mongoose.model('CocktailsCreaModel', CocktailCreaSchema);

export default CocktailsCreaModel;
