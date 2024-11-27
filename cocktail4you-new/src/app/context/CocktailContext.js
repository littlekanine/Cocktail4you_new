'use client'; // Nécessaire pour utiliser les hooks dans un projet Next.js

import { createContext, useContext, useState, useEffect } from 'react';

// Créez le contexte
const CocktailContext = createContext();

// Créez un hook personnalisé pour accéder au contexte plus facilement
export const useCocktails = () => {
	return useContext(CocktailContext);
};

// Fournisseur de contexte
export const CocktailProvider = ({ children }) => {
	const [cocktails, setCocktails] = useState([]); // État global des cocktails
	const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement

	useEffect(() => {
		// Fonction pour récupérer les cocktails depuis l'API
		async function fetchCocktails() {
			setLoading(true); // Début du chargement
			try {
				const response = await fetch('/api/cocktails'); // Remplacez par votre API Route
				const data = await response.json();

				if (data.success) {
					setCocktails(data.cocktails); // Stockez les cocktails dans le state
				} else {
					console.error('Erreur lors du chargement des cocktails :', data.error);
				}
			} catch (error) {
				console.error('Erreur réseau :', error);
			} finally {
				setLoading(false); // Fin du chargement
			}
		}

		fetchCocktails();
	}, []); // Chargement au montage

	return <CocktailContext.Provider value={{ cocktails, loading }}>{children}</CocktailContext.Provider>;
};
