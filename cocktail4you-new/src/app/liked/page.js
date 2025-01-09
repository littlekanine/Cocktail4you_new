'use client';

import { useState, useEffect } from 'react';
import CocktailCard from '../components/cocktailcard/cocktailCard';
import './page.scss';
import '../components/cocktails/cocktails.scss';

const Page = () => {
	const [cocktails, setCocktails] = useState([]); // Tableau des cocktails
	const [favorites, setFavorites] = useState([]); // Tableau des favoris récupérés
	const [clickedStates, setClickedStates] = useState([]); // État des boutons favori (si cliqué ou non)
	const [activeCard, setActiveCard] = useState(null); // Carte active pour l'affichage détaillé
	const [isVisible, setIsVisible] = useState(false); // Contrôle de la visibilité des détails

	// Récupérer les cocktails et les favoris depuis les APIs
	useEffect(() => {
		const fetchCocktails = async () => {
			try {
				const response = await fetch('/api/cocktails');
				const data = await response.json();
				console.log('Cocktails:', data); // Vérifier les cocktails récupérés
				if (data.success && Array.isArray(data.data)) {
					setCocktails(data.data); // Utilisez le tableau de cocktails sous 'data'
				} else {
					console.error('La réponse ne contient pas un tableau valide sous "data":', data);
				}
			} catch (error) {
				console.error('Erreur lors du chargement des cocktails:', error);
			}
		};

		const fetchFavorites = async () => {
			try {
				const response = await fetch('/api/favorites', { method: 'GET', credentials: 'include' });
				const result = await response.json();
				console.log('Favorites:', result); // Vérifier les favoris récupérés
				if (response.ok) {
					setFavorites(result.favorites); // Stocker les favoris dans l'état favorites
				}
			} catch (error) {
				console.error('Erreur lors du chargement des favoris:', error);
			}
		};

		fetchCocktails(); // Charger les cocktails
		fetchFavorites(); // Charger les favoris
	}, []);

	// Fonction pour gérer l'ajout/suppression des favoris (si nécessaire)
	const handleFavoriteClick = (cocktailId) => {
		setClickedStates((prevClickedStates) => (prevClickedStates.includes(cocktailId) ? prevClickedStates.filter((id) => id !== cocktailId) : [...prevClickedStates, cocktailId]));
	};

	// Filtrer les cocktails en fonction des favoris
	const likedCocktails = Array.isArray(cocktails)
		? cocktails.filter((cocktail) => favorites.includes(cocktail._id)) // Comparer directement les IDs (les deux sont des chaînes)
		: [];

	console.log('Liked Cocktails:', likedCocktails); // Afficher les cocktails filtrés

	// Gérer l'activation de la carte
	const handleCardClick = (index) => {
		setActiveCard((prevState) => (prevState === index ? null : index));
	};

	// Gérer l'affichage détaillé
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

	// Affichage des cocktails favoris
	return (
		<div className="flex column gap20">
			<h1 className="flex center title shadow">Mes cocktails favoris</h1>

			<div className="cocktail-list flex center">
				{likedCocktails.length > 0 ? (
					likedCocktails.map((cocktail, index) => (
						<CocktailCard
							key={cocktail._id} // Utilisez un identifiant unique pour chaque carte
							cocktail={cocktail}
							index={index}
							activeCard={activeCard}
							clickedStates={clickedStates}
							handleCardClick={handleCardClick}
							handleButtonClick={handleFavoriteClick}
							isVisible={isVisible}
						/>
					))
				) : (
					<div>Pas de favoris trouvés</div>
				)}
			</div>
		</div>
	);
};

export default Page;
