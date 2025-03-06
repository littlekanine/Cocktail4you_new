'use client';

import { useState, useEffect } from 'react';
import CocktailCard from '../components/cocktailcard/cocktailCard';
import '../components/cocktailcard/cocktailCard.scss';
import { useAuth } from '../context/AuthContext';
import { useCocktails } from '../context/CocktailContext';
import './page.scss';

const Page = () => {
	const { user } = useAuth();
	const { cocktails, cocktailsCrea, loading, favorites, activeCard, handleCardClick, isVisible, setIsVisible, fetchFavorites } = useCocktails();

	const likedCocktails = [...cocktails, ...cocktailsCrea].filter((cocktail) => favorites.includes(cocktail._id));

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
		<div className="flex widthFull column gap20 padding-top-20">
			<h2 className="flex center title-liked ">Mes cocktails favoris</h2>
			<div className="flex center align-center widthFull">
				<div className="cocktail-list flex center align-center column">
					{loading ? (
						<div>Chargement des favoris...</div>
					) : likedCocktails.length > 0 ? (
						likedCocktails.map((cocktail, index) => (
							<div key={cocktail._id} className="widthFull padding10">
								<CocktailCard
									key={cocktail._id} // Identifiant unique pour chaque carte
									cocktail={cocktail}
									index={index}
									activeCard={activeCard}
									handleCardClick={handleCardClick} // Passer setActiveCard directement ici
									handleButtonClick={(event) => handleButtonClick(event, cocktail._id)}
									isVisible={isVisible}
								/>
							</div>
						))
					) : (
						<div className="flex center align-center">
							<h2 className="flex text-center">Pas de favoris trouvés</h2>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Page;
