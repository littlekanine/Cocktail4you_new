'use client';

import { useCocktails } from '@/app/context/CocktailContext';
import { useAuth } from '@/app/context/AuthContext';
import CocktailCard from '../cocktailcard/cocktailCard';

const Cocktails = ({ searchTerm }) => {
	const { user } = useAuth();
	const {
		cocktails,
		loading,
		clickedStates,
		activeCard,
		handleCardClick,
		isVisible, // Récupérer la fonction pour gérer l'activation des cartes
	} = useCocktails();

	const filteredCocktails = cocktails.filter((cocktail) => {
		const nameMatch = cocktail.name.toLowerCase().includes(searchTerm.toLowerCase());
		const ingredientMatch = cocktail.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()));
		return nameMatch || ingredientMatch;
	});

	// Afficher un message pendant le chargement
	if (loading) {
		return <div className="deco flex center">Chargement des cocktails...</div>;
	}

	// Afficher un message si aucun cocktail n'est disponible après le filtrage
	if (!filteredCocktails || filteredCocktails.length === 0) {
		return <div className="deco flex center">Aucun cocktail disponible.</div>;
	}

	return (
		<div className="flex column gap20">
			{filteredCocktails.map((cocktail, index) => (
				<CocktailCard
					key={cocktail._id} // Utilisez un identifiant unique pour chaque carte
					cocktail={cocktail}
					index={index}
					activeCard={activeCard}
					clickedStates={clickedStates}
					handleCardClick={handleCardClick} // Passer handleCardClick pour gérer le clic sur la carte
					handleButtonClick={(event) => handleButtonClick(event, index, cocktail._id)} // Passer handleButtonClick pour les favoris
					isVisible={isVisible}
				/>
			))}
		</div>
	);
};

export default Cocktails;
