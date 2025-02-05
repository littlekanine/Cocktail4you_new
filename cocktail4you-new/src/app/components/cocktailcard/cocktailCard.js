import React from 'react';
import Image from 'next/image';
import './cocktailCard.scss';
import Button from '../buttons/Button';
import { useCocktails } from '@/app/context/CocktailContext';
import { useAuth } from '@/app/context/AuthContext';
import { useLanguage } from '@/app/context/LanguageContext';

const CocktailCard = ({ cocktail, index, activeCard, handleCardClick, handleButtonClick, isVisible }) => {
	const { clickedStates, handleFavoriteClick } = useCocktails();
	const { isFrench } = useLanguage();
	const { user } = useAuth();
	if (!cocktail || !cocktail._id) {
		console.error('Cocktail manquant ou invalide :', cocktail);
		return null; // Ne pas rendre de carte si le cocktail est invalide
	}
	const cocktailId = cocktail._id; // Utilisez _id comme clé unique
	const connectUser = user;

	return (
		<div
			key={cocktailId} // Utilisez cocktailId comme clé unique
			className={`flex gap20 ${activeCard === index ? 'column align-center ' : activeCard === null ? 'row' : 'hidden'}`}
			onClick={() => handleCardClick(index)}
		>
			<div className={`${activeCard === index ? ' expanded widthFull' : 'collapsed'} relative`}>
				{cocktail.img ? (
					<Image
						src={cocktail.img}
						width={94}
						height={94} // Assure une taille correcte
						alt={cocktail.name || 'Default Name'}
						className={`card-image ${activeCard === index ? 'expanded brightness widthFull' : 'collapsed'}`}
					/>
				) : isFrench ? (
					<p>Aucune image disponible</p>
				) : (
					<p>No images available</p>
				)}

				{/* ✅ Titre visible uniquement si la carte est expand */}
				{activeCard === index && <h1 className="title-card-cocktail yellow shadow-white">{cocktail.name}</h1>}
			</div>
			<div className={`flex row card-info space-between shadow ${activeCard === index ? 'expanded' : 'collapsed'}`}>
				{activeCard !== index ? (
					<div className="flex column center design-card">
						<h1 className="shadow">{cocktail.name}</h1>
						<h2 className="shadow">
							{Array.isArray(cocktail.tags) && cocktail.tags.length > 0
								? cocktail.tags
										.flat() // Aplatir le tableau de tags
										.join(' ') // Joindre les tags avec un espace
								: isFrench
								? 'Aucun tag disponible'
								: 'No tag available'}
						</h2>
					</div>
				) : (
					<div className="flex column center design-card-expanded heightFull">
						<div className={`flex column gap10 scroll cache heightFull ${activeCard === index && isVisible ? 'cocktail-info-visible' : ''}`}>
							{/* <h1 className="flex center">{cocktail.name}</h1> */}
							<div className="flex row start align-center">
								<div>
									{cocktail.ingredients.map((ingredient, index) => (
										<div className="flex widthFull" key={index}>
											<p className="flex space-between width280 shadow">
												{/* Utilisation de la langue active pour récupérer le bon texte */}
												<span className="flex">
													{
														// Vérification si ingredient.name est un objet avec les clés 'fr' et 'en'
														typeof ingredient.name === 'object' && ingredient.name !== null
															? ingredient.name[isFrench ? 'fr' : 'en'] || 'Inconnu'
															: ingredient.name || 'Inconnu'
													}
												</span>
												<span className="flex card-indications shadow">
													{ingredient.quantity || ''}
													{
														// Vérification si ingredient.unit est un objet avec les clés 'fr' et 'en'
														ingredient.unit
															? typeof ingredient.unit === 'object' && ingredient.unit !== null
																? ingredient.unit[isFrench ? 'fr' : 'en']
																: ingredient.unit
															: ''
													}
												</span>
											</p>
										</div>
									))}
								</div>
							</div>
							<div className="flex center column">
								<p className="flex column center align-center gap10">
									{isFrench ? <span>Recette</span> : <span>Recipe </span>}{' '}
									<span className="card-indications shadow text-center">{cocktail.instructions}</span>
								</p>
							</div>
							<p>
								{isFrench ? <span>Le verre</span> : <span>The glass</span>} : <span className="card-indications shadow">{cocktail.glass_type}</span>
							</p>
							<div>
								{isFrench ? <p>Décorations : </p> : <p>Decoration</p>}
								<span className="card-indications shadow">
									{Array.isArray(cocktail.decoration) && cocktail.decoration.length > 0 ? (
										cocktail.decoration.map((decoration, index) => (
											<div key={index} className="deco flex column width280">
												<p className="card-indications flex column space-between shadow">
													{
														// Vérification si decoration.name est un objet avec les clés 'fr' et 'en'
														typeof decoration === 'object' && decoration !== null
															? decoration[isFrench ? 'fr' : 'en'].join(' - ') || ''
															: decoration || 'A votre appréciation'
													}{' '}
												</p>
											</div>
										))
									) : (
										<p>A votre appréciation</p>
									)}
								</span>
							</div>
							<p className="card-indications shadow">
								{typeof cocktail.history === 'object' && cocktail.history !== null
									? cocktail.history[isFrench ? 'fr' : 'en'] || ''
									: cocktail.history || ''}
							</p>
						</div>
					</div>
				)}
				<div className="flex heightFull">
					{connectUser ? (
						<Button
							onClick={(event) => handleFavoriteClick(event, index, cocktailId)} // Transmet cocktailId
							icon={
								clickedStates[cocktailId] ? (
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
										<path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
									</svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="button-star-svg clicked">
										<path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
									</svg>
								)
							}
							className={`button-star-svg transparent ${clickedStates[cocktailId] ? 'active' : ''}`}
						/>
					) : (
						<div></div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CocktailCard;
