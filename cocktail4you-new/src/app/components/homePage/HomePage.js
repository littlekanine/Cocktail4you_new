'use client';

import './homePage.scss';
import Button from '../buttons/Button';
import Cocktails from '../cocktails/Cocktails';
import { useState, useEffect, useMemo } from 'react';
import cocktailsData from '../../../assets/cocktails-test-MongoDb.json';
import Link from 'next/link';

const HomePage = () => {
	const [inputValue, setInputValue] = useState('');
	const [isVisible, setIsVisible] = useState(true);
	const [activeCard, setActiveCard] = useState(null);

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	const filteredCocktails = useMemo(() => cocktailsData.filter((cocktail) => cocktail.name.toLowerCase().includes(inputValue.toLowerCase())), [inputValue]);
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
	}, []);

	return (
		<div className=" flex center align-center height100vh overflow-none ">
			<div className="logo">
				<h2 className={`${isVisible ? 'fade-down hidden' : 'fade-up cocktail-info-visible'}`}>
					C<span className="number">4</span>Y
				</h2>
			</div>
			<div className="button-user">
				<Link href="/connexion">
					<Button
						icon={
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
								<path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z" />
							</svg>
						}
						className="button-user-svg"
					/>
				</Link>
			</div>
			<div className="flex column">
				{inputValue === '' && (
					<h1 className={`title flex center align-center ${isVisible ? 'fade-up visible' : 'fade-down hidden'}`}>
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
