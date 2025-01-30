import mongoose from 'mongoose';

// Schéma pour les décorations
const DecorationSchema = new mongoose.Schema({
	name: {
		en: { type: String, required: false },
		fr: { type: String, required: false },
	},
	quantity: { type: Number, required: false },
});

// Schéma pour les ingrédients
const IngredientSchema = new mongoose.Schema({
	name: {
		en: { type: String, required: true },
		fr: { type: String, required: true },
	},
	quantity: { type: [Number, String], required: true }, // Gère à la fois les nombres et les chaînes
	unit: {
		en: { type: String, required: false },
		fr: { type: String, required: false },
	},
});

// Schéma principal pour les cocktails
const CocktailSchema = new mongoose.Schema({
	name: {
		en: { type: String, required: true },
		fr: { type: String, required: true },
	},
	ingredients: [IngredientSchema], // Liste des ingrédients
	decoration: [DecorationSchema], // Liste des décorations
	instructions: {
		en: { type: String, required: true },
		fr: { type: String, required: true },
	},
	category: {
		en: { type: String, required: true },
		fr: { type: String, required: true },
	},
	tags: {
		en: [{ type: String }], // Tableau de tags en anglais
		fr: [{ type: String }], // Tableau de tags en français
	},
	glass_type: {
		en: { type: String, required: true },
		fr: { type: String, required: true },
	},
	img: { type: String, required: false }, // Image optionnelle
	notes: { type: String, required: false }, // Notes optionnelles
	history: {
		en: { type: String, required: false },
		fr: { type: String, required: false },
	}, // Histoire optionnelle
});

// Création ou récupération du modèle Mongoose
const Cocktail = mongoose.models.Cocktail || mongoose.model('Cocktail', CocktailSchema, 'Cocktail4You');

export default Cocktail;
