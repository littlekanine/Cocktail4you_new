import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';

export const PostCocktailsContext = createContext();

export const useCrea = () => {
	return useContext(PostCocktailsContext);
};

export const PostCocktailsProvider = ({ children }) => {
	const [cocktails, setCocktails] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const userId = user?._id;

	const postCocktail = async (cocktail) => {
		if (!userId) {
			setError('User not authenticated');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/cocktailsCrea', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'user-id': userId,
				},
				body: JSON.stringify(cocktail),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			setCocktails((prevCocktails) => [...prevCocktails, data.data]);
		} catch (err) {
			setError(err.message || 'Something went wrong');
			console.error("Erreur lors de l'ajout du cocktail", err);
		} finally {
			setLoading(false);
		}
	};

	return <PostCocktailsContext.Provider value={{ cocktails, postCocktail, loading, error }}>{children}</PostCocktailsContext.Provider>;
};
