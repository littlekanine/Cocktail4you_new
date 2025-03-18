'use client';

import { useState } from 'react';
import './page.scss';
import Button from '../components/buttons/Button';

export default function Contact() {
	const [formData, setFormData] = useState({ name: '', email: '', message: '' });
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (result.success) {
				setSuccess(true);
				setError(false);
				setFormData({ name: '', email: '', message: '' });
			} else {
				setError(true);
			}
		} catch {
			setError(true);
		}
	};

	return (
		<div className="flex center align-center column height100vh">
			<div className="contact flex center align-center column text-center padding10 scroll">
				<h1>Contactez-nous</h1>
				{success && <p className="text-green-500">Email envoyé avec succès ! ✅</p>}
				{error && <p className="text-red-500">Erreur lors de l'envoi ❌</p>}
				<form onSubmit={handleSubmit} className="flex column center align-center gap10">
					<div className="flex row center align-center">
						<label for="Nom">Nom </label>
						<input type="text" name="name" placeholder="Nom" required className="w-full p-2 border rounded" value={formData.name} onChange={handleChange} />
					</div>
					<div className="flex row center align-center">
						<label for="Email">Email </label>
						<input type="email" name="email" placeholder="Email" required className="w-full p-2 border rounded" value={formData.email} onChange={handleChange} />
					</div>
					<div>
						<label for="Message">Message </label>
						<textarea
							name="message"
							placeholder="Votre message"
							required
							className="w-full p-2 border rounded"
							value={formData.message}
							onChange={handleChange}
							rows="4"
						></textarea>
					</div>
					<Button text={'Envoyer'} type="submit" className="bg-blue-500 text-white px-4 py-2 rounded"></Button>
				</form>
			</div>
		</div>
	);
}
