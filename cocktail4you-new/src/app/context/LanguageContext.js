'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
	return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
	const [isFrench, setFrench] = useState(true);

	// Fonction pour basculer entre les langues
	const toggleLanguage = () => {
		setFrench((prev) => !prev);
	};

	const value = {
		isFrench,
		isEnglish: !isFrench,
		toggleLanguage,
	};

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
