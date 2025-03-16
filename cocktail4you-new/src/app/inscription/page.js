'use client';

import './page.scss';
import '../homePage/homePage.scss';
import Link from 'next/link';
import Button from '../components/buttons/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useGoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import axios from 'axios';

const SignupForm = () => {
	const [formData, setFormData] = useState({ email: '', username: '', password: '' });
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { isFrench } = useLanguage();
	const { executeRecaptcha } = useGoogleReCaptcha();

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
			// Vérifier si reCAPTCHA est bien chargé
			if (!executeRecaptcha) {
				setError('reCAPTCHA non chargé, essayez de recharger la page.');
				setIsLoading(false);
				return;
			}

			const gRecaptchaToken = await executeRecaptcha('signup');

			// Envoyer les données + token reCAPTCHA au serveur
			const response = await fetch('/api/user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ ...formData, gRecaptchaToken }),
			});

			const data = await response.json();

			if (!response.ok) throw new Error(data.error || 'Une erreur est survenue.');

			// Redirection si l'inscription est réussie
			if (data.redirectTo) {
				router.push(data.redirectTo);
			} else {
				setMessage('Inscription réussie !');
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
				{isFrench ? <h1 className="flex center widthFull title-connexion ">Rejoignez-nous !</h1> : <h1 className="flex center widthFull title-connexion ">Join us !</h1>}

				<div className="flex connexion column">
					<form onSubmit={handleSubmit} className="flex height100vh column center align-center gap10">
						<div className="flex column center width80">
							<label className="Karantina" htmlFor="email">
								Email
							</label>
							<input id="email" type="text" name="email" value={formData.email} onChange={handleChange} required />
						</div>
						<div className="flex column center width80">
							{isFrench ? <label htmlFor="username">Nom d&apos;utilisateur</label> : <label htmlFor="username">Username</label>}
							<input id="username" type="text" name="username" value={formData.username} onChange={handleChange} required autoComplete="username" />
						</div>
						<div className="flex column center width80 margin10Bottom">
							{isFrench ? <label htmlFor="password">Mot de passe</label> : <label htmlFor="password">Password</label>}

							<input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required autoComplete="new-password" />
						</div>
						<div className="flex center margin10Bottom">
							{isFrench ? (
								<Button text={isLoading ? 'Chargement...' : 'Inscription'} className="flex center align-center connexion-button" disabled={isLoading} />
							) : (
								<Button text={isLoading ? 'Chargement...' : 'Sign up'} className="flex center align-center connexion-button" disabled={isLoading} />
							)}
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

const Page = () => {
	return (
		<GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
			<SignupForm />
		</GoogleReCaptchaProvider>
	);
};

export default Page;
