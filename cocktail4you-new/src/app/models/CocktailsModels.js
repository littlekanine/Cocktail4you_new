import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
	name: { type: String, required: true },
	quantity: { type: [Number, String], required: true },
	unit: { type: String, required: false },
});

const CocktailSchema = new mongoose.Schema({
	name: { type: String, required: true },
	ingredients: [IngredientSchema],
	instructions: { type: String, required: true },
	category: { type: String, required: true },
	tags: [{ type: String }],
	glass_type: { type: String, required: true },
	img: { type: String, required: false },
});

const Cocktail = mongoose.models.Cocktail || mongoose.model('Cocktail', CocktailSchema, 'Cocktail4You');

export default Cocktail;
