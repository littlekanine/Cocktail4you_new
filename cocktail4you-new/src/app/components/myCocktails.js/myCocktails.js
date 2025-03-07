import { useEffect, useState } from "react";
import CocktailCardCrea from "../cocktailcard/cocktailCardCrea";
import "./myCocktails.scss";

export const MyCocktails = ({ userId }) => {
    const [cocktails, setCocktails] = useState([]);

    useEffect(() => {
        if (!userId) return;
        console.log(userId);

        const fetchUserCocktails = async () => {
            try {
                const res = await fetch(`/api/cocktails?userId=${userId}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || "Erreur de récupération");

                setCocktails(data);
            } catch (error) {
                console.error("Erreur :", error);
            }
        };

        fetchUserCocktails();
    }, [userId]);

    return (
        <div className="flex center align-center width250 column">
            <h2 className="title-my-cocktails">Mes Cocktails Créés</h2>
            <div className="flex center align-center cocktailsCrea">{cocktails.length > 0 ? cocktails.map((cocktail) => <CocktailCardCrea key={cocktail._id} cocktail={cocktail} userId={userId} />) : <p className="paragraphe">Pas de cocktails créés</p>}</div>
        </div>
    );
};

export default MyCocktails;
