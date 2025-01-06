'use client';

import React from 'react';
import './page.scss';
import '../homePage/homePage.scss';
import { useAuth } from '../context/AuthContext';
import Button from '../components/buttons/Button';

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
		<div className="flex  height100vh  shadow column">
			<h1 className="flex center">Bienvenue, {user.username}</h1>
			<div className="flex center align-center gap20  heightFull column">
				<Button className="width250" text={'Partager ma création'} />
				<Button className="width250" text={'Mes créations'} />
				<Button className="width250" text={"Mention j'aime"} />
				<Button className="width250" text={'Créer ma liste de course'} />
				<Button className="width250" text={'Mes listes'} />
			</div>
		</div>
	);
};

export default Page;
