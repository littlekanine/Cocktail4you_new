'use client';

import { useState, useEffect } from 'react';
import CocktailCard from '../components/cocktailcard/cocktailCard';
import './page.scss';
import '../components/cocktails/cocktails.scss';
import { useAuth } from '../context/AuthContext';
import { useCocktails } from '../context/CocktailContext';

const Page = () => {
	const { user } = useAuth();
	const { cocktails, loading, favorites, activeCard, setActiveCard, isVisible, setIsVisible, fetchFavorites } = useCocktails();

	const likedCocktails = cocktails.filter((cocktail) => favorites.includes(cocktail._id));

	// Gérer l'affichage détaillé avec délai
	useEffect(() => {
		if (activeCard !== null) {
			const timer = setTimeout(() => {
				setIsVisible(true);
			}, 500);
			return () => clearTimeout(timer);
		}
		fetchFavorites();
	}, [activeCard]);

	// Assurer la visibilité correcte après désactivation
	useEffect(() => {
		if (activeCard === null) {
			setIsVisible(false);
		}
	}, [activeCard]);

	// Affichage des cocktails favoris
	return (
		<div className="flex column gap20">
			<h1 className="flex center title shadow">Mes cocktails favoris</h1>

			<div className="cocktail-list flex center align-center column gap20">
				{loading ? (
					<div>Chargement des favoris...</div>
				) : likedCocktails.length > 0 ? (
					likedCocktails.map((cocktail, index) => (
						<CocktailCard
							key={cocktail._id} // Identifiant unique pour chaque carte
							cocktail={cocktail}
							index={index}
							activeCard={activeCard}
							handleCardClick={setActiveCard} // Passer setActiveCard directement ici
							handleButtonClick={(event) => handleButtonClick(event, cocktail._id)}
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
