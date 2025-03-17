import mongoose from 'mongoose';

const DecorationSchema = new mongoose.Schema({
	name: {
		en: { type: String, required: false },
		fr: { type: String, required: false },
	},
	quantity: { type: Number, required: false },
});

const IngredientSchema = new mongoose.Schema({
	name: {
		en: { type: String, required: true },
		fr: { type: String, required: true },
	},
	quantity: { type: [Number, String], required: true },
	unit: {
		en: { type: String, required: false },
		fr: { type: String, required: false },
	},
});

const CocktailSchema = new mongoose.Schema({
	name: {
		en: { type: String, required: true },
		fr: { type: String, required: true },
	},
	ingredients: [IngredientSchema],
	decoration: [DecorationSchema],
	instructions: {
		en: { type: String, required: true },
		fr: { type: String, required: true },
	},
	category: {
		en: { type: String, required: true },
		fr: { type: String, required: true },
	},
	tags: {
		en: [{ type: String }],
		fr: [{ type: String }],
	},
	glass_type: {
		en: { type: String, required: true },
		fr: { type: String, required: true },
	},
	img: { type: String, required: false },
	notes: { type: String, required: false },
	history: {
		en: { type: String, required: false },
		fr: { type: String, required: false },
	},
});

const Cocktail = mongoose.models.Cocktail || mongoose.model('Cocktail', CocktailSchema, 'Cocktail4You');

export default Cocktail;
