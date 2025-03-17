import mongoose from 'mongoose';

const DecorationSchema = new mongoose.Schema({
	name: { type: String, required: false },
	quantity: { type: Number, required: false },
});

const IngredientSchema = new mongoose.Schema({
	name: { type: String, required: true },
	quantity: { type: Number, required: true },
	unit: { type: String, required: false },
});

const CocktailCreaSchema = new mongoose.Schema({
	name: { type: String, required: true },
	ingredients: [IngredientSchema],
	decoration: [DecorationSchema],
	instructions: { type: String, required: true },
	category: { type: String, required: true },
	tags: [{ type: String }],
	glass_type: { type: String, required: true },
	img: { type: String, required: false },
	notes: { type: String, required: false },
	history: { type: String, required: false },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	createdAt: { type: Date, default: Date.now },
});

const CocktailsCreaModel = mongoose.models.CocktailsCreaModel || mongoose.model('CocktailsCreaModel', CocktailCreaSchema);

export default CocktailsCreaModel;
