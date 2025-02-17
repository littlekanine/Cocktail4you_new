import React, { useState } from "react";
import "./addCocktails.scss";
import FileUpload from "../fileUpload/fileUpload";

const AddCocktails = () => {
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

    const [alcohols, setAlcohols] = useState([""]); // Initialisation avec un champ vide

    // 🔄 Mettre à jour un input en fonction de son index
    const handleChangeAlcohol = (index, event) => {
        const newAlcohols = [...alcohols];
        newAlcohols[index] = event.target.value;
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
        <div className="flex center align center column gap20 containerAdd">
            <h2 className="title flex center ">Ajouter un Cocktail</h2>
            <form className="flex center align-center column gap10" onSubmit={handleSubmit}>
                <div className=" flex column gap5">
                    <label className="textAddCocktails">Nom du Cocktail:</label>
                    <input className="flex" type="text" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="flex column gap5">
                    <label>Alcools et Dosage:</label>
                    {alcohols.map((alcohol, index) => (
                        <div key={index} className="flex gap5">
                            <input className="flex" type="text" name={`alcohols-${index}`} value={alcohol} onChange={(e) => handleChangeAlcohol(index, e)} required />
                            {alcohols.length > 1 && (
                                <button type="button" onClick={() => removeAlcohol(index)}>
                                    -
                                </button>
                            )}
                        </div>
                    ))}
                    <button className="flex center align-center buttonAddAlcohol" onClick={addAlcohol}>
                        +
                    </button>
                </div>
                <div className=" flex column gap5">
                    <label>Instructions:</label>
                    <textarea className="flex" name="instructions" value={form.instructions} onChange={handleChange} required></textarea>
                </div>
                <div className=" flex column gap5">
                    <label>Catégorie:</label>
                    <input className="flex" type="text" name="category" value={form.category} onChange={handleChange} required />
                </div>
                <div className=" flex column gap5">
                    <label>Type de Verre:</label>
                    <input className="flex" type="text" name="glassType" value={form.glassType} onChange={handleChange} required />
                </div>
                <div className=" flex column gap5">
                    <label>Décoration:</label>
                    <input className="flex" type="text" name="decoration" value={form.decoration} onChange={handleChange} optional />
                </div>
                <div className=" flex column gap5">
                    <label>Historique:</label>
                    <textarea className="flex" name="history" value={form.history} onChange={handleChange} optional></textarea>
                </div>
                <div className=" flex column gap5">
                    <FileUpload handleFileChange={handleFileChange} />
                </div>
                <button type="submit">Ajouter</button>
            </form>
        </div>
    );
};

export default AddCocktails;
