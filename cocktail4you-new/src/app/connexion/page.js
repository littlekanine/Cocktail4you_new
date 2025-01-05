'use client';

import './page.scss';
import '../homePage/homePage.scss';
import Link from 'next/link';
import Button from '../components/buttons/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const Page = () => {
	const { checkAuth } = useAuth();
	const [formData, setFormData] = useState({ username: '', password: '' });
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const validateForm = () => {
		if (!formData.username || !formData.password) {
			setError('Veuillez remplir tous les champs.');
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
			const response = await fetch('/api/connexion-user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: formData.username,
					password: formData.password,
				}),
			});
			const data = await response.json();
			await checkAuth();

			if (!response.ok) throw new Error(data.error || 'Une erreur est survenue.');

			// Stockage du token dans le localStorage
			if (data.token) {
				localStorage.setItem('auth_token', data.token);
			}

			if (data.redirectTo) {
				router.push(data.redirectTo);
			} else {
				router.push('/');
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
				<h1 className="flex center widthFull title-connexion shadow">Accéder à votre espace personnel</h1>
				<div className="flex connexion column center align-center">
					<form onSubmit={handleSubmit} className="flex height100vh column center align-center width80">
						<div className="nomUtilisateur flex column center width80">
							<p>Nom d&apos;utilisateur</p>
							<label htmlFor="username"></label>
							<input type="text" name="username" id="username" autoComplete="username" value={formData.username} onChange={handleChange} required />
							<div className="flex center">
								<p>Nom d&apos;utilisateur oublié ?</p>
							</div>
						</div>

						<div className="flex column center width80 margin10Bottom">
							<p>Mot de passe</p>
							<label htmlFor="password"></label>
							<input
								type="password"
								name="password"
								id="password"
								autoComplete="current-password"
								value={formData.password}
								onChange={handleChange}
								required
							/>
							<div className="flex center">
								<p>Mot de passe oublié ?</p>
							</div>
						</div>

						<div className="flex center margin10Bottom">
							<Button text={isLoading ? 'Chargement...' : 'Connexion'} className="flex center align-center connexion-button" disabled={isLoading} />
						</div>
					</form>

					{/* Affichage des messages d'erreur ou de succès */}
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

					<Link href="/inscription">
						<div>
							<p className="font400">S&apos;inscrire</p>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Page;
