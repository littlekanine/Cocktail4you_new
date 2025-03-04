import React from 'react';
import Image from 'next/image';
import './cocktailCard.scss';
import Button from '../buttons/Button';
import { useCocktails } from '@/app/context/CocktailContext';
import { useAuth } from '@/app/context/AuthContext';
import { useLanguage } from '@/app/context/LanguageContext';

const CocktailCardCrea = ({ cocktail, index, activeCard, handleCardClick, handleButtonClick, isVisible }) => {
	const { clickedStates, handleFavoriteClick } = useCocktails();
	const { isFrench } = useLanguage();
	const { user } = useAuth();

	if (!cocktail || !cocktail._id) {
		console.error('Cocktail manquant ou invalide :', cocktail);
		return null;
	}

	const cocktailId = cocktail._id;
	const connectUser = user;

	return (
		<div className="cocktail-card-container">
			<div
				key={cocktailId}
				className={`cocktail-card ${activeCard === cocktailId ? 'active' : ''}`}
				style={{ backgroundImage: cocktail.img ? `url(${cocktail.img})` : 'none' }}
				onClick={() => handleCardClick(cocktailId)}
			>
				<div className="cocktail-card-header">
					<h2 className="cocktail-name">{cocktail.name}</h2>
					<h3 className="cocktail-category">{cocktail.category}</h3>
					{connectUser && (
						<Button
							onClick={(event) => handleFavoriteClick(event, index, cocktailId)}
							icon={
								clickedStates[cocktailId] ? (
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
										<path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3..." />
									</svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
										<path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3..." />
									</svg>
								)
							}
							className={`button-star-svg ${clickedStates[cocktailId] ? 'active' : ''}`}
						/>
					)}
				</div>
			</div>
			{activeCard === cocktailId && (
				<div className={`extra-info ${isVisible ? 'visible' : ''}`}>
					<div className="ingredients-list">
						{cocktail.ingredients.map((ingredient, index) => (
							<p key={index} className="ingredient-item">
								{typeof ingredient.name === 'object' ? ingredient.name[isFrench ? 'fr' : 'en'] : ingredient.name} - {ingredient.quantity}{' '}
								{ingredient.unit ? (typeof ingredient.unit === 'object' ? ingredient.unit[isFrench ? 'fr' : 'en'] : ingredient.unit) : ''}
							</p>
						))}
					</div>
					<p className="cocktail-instructions">{cocktail.instructions}</p>
					<p className="cocktail-glass-type">{cocktail.glass_type}</p>
					<p className="cocktail-decoration">
						{Array.isArray(cocktail.decoration) && cocktail.decoration.length > 0
							? cocktail.decoration.map((decoration, index) => (
									<span key={index}>{typeof decoration === 'object' ? decoration[isFrench ? 'fr' : 'en'] : decoration}</span>
							  ))
							: 'Aucune décoration disponible'}
					</p>
				</div>
			)}
		</div>
	);
};

export default CocktailCardCrea;
