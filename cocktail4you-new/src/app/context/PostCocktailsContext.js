import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

export const PostCocktailsContext = createContext();

export const useCrea = () => {
	return useContext(PostCocktailsContext);
};

export const PostCocktailsProvider = ({ children }) => {
	const [cocktails, setCocktails] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const postCocktail = async (cocktail) => {
		setLoading(true);
		setError(null);
		try {
			console.log('Données envoyées : ', cocktail);
			const response = await fetch('/api/cocktailsCrea', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(cocktail),
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			setCocktails((prevCocktails) => [...prevCocktails, data.data]);
			console.log(data);
		} catch (err) {
			setError(err.message);
			console.error("Erreur lors de l'ajout du cocktail", err);
		} finally {
			setLoading(false);
		}
	};

	return <PostCocktailsContext.Provider value={{ cocktails, postCocktail, loading, error }}>{children}</PostCocktailsContext.Provider>;
};
