'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Créer un contexte pour l'utilisateur
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
	return useContext(AuthContext);
};

// Composant fournisseur du contexte
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null); // Stocke l'utilisateur (null s'il est déconnecté)
	const [loading, setLoading] = useState(true); // Gère l'état de chargement
	const [token, setToken] = useState(null); // Ajout de l'état pour le token

	// Fonction de vérification de l'authentification
	async function checkAuth() {
		try {
			const response = await fetch('/api/auth', {
				method: 'GET',
				credentials: 'include',
			});

			console.log("Réponse de l'API", response);

			if (!response.ok) {
				setUser(null); // Si la réponse n'est pas OK, l'utilisateur n'est pas authentifié
				throw new Error('Utilisateur non authentifié');
			}

			const data = await response.json();

			if (data.user) {
				setUser(data.user); // Si utilisateur trouvé, on met à jour l'état
			} else {
				setUser(null); // Sinon, on le définit comme null
			}
		} catch (error) {
			console.error('Erreur de vérification de l’authentification :', error);
			setUser(null); // En cas d'erreur, on considère l'utilisateur comme déconnecté
		}
		setLoading(false); // Fin du chargement
	}

	// Utilisation de useEffect pour récupérer le token depuis localStorage uniquement côté client
	useEffect(() => {
		// Vérifier si le code est exécuté côté client avant d'utiliser localStorage
		if (typeof window !== 'undefined') {
			const storedToken = localStorage.getItem('auth_token');
			setToken(storedToken); // Récupérer le token depuis le localStorage
		}
	}, []); // Ce useEffect se déclenche uniquement au montage du composant

	// Vérification de l'authentification après que le token soit récupéré
	useEffect(() => {
		if (token) {
			checkAuth(); // Appeler checkAuth seulement si un token est disponible
		} else {
			setLoading(false); // Si pas de token, on considère que l'utilisateur est déconnecté
		}
	}, [token]); // Ce useEffect se déclenche chaque fois que le token change

	return <AuthContext.Provider value={{ user, setUser, loading, checkAuth }}>{children}</AuthContext.Provider>;
};
