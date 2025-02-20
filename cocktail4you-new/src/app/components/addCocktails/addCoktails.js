import React, { useState } from "react";
import "./addCocktails.scss";
import FileUpload from "../fileUpload/fileUpload";
import { useCocktails } from "@/app/context/CocktailContext";
import { useCrea } from "@/app/context/PostCocktails";



const AddCocktails = ({ onClose }) => {
    const [form, setForm] = useState({
        name: "",
        alcohols: "",
        instructions: "",
        category: "",
        glassType: "",
        decoration: "",
        history: "",
        photo: null,
    });

	const postCocktail = useCrea();

	const isFrench = useCocktails

    const categories = ["Classique", "Tendance", "Création", "Sans Alcool"];
    const cocktailGlasses = ["Verre à Martini", "Highball", "Old Fashioned (Lowball)", "Verre à Margarita", "Flûte à Champagne", "Verre à Tiki", "Verre Collins", "Coupette", "Verre à Irish Coffee"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setForm({
            ...form,
            photo: e.target.files[0],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique pour soumettre le formulaire
        console.log(form);
    };

    const [alcohols, setAlcohols] = useState([{ name: "", dosage: "" }]);

    // 🔄 Mettre à jour un input en fonction de son index
    const handleChangeAlcohol = (index, event) => {
        const { name, value } = event.target;
        const newAlcohols = [...alcohols];

        newAlcohols[index] = {
            ...newAlcohols[index],
            [name]: value, // Met à jour la bonne propriété (name ou dosage)
        };

        setAlcohols(newAlcohols);
    };

    // ➕ Ajouter un nouvel input vide
    const addAlcohol = () => {
        setAlcohols([...alcohols, ""]);
    };

    const removeAlcohol = (index) => {
        if (alcohols.length > 1) {
            const newAlcohols = alcohols.filter((_, i) => i !== index);
            setAlcohols(newAlcohols);
        }
    };

    return (
        <div className="flex center align center column gap20 containerAdd relative">
            <button className="closeButton" onClick={onClose}>
                ×
            </button>
			{isFrench ? <h2 className="titleAddCocktail flex center align-center ">Ajouter un Cocktail</h2> : <h2 className="titleAddCocktail flex center align-center ">Add a Cocktail</h2>}
            {/* <h2 className="titleAddCocktail flex center align-center ">Ajouter un Cocktail</h2> */}

            <form className="flex center align-center column gap10" onSubmit={handleSubmit}>
                <div className=" flex column gap5 width90">
                    <label className="textAddCocktails">Nom du Cocktail :</label>
                    <input className="flex padding10  font20" type="text" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="flex  column gap5 width90 ">
                    <label>Alcools et Dosage :</label>
                    {alcohols.map((alcohol, index) => (
                        <div key={index} className="flex  gap10">
                            <div className="flex row align-center gap10">
                                {/* Input pour le nom de l'alcool */}
                                <input type="text" name="name" value={alcohol.name} placeholder="Alcool" onChange={(e) => handleChangeAlcohol(index, e)} required className="inputAlcohol flex padding10  font20" />

                                {/* Input pour le dosage */}
                                <input type="text" name="dosage" placeholder="40" value={alcohol.dosage} onChange={(e) => handleChangeAlcohol(index, e)} required className="inputDosage flex padding10  font20" />
                                <p className="ml">ml</p>
                            </div>
                            {alcohols.length > 1 && (
                                <button type="button" className="button-" onClick={() => removeAlcohol(index)}>
                                    -
                                </button>
                            )}
                        </div>
                    ))}
                    <button className="flex center align-center buttonAddAlcohol" onClick={addAlcohol}>
                        +
                    </button>
                </div>
                <div className=" flex column gap5 width90">
                    <label>Instructions :</label>
                    <textarea className="flex no-resize padding10  font20" name="instructions" value={form.instructions} onChange={handleChange} required></textarea>
                </div>
                <div className=" flex column gap5 width90">
                    <label>Catégorie :</label>
                    <select className="flex padding10 font20" name="category" value={form.category} onChange={handleChange} required>
                        <option value="" disabled>
                            Choisir une catégorie
                        </option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>{" "}
                </div>
                <div className=" flex column gap5 width90">
                    <label>Type de Verre :</label>
                    <select className="flex padding10 font20" name="glassType" value={form.glassType} onChange={handleChange} required>
                        <option value="" disabled>
                            Choisir un verre
                        </option>
						{cocktailGlasses.map((glass, index) => (
							<option key={index} value={glass}>
								{glass}
							</option>
						))}
                    </select>
                </div>
                <div className=" flex column gap5 width90">
                    <label>Décoration :</label>
                    <input className="flex padding10  font20" type="text" name="decoration" value={form.decoration} onChange={handleChange} optional />
                </div>
                <div className=" flex column gap5 width90">
                    <label>Historique :</label>
                    <textarea type="text" className="flex padding10  font20  no-resize" name="history" value={form.history} onChange={handleChange} optional></textarea>
                </div>
                <div className=" flex column gap5 width90">
                    <FileUpload handleFileChange={handleFileChange} />
                </div>
                <button type="submit" onClick={postCocktail}>Ajouter</button>
            </form>
        </div>
    );
};

export default AddCocktails;
