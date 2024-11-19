'use client';

import './homePage.scss';
import Button from '../buttons/Button';
import Cocktails from '../cocktails/Cocktails';
import { useState, useEffect } from 'react';
import ButtonUser from '../button-user/Button-user';

const HomePage = () => {
	const [inputValue, setInputValue] = useState('');
	const [isVisible, setIsVisible] = useState(true);

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	useEffect(() => {
		if (inputValue === '') {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	}, [inputValue]);
	return (
		<div className=" flex center align-center height100vh">
			<div className="flex column">
				{inputValue === '' && (
					<h1 className={`title flex center align-center ${isVisible ? 'fade-up visible' : 'fade-down hidden'}`}>
						Cocktails<span className="number">4</span>You
					</h1>
				)}
				<div className={`flex column ${inputValue !== '' ? 'slide-up' : 'slide-down'}`}>
					<label htmlFor="site-search"></label>
					<input type="search" id="site-search" name="q" value={inputValue} onChange={handleInputChange} />
				</div>
				{inputValue === '' && (
					<div className={`flex row center align-center spacee-between ${isVisible ? 'fade-up visible' : 'fade-down hidden'}`}>
						<Button text="Populaire" />
						<Button text="Créations" />
					</div>
				)}
			</div>
			<div className="logo">
				<h2 className={`${isVisible ? 'fade-down hidden' : 'fade-up visible'}`}>
					C<span className="number">4</span>Y
				</h2>
			</div>
			<div className="button-user">
				<ButtonUser />
			</div>
			<Cocktails />
		</div>
	);
};

export default HomePage;
