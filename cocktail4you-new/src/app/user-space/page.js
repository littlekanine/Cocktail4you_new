'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/buttons/Button';
import Link from 'next/link';
import AddCocktails from '../components/addCocktails/addCoktails';
import MyCocktails from '../components/myCocktails.js/myCocktails';
import Liked from '../liked/liked';
import { motion, AnimatePresence } from 'framer-motion';
import './page.scss';

const Page = () => {
	const { user, loading, logout } = useAuth();
	const [isClient, setIsClient] = useState(false);
	const router = useRouter();
	const { isFrench } = useLanguage();
	const [activeSection, setActiveSection] = useState(null);
	const toggleSection = (section) => {
		if (activeSection === section) {
			setActiveSection(null);
		} else {
			setActiveSection(section);
		}
	};

	const variants = {
		hidden: { opacity: 0, y: -20 },
		visible: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 20 },
	};

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (loading) {
		return <p>{isFrench ? 'Chargement des données utilisateur...' : 'Loading user data...'}</p>;
	}

	if (!user) {
		return <p>{isFrench ? 'Aucun utilisateur trouvé. Veuillez vous connecter.' : 'No user found. Please log in.'}</p>;
	}

	const handleLogout = async () => {
		try {
			await logout();
			router.push('/');
		} catch (error) {
			console.error(isFrench ? 'Erreur lors de la déconnexion :' : 'Error during logout:', error);
			alert(isFrench ? 'Erreur lors de la déconnexion' : 'Error during logout');
		}
	};

	if (!isClient) {
		return null;
	}

	return (
		<div className="flex height100vh  column">
			<div className="flex center align-center gap20 heightFull column container">
				<h2 className="flex center">{loading ? (isFrench ? 'Chargement...' : 'Loading...') : isFrench ? `Bienvenue, ${user.username}` : `Welcome, ${user.username}`}</h2>
				<div className="flex column gap20 center align-center choicecontainer hideScroll padding20">
					<Button className="button-user-space widthFull" text={isFrench ? 'Partager ma création' : 'Share My Creation'} onClick={() => toggleSection('addCocktails')} />
					<AnimatePresence>
						{activeSection === 'addCocktails' && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: '80vh', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.3, ease: 'easeInOut' }}
								className="modal-container"
							>
								<AddCocktails onClose={() => setActiveSection(null)} />
							</motion.div>
						)}
					</AnimatePresence>

					<Button className="button-user-space widthFull" text={isFrench ? 'Mes créations' : 'My Creations'} onClick={() => toggleSection('myCocktails')} />
					<AnimatePresence>
						{activeSection === 'myCocktails' && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.3, ease: 'easeInOut' }}
								className="width90 modal-container"
							>
								<MyCocktails onClose={() => setActiveSection(null)} />
							</motion.div>
						)}
					</AnimatePresence>

					<Button className="button-user-space widthFull" text={isFrench ? "Mentions j'aime" : 'Likes'} onClick={() => toggleSection('liked')} />
					<AnimatePresence>
						{activeSection === 'liked' && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.3, ease: 'easeInOut' }}
								className="width90 modal-container"
							>
								<Liked onClose={() => setActiveSection(null)} />
							</motion.div>
						)}
					</AnimatePresence>
					<Button className=" button-user-space widthFull margin-botom20" text={isFrench ? 'Déconnexion' : 'Logout'} onClick={handleLogout} />
				</div>
			</div>
		</div>
	);
};

export default Page;
