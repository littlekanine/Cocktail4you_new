import React, { useState } from 'react';
import './addCocktails.scss';
import FileUpload from '../fileUpload/fileUpload';
import { useCocktails } from '@/app/context/CocktailContext';
import { useCrea } from '@/app/context/PostCocktailsContext';
import { set } from 'mongoose';

const AddCocktails = ({ onClose }) => {
	const [form, setForm] = useState({
		name: '',
		ingredients: [{ name: '', quantity: '', unit: 'ml' }], // ✅ Tableau par défaut
		instructions: '',
		category: '',
		glassType: '',
		decoration: [{ name: '', quantity: '' }], // ✅ Tableau par défaut
		history: '',
		photo: '',
	});

	const { postCocktail } = useCrea();

	const { isFrench } = useCocktails();

	const [tags, setTags] = useState(['']);

	const categories = ['Classique', 'Tendance', 'Création', 'Sans Alcool'];
	const cocktailGlasses = [
		'Verre à Martini',
		'Highball',
		'Old Fashioned (Lowball)',
		'Verre à Margarita',
		'Flûte à Champagne',
		'Verre à Tiki',
		'Verre Collins',
		'Coupette',
		'Verre à Irish Coffee',
	];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value,
		});
	};

	const handleChangeTags = (index, e) => {
		const newTags = [...tags];
		newTags[index] = e.target.value;
		setTags(newTags);
	};

	const addTag = () => {
		setTags([...tags, '']);
	};

	const removeTag = (index) => {
		if (tags.length > 1) {
			setTags(tags.filter((_, i) => i !== index));
		}
	};

	const handleFileChange = async (e) => {
		const file = e.target.files[0];

		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch('/api/uploadImgAws', {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();

			if (data.success) {
				setForm({
					...form,
					photo: data.url, // Stocker l'URL de l'image S3
				});
			} else {
				console.error("Erreur lors de l'upload :", data.error);
			}
		} catch (error) {
			console.error("Erreur de connexion à l'API upload :", error);
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const { glassType, ...rest } = form;

		const cocktailData = {
			...rest,
			ingredients,
			decoration: decorations,
			glass_type: glassType,
			img: form.photo,
			tags: tags.filter((tag) => tag.trim() !== ''),
		};

		console.log('Données envoyées :', cocktailData);
		postCocktail(cocktailData);

		setForm({
			name: '',
			instructions: '',
			category: '',
			glassType: '',
			history: '',
			photo: '',
		});

		setIngredients([{ name: '', quantity: '', unit: 'ml' }]);
		setDecorations([{ name: '', quantity: '' }]);
		setTags(['']);
	};

	const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: 'ml' }]);
	const [decorations, setDecorations] = useState([{ name: '', quantity: '' }]);

	// 🔄 Mettre à jour un input en fonction de son index
	const handleChangeIngredient = (index, event) => {
		const { name, value } = event.target;
		const newIngredients = [...ingredients];

		newIngredients[index] = {
			...newIngredients[index],
			[name]: value, // Met à jour soit "name", soit "quantity"
		};

		setIngredients(newIngredients);
	};

	const handleChangeDecoration = (index, event) => {
		const { name, value } = event.target;
		const newDecorations = [...decorations];

		newDecorations[index] = {
			...newDecorations[index],
			[name]: value, // Met à jour soit "name", soit "quantity"
		};

		setDecorations(newDecorations);
	};

	// ➕ Ajouter un nouvel input vide
	const addAlcohol = () => {
		setIngredients([...ingredients, { name: '', quantity: '', unit: 'ml' }]);
	};

	const removeAlcohol = (index) => {
		if (ingredients.length > 1) {
			const newAlcohols = ingredients.filter((_, i) => i !== index);
			setIngredients(newAlcohols);
		}
	};

	const addDecoration = () => {
		setDecorations([...decorations, { name: '', quantity: '' }]);
	};

	const removeDecoration = (index) => {
		if (decorations.length > 1) {
			const newDecorations = decorations.filter((_, i) => i !== index);
			setDecorations(newDecorations);
		}
	};

	return (
		<div className="flex center align center column gap20 containerAdd relative widthFull">
			<button className="closeButton" onClick={onClose}>
				×
			</button>
			{isFrench ? (
				<h2 className="titleAddCocktail flex center align-center ">Ajouter un Cocktail</h2>
			) : (
				<h2 className="titleAddCocktail flex center align-center ">Add a Cocktail</h2>
			)}

			<form className="flex center align-center column gap10" onSubmit={handleSubmit}>
				<div className=" flex column gap5 width90">
					<label className="textAddCocktails">Nom du Cocktail :</label>
					<input className="flex padding10  font20" type="text" name="name" value={form.name} onChange={handleChange} required />
				</div>
				<div className="flex  column gap5 width90 ">
					<label>Alcools et Dosage :</label>
					{ingredients.map((ingredient, index) => (
						<div key={index} className="flex  gap10">
							<div className="flex center row align-center gap10">
								{/* Input pour le nom de l'alcool */}
								<input
									type="text"
									name="name"
									value={ingredient.name}
									placeholder="Alcool"
									onChange={(e) => handleChangeIngredient(index, e)}
									required
									className="inputAlcohol flex padding10  font20"
								/>

								{/* Input pour le dosage */}
								<input
									type="number"
									name="quantity"
									placeholder="40"
									value={ingredient.quantity ?? ''}
									onChange={(e) => handleChangeIngredient(index, e)}
									required
									className="inputAlcohol flex padding10  font20"
								/>

								<p className="ml">ml</p>
							</div>
							{ingredients.length > 1 && (
								<button type="button" className="button-" onClick={() => removeAlcohol(index)}>
									-
								</button>
							)}
						</div>
					))}
					<button className="flex center align-center buttonAddAlcohol" onClick={addAlcohol}>
						+
					</button>
				</div>
				<div className=" flex column gap5 width90">
					<label>Instructions :</label>
					<textarea className="flex no-resize padding10  font20" name="instructions" value={form.instructions} onChange={handleChange} required></textarea>
				</div>
				<div className=" flex column gap5 width90">
					<label>Catégorie :</label>
					<select className="flex padding10 font20" name="category" value={form.category} onChange={handleChange} required>
						<option value="" disabled>
							Choisir une catégorie
						</option>
						{categories.map((category, index) => (
							<option key={index} value={category}>
								{category}
							</option>
						))}
					</select>{' '}
				</div>
				<div className=" flex column gap5 width90">
					<label>Type de Verre :</label>
					<select className="flex padding10 font20" name="glassType" value={form.glassType} onChange={handleChange} required>
						<option value="" disabled>
							Choisir un verre
						</option>
						{cocktailGlasses.map((glass, index) => (
							<option key={index} value={glass}>
								{glass}
							</option>
						))}
					</select>
				</div>
				<div className="flex column gap5 width90">
					<label>Décorations et Quantité :</label>
					{decorations.map((decoration, index) => (
						<div key={index} className="flex gap10">
							<div className="flex row align-center gap10">
								{/* Input pour le nom de la décoration */}
								<input
									type="text"
									name="name"
									value={decoration.name}
									placeholder="Décoration"
									onChange={(e) => handleChangeDecoration(index, e)}
									required
									className="inputAlcohol flex padding10 font20"
								/>

								{/* Input pour la quantité */}
								<input
									type="number"
									name="quantity"
									placeholder="Quantité"
									value={decoration.quantity}
									onChange={(e) => handleChangeDecoration(index, e)}
									required
									className="inputQuantite flex padding10 font20"
								/>
							</div>
							{decorations.length > 1 && (
								<button type="button" className="button-" onClick={() => removeDecoration(index)}>
									-
								</button>
							)}
						</div>
					))}
					<button className="flex center align-center buttonAddAlcohol" onClick={addDecoration}>
						+
					</button>
				</div>

				<div className="flex column gap5 width90">
					<label>Tags :</label>
					{tags.map((tag, index) => (
						<div key={index} className="flex gap10">
							<input type="text" value={tag} placeholder="Tag" onChange={(e) => handleChangeTags(index, e)} className="inputTag flex padding10 font20" />
							{tags.length > 1 && (
								<button type="button" className="button-" onClick={() => removeTag(index)}>
									-
								</button>
							)}
						</div>
					))}
					<button type="button" className="flex center align-center buttonAddAlcohol" onClick={addTag}>
						+
					</button>
				</div>

				<div className=" flex column gap5 width90">
					<label>Historique :</label>
					<textarea type="text" className="flex padding10  font20  no-resize" name="history" value={form.history} onChange={handleChange} optional></textarea>
				</div>
				<div className=" flex column gap5 width90">
					<FileUpload handleFileChange={handleFileChange} />
				</div>
				<button type="submit" className="buttonAddCocktail">
					Ajouter
				</button>
			</form>
		</div>
	);
};

export default AddCocktails;
