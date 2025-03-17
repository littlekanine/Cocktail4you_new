export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function POST() {
	const response = NextResponse.json({ message: 'Déconnexion réussie' });
	response.cookies.set('access_token', '', {
		httpOnly: true,
		expires: new Date(0),
	});
	response.cookies.set('refresh_token', '', {
		httpOnly: true,
		expires: new Date(0),
	});

	return response;
}
