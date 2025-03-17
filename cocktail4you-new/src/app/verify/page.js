'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

export default function VerifyPage() {
	const router = useRouter();
	const [isValidating, setIsValidating] = useState(true);
	const [error, setError] = useState(null);
	const { isFrench } = useLanguage();

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const token = searchParams.get('token');

		if (token) {
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
			{isValidating && (isFrench ? <p>Veuillez patienter pendant que nous validons votre compte.</p> : <p>Please wait while we validate your account.</p>)}
		</div>
	);
}
