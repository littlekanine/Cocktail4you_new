'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CocktailContext = createContext();

export const useCocktails = () => {
	return useContext(CocktailContext);
};

export const CocktailProvider = ({ children }) => {
	const [cocktails, setCocktails] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchCocktails() {
			setLoading(true);
			try {
				const response = await fetch('/api/cocktails');
				const data = await response.json();

				if (data.success) {
					setCocktails(data.data);
				} else {
					console.error('Erreur lors du chargement des cocktails :', data.error);
				}
			} catch (error) {
				console.error('Erreur réseau :', error);
			} finally {
				setLoading(false);
			}
		}

		fetchCocktails();
	}, []);

	return <CocktailContext.Provider value={{ cocktails, loading }}>{children}</CocktailContext.Provider>;
};
