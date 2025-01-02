'use client';

import React from 'react';
import './page.scss';
import '../homePage/homePage.scss';
import { useEffect, useState } from 'react';

const Page = () => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch('/api/auth/user', {
					method: 'GET',
					credentials: 'include',
				});

				if (!response.ok) {
					throw new Error('Erreur lors de la récupération des données utilisateur.');
				}

				const data = await response.json();
				setUser(data.user);
			} catch (err) {
				setError(err.message);
			}
		};

		fetchUser();
	}, []);

	if (error) {
		return <p>Erreur : {error}</p>;
	}

	if (!user) {
		return <p>Chargement...</p>;
	}
	return <div className="flex heigt100vh"></div>;
};

export default Page;
