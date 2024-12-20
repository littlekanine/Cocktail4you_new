'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import './waiting.scss';

export default function WaitingConfirmPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const name = searchParams.get('name');
	const email = searchParams.get('email');
	const token = searchParams.get('token'); // Token envoyé dans l'URL
	const [message, setMessage] = useState(''); // Message à afficher à l'utilisateur
	const [loading, setLoading] = useState(true);

	console.log('Requête reçue pour la vérification de token :', token);

	useEffect(() => {
		if (token) {
			// Si le token est présent, on envoie une requête pour vérifier l'email
			fetch(`/api/user/verify?token=${token}`, {
				method: 'GET',
			})
				.then((response) => {
					if (response.ok) {
						// Si la réponse est ok, on redirige vers la page de succès
						router.push('/verify-issue/success');
					} else {
						// Sinon, rediriger vers la page d'erreur
						router.push('/verify-issue/error');
					}
				})
				.catch(() => {
					// En cas d'erreur de réseau, rediriger vers une page d'erreur
					router.push('/verify-issue/error');
				});
		} else {
			setMessage('Le token de vérification est manquant. Veuillez vérifier le lien.');
			setLoading(false);
		}
	}, [token, router]);

	useEffect(() => {
		if (name && email) {
			setMessage(`Bonjour ${name}, un email de confirmation a été envoyé à ${email}. Veuillez vérifier votre boîte de réception.`);
		} else {
			setMessage('Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.');
		}
	}, [name, email]);

	return (
		<div className="flex text-center center align-center column height100vh gap10">
			<h1 className="shadow">Validation en cours...</h1>
			<p className="text-center center align-center shadow">{message}</p>
			<p className="shadow">Une fois votre email confirmé, vous pourrez continuer.</p>
		</div>
	);
}
