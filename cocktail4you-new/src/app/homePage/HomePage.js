'use client';

import './homePage.scss';
import Button from '../components/buttons/Button';
import Cocktails from '../components/cocktails/Cocktails';
import { useCocktails } from '../context/CocktailContext';
import { useState, useEffect, useMemo } from 'react';

const HomePage = () => {
	const { activeCard, setActiveCard } = useCocktails();
	const [inputValue, setInputValue] = useState('');
	const [isVisible, setIsVisible] = useState(true);
	const [isModalVisible, setIsModalVisible] = useState(true);
	const [isOver18, setIsOver18] = useState(false);

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
					<h2 className=" flex  align-center avertissement shadow">Vous devez avoir plus de 18 ans pour accéder à ce site.</h2>
					<div className="flex row center gap20">
						<Button text="Je confirme" onClick={() => handleAgeConfirmation('yes')} />
						<Button text="Je suis mineur" onClick={() => handleAgeConfirmation('no')} />
					</div>
				</div>
			)}

			{isOver18 && (
				<>
					<div className="flex column">
						{inputValue === '' && (
							<h1 className={`title flex center align-center shadow ${isVisible ? 'fade-up visible' : 'fade-down hidden'}`}>
								Cocktails<span className="number">4</span>You
							</h1>
						)}
						<div className={`flex column padding-bottom10 ${inputValue !== '' ? 'slide-up margin0' : 'slide-down'}`}>
							<label htmlFor="site-search"></label>
							<input
								type="search"
								id="site-search"
								name="q"
								value={inputValue}
								onChange={handleInputChange}
								autoComplete="off"
								className={`shadow ${inputValue !== '' ? 'margin0' : ''}`}
							/>
							<div className={`flex column cocktails-container ${inputValue === '' ? 'hidden' : ''}`}>
								<Cocktails searchTerm={inputValue} />
							</div>
						</div>
						{inputValue === '' && (
							<div className={`flex row center align-center gap20 ${isVisible ? 'fade-up visible' : 'fade-down hidden'}`}>
								<Button text="Populaire" className="shadow" />
								<Button text="Créations" className="shadow" />
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default HomePage;
