import React from 'react';
import './cocktailCard.scss';
import Button from '../buttons/Button';
import { useCocktails } from '../../context/CocktailContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

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
				className={`cocktail-card flex center column relative ${activeCard === cocktailId ? 'active' : ''}`}
				style={{
					backgroundImage: cocktail.img ? `url(${cocktail.img})` : 'none',
					borderRadius: '10px',
					borderTopLeftRadius: activeCard === cocktailId ? '10px' : '10px',
					borderTopRightRadius: activeCard === cocktailId ? '10px' : '10px',
					borderBottomLeftRadius: activeCard === cocktailId ? '0px' : '10px',
					borderBottomRightRadius: activeCard === cocktailId ? '0px' : '10px',
				}}
				onClick={() => handleCardClick(cocktailId)}
			>
				<div className="flex center align-center column">
					<h2 className="cocktail-name">{cocktail.name}</h2>
					<h3 className="cocktail-category">{cocktail.category}</h3>
					{connectUser && (
						<Button
							onClick={(event) => handleFavoriteClick(event, cocktail._id)}
							icon={
								clickedStates[cocktail._id] ? (
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
										<path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
									</svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="button-star-svg clicked">
										<path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
									</svg>
								)
							}
							className={`button-star-svg transparent absolute zIndexPositive ${clickedStates[cocktail._id] ? 'active' : ''}`}
						/>
					)}
				</div>
			</div>

			<div className="flex info-container heightFull text-center scroll">
				<AnimatePresence>
					{activeCard === cocktailId && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className={`extra-info flex align-center widthFull padding10 column scroll ${isVisible ? 'visible' : ''}`}
						>
							<div className="flex heightFull widthFull column text-center center align-center relative padding10">
								{cocktail.ingredients.map((ingredient, index) => (
									<div className="flex widthFull column " key={index}>
										<p className="flex widthFull center align-center">
											{/* Utilisation de la langue active pour récupérer le bon texte */}
											<span className="flex cocktails-ingredients">
												{
													// Vérification si ingredient.name est un objet avec les clés 'fr' et 'en'
													typeof ingredient.name === 'object' && ingredient.name !== null
														? ingredient.name[isFrench ? 'fr' : 'en'] || 'Inconnu'
														: ingredient.name || 'Inconnu'
												}
											</span>
											<span className="ingredient-separator"> - </span>
											<span className="flex card-indications">
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
								<svg xmlns="http://www.w3.org/2000/svg" className="svg-bottle" viewBox="0 0 512 512">
									<path d="M393.4 9.4c12.5-12.5 32.8-12.5 45.3 0l64 64c12.5 12.5 12.5 32.8 0 45.3c-11.8 11.8-30.7 12.5-43.2 1.9l-9.5 9.5-48.8 48.8c-9.2 9.2-11.5 22.9-8.6 35.6c9.4 40.9-1.9 85.6-33.8 117.5L197.3 493.3c-25 25-65.5 25-90.5 0l-88-88c-25-25-25-65.5 0-90.5L180.2 153.3c31.9-31.9 76.6-43.1 117.5-33.8c12.6 2.9 26.4 .5 35.5-8.6l48.8-48.8 9.5-9.5c-10.6-12.6-10-31.4 1.9-43.2zM99.3 347.3l65.4 65.4c6.2 6.2 16.4 6.2 22.6 0l97.4-97.4c6.2-6.2 6.2-16.4 0-22.6l-65.4-65.4c-6.2-6.2-16.4-6.2-22.6 0L99.3 324.7c-6.2 6.2-6.2 16.4 0 22.6z" />
								</svg>
							</div>
							<hr className="separator"></hr>
							<div className="widthFull flex center align-center relative">
								<div className="flex center align-center width80">
									<p className="flex column center align-center gap10">
										<span className="card-indications text-center">{cocktail.instructions}</span>{' '}
									</p>
								</div>
								<svg xmlns="http://www.w3.org/2000/svg" className="svg-task" viewBox="0 0 512 512">
									<path d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113C-2.3 103.6-2.3 88.4 7 79s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zM160 416c0-17.7 14.3-32 32-32l288 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0c-17.7 0-32-14.3-32-32zM48 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
								</svg>
							</div>
							<hr className="separator"></hr>
							<div className="relative widthFull ">
								<p>
									<span className="card-indications">{cocktail.glass_type}</span>
								</p>
								<svg xmlns="http://www.w3.org/2000/svg" className="svg-task" viewBox="0 0 512 512">
									<path d="M32 0C19.1 0 7.4 7.8 2.4 19.8s-2.2 25.7 6.9 34.9L224 269.3 224 448l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0 96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-178.7L502.6 54.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 0 480 0L32 0zM256 210.7L109.3 64l293.5 0L256 210.7z" />
								</svg>
							</div>
							<hr className="separator"></hr>
							<div className="relative widthFull flex center align-center">
								<div className="width80 flex center align-center">
									<span className="card-indications">
										{Array.isArray(cocktail.decoration) && cocktail.decoration.length > 0 ? (
											cocktail.decoration.map((decoration, index) => (
												<div key={index} className="deco flex column width280">
													<p className="card-indications flex column space-between">
														{
															typeof decoration === 'object' && decoration !== null
																? Array.isArray(decoration[isFrench ? 'fr' : 'en'])
																	? decoration[isFrench ? 'fr' : 'en'].join(' - ') // Si c'est un tableau, utilise join
																	: decoration[isFrench ? 'fr' : 'en'] || '' // Sinon, afficher le texte de la langue
																: decoration || 'Aucune décoration disponible' // Si decoration n'est pas un objet valide
														}
													</p>
												</div>
											))
										) : (
											<p className="flex">Aucune décoration disponible</p> // Message alternatif si pas de déco
										)}
									</span>
								</div>
								<svg xmlns="http://www.w3.org/2000/svg" className="svg-task" viewBox="0 0 448 512">
									<path d="M448 96c0-35.3-28.7-64-64-64c-6.6 0-13 1-19 2.9c-22.5 7-48.1 14.9-71 9c-75.2-19.1-156.4 11-213.7 68.3S-7.2 250.8 11.9 326c5.8 22.9-2 48.4-9 71C1 403 0 409.4 0 416c0 35.3 28.7 64 64 64c6.6 0 13-1 19.1-2.9c22.5-7 48.1-14.9 71-9c75.2 19.1 156.4-11 213.7-68.3s87.5-138.5 68.3-213.7c-5.8-22.9 2-48.4 9-71c1.9-6 2.9-12.4 2.9-19.1zM212.5 127.4c-54.6 16-101.1 62.5-117.1 117.1C92.9 253 84 257.8 75.5 255.4S62.2 244 64.6 235.5c19.1-65.1 73.7-119.8 138.9-138.9c8.5-2.5 17.4 2.4 19.9 10.9s-2.4 17.4-10.9 19.9z" />
								</svg>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default CocktailCardCrea;
