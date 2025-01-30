'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

// Créer le contexte CocktailContext
const CocktailContext = createContext();

// Hook personnalisé pour accéder au contexte
export const useCocktails = () => {
	return useContext(CocktailContext);
};

// Provider qui fournit les données du contexte à l'ensemble de l'application
export const CocktailProvider = ({ children }) => {
	// Déclarer tous les états à un niveau supérieur
	const [cocktails, setCocktails] = useState([]);
	const [loading, setLoading] = useState(true);
	const [favorites, setFavorites] = useState([]);
	const [clickedStates, setClickedStates] = useState({}); // Gestion des clics sur les favoris
	const [activeCard, setActiveCard] = useState(null); // Carte active
	const [isVisible, setIsVisible] = useState(false); // Visibilité de l'élément
	const { isFrench } = useLanguage();

	// Fonction pour charger les cocktails et les favoris
	const fetchCocktails = async () => {
		try {
			const response = await fetch('/api/cocktails');
			const data = await response.json();
			if (data.success) {
				setCocktails(data.data); // Met à jour directement les cocktails dans l'état
				return data.data; // Retourne les cocktails pour un usage ultérieur si nécessaire
			} else {
				return [];
			}
		} catch (error) {
			console.error('Erreur lors du chargement des cocktails :', error);
			return [];
		} finally {
			setLoading(false); // Assure-toi que ça passe bien à false
		}
	};

	const fetchFavorites = async () => {
		try {
			const response = await fetch('/api/favorites', { method: 'GET', credentials: 'include' });
			const data = await response.json();

			// Vérifie que `data.favorites` est un tableau valide
			if (Array.isArray(data.favorites)) {
				setFavorites(data.favorites); // Mets à jour les favoris
			} else {
				setFavorites([]); // Si ce n'est pas un tableau, initialise à []
				console.warn('Les favoris retournés ne sont pas valides.');
			}
		} catch (error) {
			console.error('Erreur lors du chargement des favoris :', error);
			setFavorites([]); // En cas d'erreur, initialise à []
		}
	};
	const getLocalizedCocktails = () => {
		return cocktails.map((cocktail) => {
			// Fonction pour récupérer la valeur localisée
			const getLocalizedValue = (field) => {
				if (Array.isArray(field)) {
					// Si c'est un tableau d'objets avec des propriétés 'en' et 'fr'
					return field
						.map((item) => {
							if (typeof item === 'object' && item !== null) {
								return item[isFrench ? 'fr' : 'en'] || ''; // Accède à la valeur locale
							}
							return item || ''; // Retourne l'élément si c'est une chaîne, ou une chaîne vide
						})
						.join(', '); // Joindre avec une virgule (ou autre caractère de séparation)
				}

				// Si c'est un objet avec des clés 'en' et 'fr'
				if (typeof field === 'object' && field !== null) {
					return field[isFrench ? 'fr' : 'en'] || ''; // Accède à la valeur localisée
				}

				// Si c'est une valeur primitive (chaîne, nombre, etc.)
				return field || ''; // Retourne la valeur ou une chaîne vide
			};

			return {
				...cocktail,
				// Applique la localisation à chaque propriété du cocktail
				name: getLocalizedValue(cocktail.name),
				ingredients: cocktail.ingredients.map((ingredient) => ({
					...ingredient,
					name: getLocalizedValue(ingredient.name), // Adaptation des ingrédients
				})),
				instructions: getLocalizedValue(cocktail.instructions),
				category: getLocalizedValue(cocktail.category),
				tags: getLocalizedValue(cocktail.tags),
				glass_type: getLocalizedValue(cocktail.glass_type),
			};
		});
	};

	// Fonction pour sauvegarder un favori
	const saveFavorite = async (cocktailId) => {
		try {
			const response = await fetch('/api/favorites', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ cocktailId }),
				credentials: 'include',
			});

			const result = await response.json();
			if (!response.ok) {
				console.error('Erreur lors de la sauvegarde :', result.error);
			}
		} catch (error) {
			console.error('Erreur réseau :', error);
		}
	};

	const deleteFavorites = async (cocktailId) => {
		try {
			const response = await fetch('/api/favorites', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ cocktailId }),
				credentials: 'include',
			});
			const result = await response.json();
			if (!response.ok) {
				console.error('Erreur lors de la sauvegarde :', result.error);
			}
		} catch (error) {
			console.error('Erreur réseau :', error);
		}
	};

	const toggleClickedState = (cocktailId) => {
		setClickedStates((prevStates) => ({
			...prevStates,
			[cocktailId]: !prevStates[cocktailId],
		}));
	};

	const handleButtonClick = (event, cocktailId) => {
		event.stopPropagation();
		toggleClickedState(cocktailId); // Modifier l'état global de clic
	};

	// Charger les cocktails et les favoris au montage du composant
	useEffect(() => {
		fetchCocktails();
	}, []);

	useEffect(() => {
		fetchFavorites();
	}, []);

	useEffect(() => {
		const initialClickedStates = {};
		favorites.forEach((cocktailId) => {
			initialClickedStates[cocktailId] = true; // Active le bouton pour les favoris
		});
		setClickedStates(initialClickedStates); // Mettez à jour `clickedStates` pour correspondre aux favoris
	}, [favorites]);

	// Gérer la visibilité de la carte active avec un délai
	useEffect(() => {
		if (activeCard !== null) {
			const timer = setTimeout(() => {
				setIsVisible(true);
			}, 500); // Délai de 500 ms

			return () => clearTimeout(timer);
		} else {
			setIsVisible(false);
		}
	}, [activeCard]);

	const handleFavoriteClick = async (event, cocktailIndex) => {
		event.stopPropagation();

		// Récupère l'objet cocktail à partir de l'index
		const cocktail = cocktails[cocktailIndex];
		const cocktailId = cocktail._id;

		if (!cocktailId) {
			console.error('ID de cocktail manquant.');
			return;
		}

		const isFavorited = favorites.includes(cocktailId);

		// Mise à jour optimiste de l'état local pour les favoris
		const updatedFavorites = isFavorited ? favorites.filter((id) => id !== cocktailId) : [...favorites, cocktailId];

		// Mise à jour de `clickedStates`
		setClickedStates((prevState) => ({
			...prevState,
			[cocktailId]: !prevState[cocktailId], // Inverse l'état du bouton
		}));

		// Mise à jour de l'état des favoris
		setFavorites(updatedFavorites);

		try {
			if (isFavorited) {
				await deleteFavorites(cocktailId); // Si déjà favori, on supprime
			} else {
				await saveFavorite(cocktailId); // Sinon on l'ajoute aux favoris
			}
		} catch (error) {
			console.error('Erreur lors de la mise à jour des favoris :', error);

			// Rollback en cas d'erreur
			setFavorites(favorites);
			setClickedStates((prevState) => ({
				...prevState,
				[cocktailId]: prevState[cocktailId], // Annule le changement de l'état du bouton
			}));
		}
	};

	// Gérer le clic sur une carte (active ou inactive)
	const handleCardClick = (cocktailId) => {
		setActiveCard((prevState) => (prevState === cocktailId ? null : cocktailId));
	};

	return (
		<CocktailContext.Provider
			value={{
				cocktails: getLocalizedCocktails(),
				loading,
				favorites,
				setFavorites,
				saveFavorite,
				activeCard,
				setActiveCard,
				toggleClickedState,
				handleCardClick,
				isVisible,
				setIsVisible,
				clickedStates,
				setClickedStates,
				handleButtonClick,
				handleFavoriteClick,
				fetchFavorites,
				getLocalizedCocktails,
			}}
		>
			{children}
		</CocktailContext.Provider>
	);
};
