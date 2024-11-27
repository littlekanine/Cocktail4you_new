import mongoose from 'mongoose';

// Schéma pour l'ingrédient
const IngredientSchema = new mongoose.Schema({
	name: { type: String, required: true }, // Nom de l'ingrédient
	quantity: { type: Number, required: true }, // Quantité de l'ingrédient
	unit: { type: String, required: true }, // Unité de mesure (ml, Barspoon, etc.)
});

// Schéma principal du cocktail
const CocktailSchema = new mongoose.Schema({
	name: { type: String, required: true }, // Nom du cocktail
	ingredients: [IngredientSchema], // Liste des ingrédients
	instructions: { type: String, required: true }, // Instructions pour préparer le cocktail
	category: { type: String, required: true }, // Catégorie du cocktail (par exemple "Short Drink")
	tags: [{ type: String }], // Liste des tags (par exemple ["Sweet", "Nutty"])
	glass_type: { type: String, required: true }, // Type de verre (par exemple "Old Fashioned glass")
	img: { type: String, required: true }, // URL de l'image du cocktail
});

// Création du modèle à partir du schéma
const Cocktail = mongoose.models.Cocktail || mongoose.model('Cocktail', CocktailSchema);

export default Cocktail;
