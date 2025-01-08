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

	async function refreshAuth() {
		console.log('reached tonton');
		try {
			const response = await fetch('/api/refresh-token', {
				method: 'POST',
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data.token) {
				// Option : stocker dans un cookie plutôt que dans localStorage
				document.cookie = `auth_token=${data.token}; Path=/; HttpOnly; Secure`;
				setToken(data.token);
				console.log(data.token);
			}

			await checkAuth();
		} catch (error) {
			console.error('Erreur lors du rafraîchissement de l’authentification :', error);
			setUser(null);
		}
	}

	async function logout() {
		try {
			// Appelle l'API de déconnexion pour supprimer les cookies côté serveur
			const response = await fetch('/api/logout', {
				method: 'POST',
				credentials: 'include', // Inclure les cookies dans la requête
			});

			if (!response.ok) {
				throw new Error('Erreur lors de la déconnexion côté serveur');
			}

			// Réinitialise l'état côté client
			setUser(null);
			setToken(null);

			// Supprime également le token localement si utilisé
			localStorage.removeItem('auth_token');
		} catch (error) {
			console.error('Erreur lors de la déconnexion :', error);
		} finally {
			// Nettoyer l'état même en cas d'erreur
			setUser(null);
			setToken(null);
		}
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
			// Vérifier l'authentification initiale si le token est présent
			checkAuth();

			// Rafraîchir le token automatiquement avant son expiration
			const interval = setInterval(() => {
				refreshAuth().catch(() => {
					setLoading(false); // Si le rafraîchissement échoue, arrêter le chargement
				});
			}, 10 * 60 * 1000); // Rafraîchir toutes les 10 minutes

			// Nettoyer l'intervalle au démontage ou lors d'un changement de token
			return () => clearInterval(interval);
		} else {
			// Si le token est absent, essayer de rafraîchir l'authentification
			refreshAuth().catch(() => {
				logout();
			});
		}
	}, [token]); // Dépendance au token pour détecter les changements

	return <AuthContext.Provider value={{ user, setUser, loading, checkAuth, logout }}>{children}</AuthContext.Provider>;
};
