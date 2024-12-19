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
	const [message, setMessage] = useState('');

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
