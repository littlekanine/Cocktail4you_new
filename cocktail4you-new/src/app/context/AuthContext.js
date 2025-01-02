'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Créer un contexte pour l'utilisateur
const AuthContext = createContext();

export const useAuth = () => {
	return useContext(AuthContext); // Permet d'utiliser ce contexte dans n'importe quel composant
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null); // Stocke l'utilisateur (null s'il est déconnecté)
	const [loading, setLoading] = useState(true); // Gère l'état de chargement

	// Utilisation de useEffect pour vérifier si l'utilisateur est connecté
	useEffect(() => {
		async function checkAuth() {
			const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

			if (token) {
				try {
					const response = await fetch('/api/auth/user', {
						headers: { Authorization: `Bearer ${token}` },
					});
					const data = await response.json();

					if (data.user) {
						setUser(data.user); // Si utilisateur trouvé, on met à jour l'état
					} else {
						setUser(null); // Sinon, on le définit comme null
					}
				} catch (error) {
					console.error("Erreur de vérification de l'authentification :", error);
					setUser(null);
				}
			} else {
				setUser(null); // Si aucun token n'est trouvé, l'utilisateur est déconnecté
			}
			setLoading(false); // Fin du chargement
		}

		checkAuth();
	}, []);

	return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>;
};
