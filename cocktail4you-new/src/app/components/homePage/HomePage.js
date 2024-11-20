'use client';

import './homePage.scss';
import Button from '../buttons/Button';
import Cocktails from '../cocktails/Cocktails';
import { useState, useEffect, useMemo } from 'react';
import ButtonUser from '../button-user/Button-user';
import cocktailsData from '../../../assets/cocktails-test-MongoDb.json';

const HomePage = () => {
	const [inputValue, setInputValue] = useState('');
	const [isVisible, setIsVisible] = useState(true);

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	const filteredCocktails = useMemo(() => cocktailsData.filter((cocktail) => cocktail.name.toLowerCase().includes(inputValue.toLowerCase())), [inputValue]);
	useEffect(() => {
		if (inputValue === '') {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	}, [inputValue]);
	return (
		<div className=" flex center align-center height100vh overflow-none ">
			<div className="logo">
				<h2 className={`${isVisible ? 'fade-down hidden' : 'fade-up visible'}`}>
					C<span className="number">4</span>Y
				</h2>
			</div>
			<div className="button-user">
				<ButtonUser />
			</div>
			<div className="flex column">
				{inputValue === '' && (
					<h1 className={`title flex center align-center ${isVisible ? 'fade-up visible' : 'fade-down hidden'}`}>
						Cocktails<span className="number">4</span>You
					</h1>
				)}
				<div className={`flex column ${inputValue !== '' ? 'slide-up margin0' : 'slide-down'}`}>
					<label htmlFor="site-search"></label>
					<input
						type="search"
						id="site-search"
						name="q"
						value={inputValue}
						onChange={handleInputChange}
						autoComplete="off"
						className={` ${inputValue !== '' ? 'margin0' : ''}`}
					/>
					<div className={`flex column cocktails-container ${inputValue === '' ? 'hidden' : ''}`}>
						<Cocktails cocktails={filteredCocktails} />
					</div>
				</div>
				{inputValue === '' && (
					<div className={`flex row center align-center spacee-between ${isVisible ? 'fade-up visible' : 'fade-down hidden'}`}>
						<Button text="Populaire" />
						<Button text="Créations" />
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;
