import React, { createContext, useState,useContext  } from "react";

export const PostCocktailsContext = createContext();

export const useCrea = () => {
    return useContext(PostCocktailsContext);
};

export const PostCocktailsProvider = ({ children }) => {
    const [cocktails, setCocktails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const postCocktail = async (cocktail) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post("api/cocktailsCrea", cocktail);
            setCocktails([...cocktails, response.data]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return <PostCocktailsContext.Provider value={{ cocktails, postCocktail, loading, error }}>{children}</PostCocktailsContext.Provider>;
};
