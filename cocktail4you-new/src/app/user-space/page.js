"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Button from "../components/buttons/Button";
import Link from "next/link";
import AddCocktails from "../components/addCocktails/addCoktails";
import { set } from "mongoose";
import './page.scss';

const Page = () => {
    const { user, loading, logout } = useAuth(); // Récupère l'utilisateur et l'état de chargement depuis le contexte
    const [isClient, setIsClient] = useState(false); // État pour vérifier si le composant est monté côté client
    const router = useRouter();
    const { isFrench } = useLanguage(); // Langue actuelle (français ou non)
    const [showAddCocktails, setShowAddCocktails] = useState(false);

    useEffect(() => {
        setIsClient(true); // Lorsque le composant est monté côté client
    }, []);

    // Gestion des cas : erreur, chargement ou affichage des données utilisateur
    if (loading) {
        return <p>{isFrench ? "Chargement des données utilisateur..." : "Loading user data..."}</p>;
    }

    if (!user) {
        return <p>{isFrench ? "Aucun utilisateur trouvé. Veuillez vous connecter." : "No user found. Please log in."}</p>;
    }

    // Fonction de déconnexion
    const handleLogout = async () => {
        try {
            await logout(); // Appelle la fonction `logout` du contexte
            router.push("/"); // Redirige l'utilisateur vers la page d'accueil après déconnexion
        } catch (error) {
            console.error(isFrench ? "Erreur lors de la déconnexion :" : "Error during logout:", error);
            alert(isFrench ? "Erreur lors de la déconnexion" : "Error during logout");
        }
    };

    // Attendez que le composant soit monté côté client pour utiliser useRouter
    if (!isClient) {
        return null; // Ne pas rendre le composant avant que le hook soit disponible
    }

    const handleAddCocktails = () => {
        setShowAddCocktails(!showAddCocktails);
    };

    const handleCloseAddCocktails = () => {
        setShowAddCocktails(false);
    };

    return (
        <div className="flex height100vh shadow column">
            <div className="flex center align-center gap20 heightFull column">
                <h1 className="flex center">{isFrench ? `Bienvenue, ${user.username}` : `Welcome, ${user.username}`}</h1>
                <div className="flex column gap20 scroll choiceContainer hideScroll">
                    <Button className="width250" text={isFrench ? "Partager ma création" : "Share My Creation"} onClick={handleAddCocktails} />
                    {showAddCocktails && <AddCocktails onClose={handleCloseAddCocktails} />}
                    <Button className="width250" text={isFrench ? "Mes créations" : "My Creations"} />
                    <Link href="./liked">
                        <Button className="width250" text={isFrench ? "Mentions j'aime" : "Likes"} />
                    </Link>
                    <Button className="width250" text={isFrench ? "Créer ma liste de courses" : "Create My Shopping List"} />
                    <Button className="width250" text={isFrench ? "Mes listes" : "My Lists"} />
                    <Button className="width250" text={isFrench ? "Déconnexion" : "Logout"} onClick={handleLogout} />
                </div>
            </div>
        </div>
    );
};

export default Page;
