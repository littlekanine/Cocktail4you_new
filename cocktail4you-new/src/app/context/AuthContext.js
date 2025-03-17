'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState(null);

	async function checkAuth() {
		try {
			const response = await fetch('/api/auth', {
				method: 'GET',
				credentials: 'include',
			});

			if (!response.ok) {
				setUser(null);
				throw new Error('Utilisateur non authentifié');
			}

			const data = await response.json();

			if (data.user) {
				setUser(data.user);
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error('Erreur de vérification de l’authentification :', error);
			setUser(null);
		}
		setLoading(false);
	}

	async function refreshAuth() {
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
				document.cookie = `auth_token=${data.token}; Path=/; HttpOnly; Secure`;
				setToken(data.token);
			}

			await checkAuth();
		} catch (error) {
			console.error('Erreur lors du rafraîchissement de l’authentification :', error);
			setUser(null);
		}
	}

	async function logout() {
		try {
			const response = await fetch('/api/logout', {
				method: 'POST',
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Erreur lors de la déconnexion côté serveur');
			}

			setUser(null);
			setToken(null);

			localStorage.removeItem('auth_token');
		} catch (error) {
			console.error('Erreur lors de la déconnexion :', error);
		} finally {
			setUser(null);
			setToken(null);
		}
	}

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedToken = localStorage.getItem('auth_token');
			setToken(storedToken);
		}
	}, []);

	useEffect(() => {
		if (token) {
			checkAuth();

			const interval = setInterval(() => {
				refreshAuth().catch(() => {
					setLoading(false);
				});
			}, 10 * 60 * 1000);

			return () => clearInterval(interval);
		} else {
			refreshAuth().catch(() => {
				logout();
			});
		}
	}, [token]);

	return <AuthContext.Provider value={{ user, setUser, loading, checkAuth, logout }}>{children}</AuthContext.Provider>;
};
