import React, { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import "./choiceLanguage.scss";

const ChoiceLanguage = () => {
    const { isFrench, toggleLanguage } = useLanguage();
    const [open, setOpen] = useState(false);

    const handleLanguageChange = (lang) => {
        if ((lang === "fr" && !isFrench) || (lang === "en" && isFrench)) {
            toggleLanguage();
        }
        setOpen(false); // Fermer le menu après sélection
    };

    return (
        <div className="language-container">
            {isFrench ? (
                <p className="language-label" onClick={() => setOpen(!open)}>
                    Langues
                </p>
            ) : (
                <p className="language-label" onClick={() => setOpen(!open)}>
                    Language
                </p>
            )}
            {open && (
                <div className="language-dropdown">
                    <p onClick={() => handleLanguageChange("fr")}>Français</p>
                    <p onClick={() => handleLanguageChange("en")}>English</p>
                </div>
            )}
        </div>
    );
};

export default ChoiceLanguage;
