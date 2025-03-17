'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
	return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
	const [isFrench, setFrench] = useState(true);

	useEffect(() => {
		const storedLang = localStorage.getItem('language');
		if (storedLang) {
			setFrench(storedLang === 'fr');
		}
	}, []);

	const toggleLanguage = () => {
		setFrench((prev) => {
			const newLang = !prev ? 'fr' : 'en';
			localStorage.setItem('language', newLang);
			return !prev;
		});
	};

	const value = {
		isFrench,
		isEnglish: !isFrench,
		toggleLanguage,
	};

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
