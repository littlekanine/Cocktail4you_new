'use client';

import './cocktails.scss';
import Button from '../buttons/Button';
import { useState, useEffect } from 'react';
import { useCocktails } from '@/app/context/CocktailContext';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';

const Cocktails = ({ searchTerm }) => {
	const { user } = useAuth();
	const { cocktails, loading } = useCocktails();
	const [clickedStates, setClickedStates] = useState([]);
	const [activeCard, setActiveCard] = useState(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (cocktails?.length > 0) {
			setClickedStates(Array(cocktails.length).fill(false));
		}
	}, [cocktails]);

	useEffect(() => {
		setActiveCard(null);
		setIsVisible(false);
	}, [searchTerm]);

	const handleCardClick = (index) => {
		setActiveCard((prevState) => (prevState === index ? null : index));
	};

	const saveFavorite = async (cocktailId) => {
		if (!user) {
			alert('Vous devez être connecté pour ajouter un favori.');
			return;
		}

		try {
			const response = await fetch('/api/favorites', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: user._id, cocktailId }),
			});

			const result = await response.json();
			if (!response.ok) {
				console.error('Erreur lors de la sauvegarde :', result.error);
				return;
			}

			alert('Cocktail ajouté à vos favoris !');
		} catch (error) {
			console.error('Erreur de requête :', error);
		}
	};

	const handleButtonClick = (event, index, cocktailId) => {
		event.stopPropagation();

		// Basculer l'état local de l'étoile
		setClickedStates((prevState) => {
			const newStates = [...prevState];
			newStates[index] = !newStates[index];
			return newStates;
		});

		// Sauvegarder le cocktail comme favori
		saveFavorite(cocktailId);
	};
	useEffect(() => {
		if (activeCard !== null) {
			const timer = setTimeout(() => {
				setIsVisible(true);
			}, 500);

			return () => clearTimeout(timer);
		}
	}, [activeCard]);

	useEffect(() => {
		if (activeCard === null) {
			setIsVisible(false);
		}
	}, [activeCard]);

	const filteredCocktails = cocktails.filter((cocktail) => {
		const nameMatch = cocktail.name.toLowerCase().includes(searchTerm.toLowerCase());
		const ingredientMatch = cocktail.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()));
		return nameMatch || ingredientMatch;
	});

	useEffect(() => {}, [filteredCocktails]);

	if (loading) {
		return <div className="deco flex center">Chargement des cocktails...</div>;
	}

	if (!filteredCocktails || filteredCocktails.length === 0) {
		return <div className="deco flex center">Aucun cocktail disponible.</div>;
	}

	return (
		<div className="flex column gap20">
			{filteredCocktails.map((cocktail, index) => {
				// Extrait l'identifiant unique du cocktail
				const cocktailId = cocktail._id; // Assurez-vous que `_id` est bien présent dans vos données

				return (
					<div
						key={cocktailId} // Utilisez cocktailId comme clé unique
						className={`flex gap20 relative ${activeCard === index ? 'column align-center' : activeCard === null ? 'row' : 'hidden'}`}
						onClick={() => handleCardClick(index)}
					>
						{cocktail.img ? (
							<Image
								src={cocktail.img}
								alt={cocktail.name || 'Default Name'}
								className={`card-image shadow ${activeCard === index ? 'expanded' : 'collapsed'}`}
							/>
						) : (
							<p>Aucune image disponible</p>
						)}{' '}
						<div className={`flex row card-info card-info space-between ${activeCard === index ? 'expanded' : 'collapsed'}`}>
							{activeCard !== index ? (
								<div className="flex column center design-card">
									<h1>{cocktail.name}</h1>
									<h2>{cocktail.category}</h2>
									<h3>{cocktail.tags.join(' ')}</h3>
								</div>
							) : (
								<div className="flex column center design-card-expanded heightFull">
									<div
										className={`flex column gap10 scroll cache heightFull ${
											activeCard === index && isVisible ? 'cocktail-info-visible' : ''
										}`}
									>
										<h1 className="flex center">{cocktail.name}</h1>
										<div className="flex row start align-center">
											<div>
												{cocktail.ingredients.map((ingredient, index) => (
													<div key={index}>
														<p>
															{ingredient.name || 'Unknown'} - {ingredient.quantity || ''}{' '}
															{ingredient.unit || ''}
														</p>
													</div>
												))}
											</div>
										</div>
										<p>Recette: {cocktail.instructions}</p>
										<p>Le verre : {cocktail.glass_type}</p>
										<div>
											<p>Décorations :</p>
											{Array.isArray(cocktail.decoration) && cocktail.decoration.length > 0 ? (
												cocktail.decoration.map((decoration, index) => (
													<div key={index} className="deco">
														{decoration.name || 'Inconnu'} - {decoration.quantity || 'N/A'}
													</div>
												))
											) : (
												<p>Aucune décoration disponible.</p>
											)}
										</div>
										<p>{cocktail.history}</p>
									</div>
								</div>
							)}
							<div className="flex heightFull">
								<Button
									onClick={(event) => handleButtonClick(event, index, cocktailId)} // Transmet cocktailId
									icon={
										clickedStates[index] ? (
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
												<path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
											</svg>
										) : (
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="button-star-svg clicked">
												<path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
											</svg>
										)
									}
									className={`button-star-svg transparent ${clickedStates[index] ? 'active' : ''}`}
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Cocktails;
