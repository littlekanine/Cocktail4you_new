'use client';

import './cocktails.scss';
import { useState, useEffect } from 'react';
import { useCocktails } from '@/app/context/CocktailContext';
import { useAuth } from '@/app/context/AuthContext';
import CocktailCard from '../cocktailcard/cocktailCard'; // Assurez-vous que l'importation est correcte

const Cocktails = ({ searchTerm }) => {
	const { user } = useAuth();
	const { cocktails, loading } = useCocktails();
	const [clickedStates, setClickedStates] = useState([]);
	const [activeCard, setActiveCard] = useState(null);
	const [isVisible, setIsVisible] = useState(false);

	// Récupérer les favoris de l'utilisateur
	useEffect(() => {
		if (user) {
			const fetchFavorites = async () => {
				try {
					const response = await fetch('/api/favorites', { method: 'GET', credentials: 'include' });
					const result = await response.json();
					if (response.ok) {
						// Mettre à jour l'état clickedStates en fonction des favoris
						setClickedStates(cocktails.map((cocktail) => result.favorites.includes(cocktail._id.toString())));
					}
				} catch (error) {
					console.error('Erreur lors du chargement des favoris:', error);
				}
			};

			fetchFavorites();
		}
	}, [user, cocktails]);

	// Réinitialiser clickedStates lorsque les cocktails sont chargés
	useEffect(() => {
		if (cocktails?.length > 0) {
			setClickedStates(Array(cocktails.length).fill(false));
		}
	}, [cocktails]);

	// Effet pour réinitialiser l'affichage détaillé lorsque le searchTerm change
	useEffect(() => {
		setActiveCard(null);
		setIsVisible(false);
	}, [searchTerm]);

	const handleCardClick = (index) => {
		setActiveCard((prevState) => (prevState === index ? null : index));
	};

	// Sauvegarder un favori
	const saveFavorite = async (cocktailId) => {
		if (!user) {
			alert('Vous devez être connecté pour ajouter un favori.');
			return;
		}

		try {
			const response = await fetch('/api/favorites', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ cocktailId }),
				credentials: 'include', // Permet d'inclure les cookies dans la requête
			});

			const result = await response.json();
			if (!response.ok) {
				console.error('Erreur lors de la sauvegarde :', result.error);
				return;
			}
		} catch (error) {
			console.error('Erreur de requête :', error);
		}
	};

	// Gérer le clic sur le bouton favori
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

	// Gérer la visibilité des informations détaillées
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

	// Filtrer les cocktails en fonction du searchTerm
	const filteredCocktails = cocktails.filter((cocktail) => {
		const nameMatch = cocktail.name.toLowerCase().includes(searchTerm.toLowerCase());
		const ingredientMatch = cocktail.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()));
		return nameMatch || ingredientMatch;
	});

	if (loading) {
		return <div className="deco flex center">Chargement des cocktails...</div>;
	}

	if (!filteredCocktails || filteredCocktails.length === 0) {
		return <div className="deco flex center">Aucun cocktail disponible.</div>;
	}

	// Affichage des cocktails filtrés
	return (
		<div className="flex column gap20">
			{filteredCocktails.map((cocktail, index) => (
				<CocktailCard
					key={cocktail._id} // Utilisez un identifiant unique pour chaque carte
					cocktail={cocktail}
					index={index}
					activeCard={activeCard}
					clickedStates={clickedStates}
					handleCardClick={handleCardClick}
					handleButtonClick={handleButtonClick}
					isVisible={isVisible}
				/>
			))}
		</div>
	);
};

export default Cocktails;
