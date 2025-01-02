'use client';

import './page.scss';
import '../homePage/homePage.scss';
import Link from 'next/link';
import Button from '../components/buttons/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
	const [formData, setFormData] = useState({ email: '', username: '', password: '' });
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const validateForm = () => {
		if (!/\S+@\S+\.\S+/.test(formData.email)) {
			setError('Veuillez entrer une adresse email valide.');
			return false;
		}
		if (formData.password.length < 6) {
			setError('Le mot de passe doit contenir au moins 6 caractères.');
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setMessage('');

		if (!validateForm()) return;

		setIsLoading(true);
		try {
			const response = await fetch('/api/user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) throw new Error(data.error || 'Une erreur est survenue.');

			// Redirection
			if (data.redirectTo) {
				router.push(data.redirectTo);
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="height100vh flex">
			<div className="connexion-container flex center align-center widthFull column">
				<h1 className="flex center widthFull title-connexion shadow">Rejoignez-nous !</h1>
				<div className="flex connexion column">
					<form onSubmit={handleSubmit} className="flex height100vh column center align-center gap10">
						<div className="flex column center width80">
							<label htmlFor="email">Email</label>
							<input id="email" type="text" name="email" value={formData.email} onChange={handleChange} required />
						</div>
						<div className="flex column center width80">
							<label htmlFor="username">Nom d'utilisateur</label>
							<input id="username" type="text" name="username" value={formData.username} onChange={handleChange} required autoComplete="username" />
						</div>
						<div className="flex column center width80 margin10Bottom">
							<label htmlFor="password">Mot de passe</label>
							<input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required autoComplete="new-password" />
						</div>
						<div className="flex center margin10Bottom">
							<Button text={isLoading ? 'Chargement...' : 'Inscription'} className="flex center align-center connexion-button" disabled={isLoading} />
						</div>
					</form>
					{error && (
						<p aria-live="polite" className="flex center align-center error-message">
							{error}
						</p>
					)}
					{message && (
						<p aria-live="polite" className="flex center align-center success-message">
							{message}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Page;
