'use client';

import './homePage.scss';
import Button from '../components/buttons/Button';
import Cocktails from '../components/cocktails/Cocktails';
import { useCocktails } from '../context/CocktailContext';
import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';

const HomePage = () => {
	const { activeCard, setActiveCard } = useCocktails();
	const [inputValue, setInputValue] = useState('');
	const [isVisible, setIsVisible] = useState(true);
	const [isModalVisible, setIsModalVisible] = useState(true);
	const [isOver18, setIsOver18] = useState(false);
	const { isFrench } = useLanguage();
	const [selectedCategory, setSelectedCategory] = useState('classique');

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	useEffect(() => {
		if (inputValue === '') {
			setIsVisible(true);
			setActiveCard(null);
		} else {
			setIsVisible(false);
		}
	}, [inputValue]);

	useEffect(() => {
		if (isVisible !== null) {
			const timer = setTimeout(() => {
				setIsVisible(true);
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [isVisible]);

	useEffect(() => {
		const ageConfirmation = localStorage.getItem('ageConfirmed');
		if (ageConfirmation === 'yes') {
			setIsOver18(true);
			setIsModalVisible(false);
		}
	}, []);

	const handleAgeConfirmation = (answer) => {
		if (answer === 'yes') {
			setIsOver18(true);
			setIsModalVisible(false);
			localStorage.setItem('ageConfirmed', 'yes');
		} else {
			alert('Désolé, vous devez avoir plus de 18 ans pour accéder à ce site.');
		}
	};

	return (
		<div className="flex center align-center height100vh overflow-none">
			{isModalVisible && (
				<div className="flex column  align-center age-confirmation-modal">
					<h2 className=" flex  align-center avertissement ">Vous devez avoir plus de 18 ans pour accéder à ce site.</h2>
					<div className="flex row center gap20">
						<Button text="Je confirme" className="text-confirmation" onClick={() => handleAgeConfirmation('yes')} />
						<Button text="Je suis mineur" className="text-confirmation" onClick={() => handleAgeConfirmation('no')} />
					</div>
				</div>
			)}

			{isOver18 && (
				<>
					<div className="flex column">
						{inputValue === '' && (
							<h1 className={`title flex center align-center ${isVisible ? 'fade-up visible' : 'fade-down hidden'}`}>
								Cocktails<span className="number">4</span>You
							</h1>
						)}
						<div className={`flex column padding-bottom10 ${inputValue !== '' ? 'slide-up margin0' : 'slide-down'}`}>
							<label htmlFor="site-search"></label>
							<div className="relative">
								<input
									type="search"
									id="site-search"
									name="q"
									value={inputValue}
									onChange={handleInputChange}
									autoComplete="off"
									className={` ${inputValue !== '' ? 'margin0' : ''}`}
								/>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="loupe">
									<path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
								</svg>
							</div>
							<div className={`flex column cocktails-container ${inputValue === '' ? 'hidden' : ''}`}>
								<Cocktails searchTerm={inputValue} selectedCategory={selectedCategory} />
							</div>
						</div>
						{inputValue === '' && (
							<div className={`flex row center align-center gap20 ${isVisible ? 'fade-up visible' : 'fade-down hidden'}`}>
								<Button
									text={isFrench ? 'Classique' : 'Classic'}
									className={` ${selectedCategory === 'classique' ? 'activeCategory' : ''}`}
									onClick={() => setSelectedCategory('classique')}
								/>
								<Button
									text={isFrench ? 'Créations' : 'Creations'}
									className={` ${selectedCategory === 'creations' ? 'activeCategory' : ''}`}
									onClick={() => setSelectedCategory('creations')}
								/>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default HomePage;
