'use client';

import React from 'react';
import './page.scss';
import '../homePage/homePage.scss';
import { useAuth } from '../context/AuthContext';
const Page = () => {
	const { user, loading } = useAuth(); // Récupère l'utilisateur et l'état de chargement depuis le contexte

	// Gestion des cas : erreur, chargement ou affichage des données utilisateur
	if (loading) {
		return <p>Chargement des données utilisateur...</p>;
	}

	if (!user) {
		return <p>Aucun utilisateur trouvé. Veuillez vous connecter.</p>;
	}

	return (
		<div className="flex height100vh">
			<h1>Bienvenue, {user.username}</h1>
		</div>
	);
};

export default Page;
