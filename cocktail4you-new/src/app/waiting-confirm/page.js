// waiting-confirm/page.js

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import './waiting.scss';

function WaitingConfirmPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const name = searchParams.get('name');
	const email = searchParams.get('email');
	const token = searchParams.get('token');
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (token) {
			fetch(`/api/user/verify?token=${token}`, {
				method: 'GET',
			})
				.then((response) => {
					if (response.ok) {
						router.push('/verify-issue/success');
					} else {
						router.push('/verify-issue/error');
					}
				})
				.catch(() => {
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

// Enrouler votre composant avec Suspense pour gérer l'exécution côté client
export default function WaitingPageWithSuspense() {
	return (
		<Suspense fallback={<div>Chargement...</div>}>
			<WaitingConfirmPage />
		</Suspense>
	);
}
