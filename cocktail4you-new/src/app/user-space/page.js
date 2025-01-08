'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Button from '../components/buttons/Button';

const Page = () => {
	const { user, loading, logout } = useAuth(); // Récupère l'utilisateur et l'état de chargement depuis le contexte
	const [isClient, setIsClient] = useState(false); // État pour vérifier si le composant est monté côté client
	const router = useRouter();

	useEffect(() => {
		setIsClient(true); // Lorsque le composant est monté côté client
	}, []);

	// Gestion des cas : erreur, chargement ou affichage des données utilisateur
	if (loading) {
		return <p>Chargement des données utilisateur...</p>;
	}

	if (!user) {
		return <p>Aucun utilisateur trouvé. Veuillez vous connecter.</p>;
	}

	// Fonction de déconnexion
	const handleLogout = async () => {
		try {
			await logout(); // Appelle la fonction `logout` du contexte
			router.push('/'); // Redirige l'utilisateur vers la page d'accueil après déconnexion
		} catch (error) {
			console.error('Erreur lors de la déconnexion :', error);
			alert('Erreur lors de la déconnexion');
		}
	};

	// Attendez que le composant soit monté côté client pour utiliser useRouter
	if (!isClient) {
		return null; // Ne pas rendre le composant avant que le hook soit disponible
	}

	return (
		<div className="flex height100vh shadow column">
			<h1 className="flex center">Bienvenue, {user.username}</h1>
			<div className="flex center align-center gap20 heightFull column">
				<Button className="width250" text={'Partager ma création'} />
				<Button className="width250" text={'Mes créations'} />
				<Button className="width250" text={"Mention j'aime"} />
				<Button className="width250" text={'Créer ma liste de course'} />
				<Button className="width250" text={'Mes listes'} />
				<Button className="width250" text={'Deconnexion'} onClick={handleLogout} />
			</div>
		</div>
	);
};

export default Page;
