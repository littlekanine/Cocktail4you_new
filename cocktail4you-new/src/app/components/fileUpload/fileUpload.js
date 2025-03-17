import React, { useState, useEffect } from 'react';
import './fileUpload.scss';

const FileUpload = ({ handleFileChange }) => {
	const [fileName, setFileName] = useState('');
	const [preview, setPreview] = useState(null);
	const [uploading, setUploading] = useState(true);

	useEffect(() => {
		if (fileName) {
			const file = URL.createObjectURL(fileName);
			setPreview(file);
		}
	}, [fileName]);

	const handleChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFileName(file);
			handleFileChange(e);
			setUploading(false);
		}
	};

	const handleRemove = () => {
		setFileName(null);
		setPreview(null);
		setUploading(true);
	};

	return (
		<div className="flex flex-col items-center gap-3">
			{uploading ? (
				<div className="flex center align-center widthFull">
					<label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
						📷 Choisir une photo
					</label>
					<input type="file" id="file-upload" className="hidden" onChange={handleChange} required accept="image/*" />
				</div>
			) : (
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
