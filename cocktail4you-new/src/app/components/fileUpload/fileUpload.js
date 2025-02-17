import React, { useState } from "react";

const FileUpload = ({ handleFileChange }) => {
    const [fileName, setFileName] = useState("");

    const handleChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
            handleFileChange(e); // Transmet le fichier au parent
        }
    };

    return (
        <div className="flex center align-center">
            {/* Bouton stylisé pour choisir un fichier */}
            <label htmlFor="file-upload" className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
                📷 Choisir une photo
            </label>

            {/* Input file caché */}
            <input type="file" id="file-upload" className="hidden" onChange={handleChange} required />

            {/* Affichage du nom du fichier sélectionné */}
            {fileName && <p className="text-sm text-gray-600">{fileName}</p>}
        </div>
    );
};

export default FileUpload;