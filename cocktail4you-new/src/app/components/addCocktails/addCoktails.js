import React, { useState } from 'react';


const AddCocktails = () => {
	const [form, setForm] = useState({
		name: '',
		alcohols: '',
		instructions: '',
		category: '',
		glassType: '',
		decoration: '',
		history: '',
		photo: null,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value,
		});
	};

	const handleFileChange = (e) => {
		setForm({
			...form,
			photo: e.target.files[0],
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Logique pour soumettre le formulaire
		console.log(form);
	};

	return (
		<div>
			<h2>Ajouter un Cocktail</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Nom du Cocktail:</label>
					<input type="text" name="name" value={form.name} onChange={handleChange} required />
				</div>
				<div>
					<label>Alcools et Dosage:</label>
					<input type="text" name="alcohols" value={form.alcohols} onChange={handleChange} required />
				</div>
				<div>
					<label>Instructions:</label>
					<textarea name="instructions" value={form.instructions} onChange={handleChange} required></textarea>
				</div>
				<div>
					<label>Catégorie:</label>
					<input type="text" name="category" value={form.category} onChange={handleChange} required />
				</div>
				<div>
					<label>Type de Verre:</label>
					<input type="text" name="glassType" value={form.glassType} onChange={handleChange} required />
				</div>
				<div>
					<label>Décoration:</label>
					<input type="text" name="decoration" value={form.decoration} onChange={handleChange} optional />
				</div>
				<div>
					<label>Historique:</label>
					<textarea name="history" value={form.history} onChange={handleChange} optional></textarea>
				</div>
				<div>
					<label>Photo:</label>
					<input type="file" name="photo" onChange={handleFileChange} required />
				</div>
				<button type="submit">Ajouter</button>
			</form>
		</div>
	);
};

export default AddCocktails;
