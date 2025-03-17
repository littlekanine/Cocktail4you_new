'use client';

import { useCocktails } from '../../context/CocktailContext';
import CocktailCard from '../cocktailcard/cocktailCard';
import CocktailCardCrea from '../cocktailcard/cocktailCardCrea';

const Cocktails = ({ searchTerm, selectedCategory }) => {
	const { cocktails, cocktailsCrea, loading, clickedStates, activeCard, handleCardClick, isVisible } = useCocktails();

	const displayedCocktails = selectedCategory === 'classique' ? cocktails : cocktailsCrea;

	const filteredCocktails = displayedCocktails.filter((cocktail) => {
		const nameField = cocktail.name;

		const searchQuery = typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';
		const nameMatch = nameField ? nameField.toLowerCase().includes(searchQuery) : false;

		const ingredientMatch =
			cocktail.ingredients &&
			cocktail.ingredients.some((ingredient) => {
				const ingredientName = ingredient.name;
				return ingredientName ? ingredientName.toLowerCase().includes(searchQuery) : false;
			});

		return nameMatch || ingredientMatch;
	});

	if (loading) {
		return <div className="deco flex center">Chargement des cocktails...</div>;
	}

	if (!filteredCocktails || filteredCocktails.length === 0) {
		return (
			<div className="deco flex center">
				<h3>Aucun cocktail disponible.</h3>
			</div>
		);
	}
	return (
		<div className="flex column gap20 margin20Bottom">
			{filteredCocktails.map((cocktail, index) =>
				selectedCategory === 'classique' ? (
					<CocktailCard
						key={cocktail._id}
						cocktail={cocktail}
						index={index}
						activeCard={activeCard}
						clickedStates={clickedStates}
						handleCardClick={handleCardClick}
						handleButtonClick={(event) => handleButtonClick(event, index, cocktail._id)}
						isVisible={isVisible}
					/>
				) : (
					<CocktailCardCrea
						key={cocktail._id}
						cocktail={cocktail}
						index={index}
						activeCard={activeCard}
						clickedStates={clickedStates}
						handleCardClick={handleCardClick}
						handleButtonClick={(event) => handleButtonClick(event, index, cocktail._id)}
						isVisible={isVisible}
					/>
				)
			)}
		</div>
	);
};

export default Cocktails;
