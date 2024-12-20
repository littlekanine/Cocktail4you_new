'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
	const router = useRouter();
	const [isValidating, setIsValidating] = useState(true); // État pour gérer l'attente
	const [error, setError] = useState(null);

	useEffect(() => {
		// Vérifiez si les paramètres sont disponibles
		const searchParams = new URLSearchParams(window.location.search);
		const token = searchParams.get('token');

		if (token) {
			// Appeler l'API backend pour valider le token
			fetch(`/api/user/verify?token=${token}`, {
				method: 'GET',
			})
				.then((response) => {
					if (response.ok) {
						router.push('/verify-issue/success');
					} else {
						setError('Token invalide ou expiré.');
						setTimeout(() => router.push('/verify-issue/error'), 2000);
					}
				})
				.catch(() => {
					setError('Erreur réseau lors de la validation.');
					setTimeout(() => router.push('/error'), 2000);
				})
				.finally(() => setIsValidating(false));
		} else {
			setError('Aucun token fourni.');
			setTimeout(() => router.push('/verify-issue/error'), 2000);
		}
	}, [router]);

	return (
		<div>
			<h1>{isValidating ? 'Validation en cours...' : 'Résultat de la validation'}</h1>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{isValidating && <p>Veuillez patienter pendant que nous validons votre compte.</p>}
		</div>
	);
}
