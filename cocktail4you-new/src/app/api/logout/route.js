import { NextResponse } from 'next/server';

export async function POST() {
	// Crée une réponse qui supprime le cookie `access_token`
	const response = NextResponse.json({ message: 'Déconnexion réussie' });
	response.cookies.set('access_token', '', {
		httpOnly: true,
		expires: new Date(0), // Expire immédiatement
	});
	response.cookies.set('refresh_token', '', {
		httpOnly: true,
		expires: new Date(0), // Expire immédiatement
	});

	return response;
}
