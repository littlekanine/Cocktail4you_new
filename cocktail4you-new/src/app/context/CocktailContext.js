'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const CocktailContext = createContext();

export const useCocktails = () => {
	return useContext(CocktailContext);
};

export const CocktailProvider = ({ children }) => {
	const [cocktails, setCocktails] = useState([]);
	const [cocktailsCrea, setCocktailsCrea] = useState([]);
	const [loading, setLoading] = useState(true);
	const [favorites, setFavorites] = useState([]);
	const [clickedStates, setClickedStates] = useState({});
	const [activeCard, setActiveCard] = useState(null);
	const [isVisible, setIsVisible] = useState(false);
	const { isFrench } = useLanguage();
	const [userCocktails, setUserCocktails] = useState([]);

	const fetchCocktails = async () => {
		try {
			const response = await fetch('/api/cocktails');
			const data = await response.json();
			if (data.success) {
				setCocktails(data.data);
				return data.data;
			} else {
				return [];
			}
		} catch (error) {
			console.error('Erreur lors du chargement des cocktails :', error);
			return [];
		} finally {
			setLoading(false);
		}
	};

	const fetchCocktailsCrea = async () => {
		try {
			const response = await fetch('/api/cocktailsCreaGet');
			const data = await response.json();
			if (data.success) {
				setCocktailsCrea(data.data);
				return data.data;
			} else {
				return [];
			}
		} catch (error) {
			console.error('Erreur lors du chargement des cocktails :', error);
			return [];
		} finally {
			setLoading(false);
		}
	};

	const fetchFavorites = async () => {
		try {
			const response = await fetch('/api/favorites', { method: 'GET', credentials: 'include' });
			const data = await response.json();

			if (Array.isArray(data.favorites)) {
				setFavorites(data.favorites);
				return data.favorites;
			} else {
				setFavorites([]);
				console.warn('Les favoris retournés ne sont pas valides.');
				return [];
			}
		} catch (error) {
			console.error('Erreur lors du chargement des favoris :', error);
			setFavorites([]);
			return [];
		}
	};

	const getLocalizedCocktails = () => {
		return cocktails.map((cocktail) => {
			const getLocalizedValue = (field) => {
				if (Array.isArray(field)) {
					return field
						.map((item) => {
							if (typeof item === 'object' && item !== null) {
								return item[isFrench ? 'fr' : 'en'] || '';
							}
							return item || '';
						})
						.join(', ');
				}

				if (typeof field === 'object' && field !== null) {
					return field[isFrench ? 'fr' : 'en'] || '';
				}

				return field || '';
			};

			return {
				...cocktail,
				name: getLocalizedValue(cocktail.name),
				ingredients: cocktail.ingredients.map((ingredient) => ({
					...ingredient,
					name: getLocalizedValue(ingredient.name),
				})),
				instructions: getLocalizedValue(cocktail.instructions),
				category: getLocalizedValue(cocktail.category),
				tags: getLocalizedValue(cocktail.tags),
				glass_type: getLocalizedValue(cocktail.glass_type),
			};
		});
	};

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
			setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== cocktailId));

			const response = await fetch('/api/favorites', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ cocktailId }),
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Erreur lors de la suppression du favori.');
			}
		} catch (error) {
			console.error('Erreur réseau :', error);

			setFavorites((prevFavorites) => [...prevFavorites, cocktailId]);
		}
	};

	async function fetchUserCocktails(userId) {
		try {
			const url = userId ? `/api/cocktailsCreaGet?userId=${userId}` : '/api/cocktailsCreaGet';
			const res = await fetch(url);
			const data = await res.json();

			if (data.success) {
				setUserCocktails(data.data);
			} else {
				console.error('Erreur:', data.error);
			}
		} catch (error) {
			console.error('Erreur de récupération des cocktails:', error);
		}
	}

	const toggleClickedState = (cocktailId) => {
		setClickedStates((prevStates) => ({
			...prevStates,
			[cocktailId]: !prevStates[cocktailId],
		}));
	};

	const handleButtonClick = (event, cocktailId) => {
		event.stopPropagation();
		toggleClickedState(cocktailId);
	};

	useEffect(() => {
		fetchCocktails();
	}, []);

	useEffect(() => {
		fetchFavorites();
	}, []);

	useEffect(() => {
		fetchCocktailsCrea();
	}, []);

	useEffect(() => {
		const initialClickedStates = {};
		favorites.forEach((cocktailId) => {
			initialClickedStates[cocktailId] = true;
		});
		setClickedStates(initialClickedStates);
	}, [favorites]);

	useEffect(() => {
		if (activeCard !== null) {
			const timer = setTimeout(() => {
				setIsVisible(true);
			}, 500);

			return () => clearTimeout(timer);
		} else {
			setIsVisible(false);
		}
	}, [activeCard]);

	const handleFavoriteClick = async (event, cocktailId) => {
		event.stopPropagation();

		const cocktail = cocktails.find((c) => c._id === cocktailId) || cocktailsCrea.find((c) => c._id === cocktailId);
		if (!cocktail || !cocktailId) {
			console.error('ID de cocktail manquant.');
			return;
		}

		const isFavorited = favorites.includes(cocktailId);
		const previousClickedStates = { ...clickedStates };

		setClickedStates((prev) => ({ ...prev, [cocktailId]: !isFavorited }));

		try {
			if (isFavorited) {
				await deleteFavorites(cocktailId);
				setFavorites((prev) => prev.filter((id) => id !== cocktailId));
			} else {
				await saveFavorite(cocktailId);
				setFavorites((prev) => [...prev, cocktailId]);
			}
		} catch (error) {
			console.error('Erreur lors de la mise à jour des favoris :', error);
			setClickedStates(previousClickedStates);
		}
	};

	const handleCardClick = (cocktailId) => {
		const scrollPosition = window.scrollY;
		setActiveCard((prevState) => {
			const newState = prevState === cocktailId ? null : cocktailId;
			window.scrollTo(0, scrollPosition);
			return newState;
		});
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
				fetchCocktailsCrea,
				cocktailsCrea,
				setCocktailsCrea,
				getLocalizedCocktails,
				fetchUserCocktails,
				userCocktails,
			}}
		>
			{children}
		</CocktailContext.Provider>
	);
};
