import React, { useState, useEffect } from 'react';
import './fileUpload.scss';

const FileUpload = ({ handleFileChange }) => {
	const [fileName, setFileName] = useState('');
	const [preview, setPreview] = useState(null);
	const [uploading, setUploading] = useState(true);

	// Ce useEffect sera exécuté quand un fichier est sélectionné
	useEffect(() => {
		// Si un fichier est sélectionné, créez un lien de prévisualisation
		if (fileName) {
			const file = URL.createObjectURL(fileName);
			setPreview(file);
		}
	}, [fileName]); // Réexécute chaque fois que fileName change

	const handleChange = (e) => {
		const file = e.target.files[0]; // Récupère le fichier
		if (file) {
			setFileName(file); // Met à jour le fichier sélectionné
			handleFileChange(e); // Passe l'événement au parent pour gérer l'upload
			setUploading(false); // Met à jour l'état pour afficher l'image au lieu du bouton
		}
	};

	const handleRemove = () => {
		setFileName(null); // Réinitialise le fichier sélectionné
		setPreview(null); // Réinitialise l'aperçu
		setUploading(true); // Remet l'état de l'upload à "en attente"
	};

	return (
		<div className="flex flex-col items-center gap-3">
			{uploading ? (
				// Affichage du bouton pour choisir un fichier
				<div className="flex center align-center widthFull">
					<label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
						📷 Choisir une photo
					</label>
					<input type="file" id="file-upload" className="hidden" onChange={handleChange} required accept="image/*" />
				</div>
			) : (
				// Affichage de l'aperçu de l'image et du bouton supprimer
				<div className="relative flex row gap20 center align-center widthFull">
					<img src={preview} alt="Aperçu" className="imageUpload shadow" />
					<button onClick={handleRemove} className="cross">
						❌
					</button>
				</div>
			)}
		</div>
	);
};

export default FileUpload;
