import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req) {
	const token = req.cookies.get('auth_token');

	if (!token) {
		return NextResponse.redirect(new URL('/connexion', req.url));
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const headers = new Headers(req.headers);
		headers.set('x-user', JSON.stringify(decoded));

		return NextResponse.next({
			request: {
				headers,
			},
		});
	} catch (err) {
		console.error('Token invalide ou expiré :', err.message);
		return NextResponse.redirect(new URL('/connexion', req.url));
	}
}

export const config = {
	matcher: ['/utilisateur/:path*'],
};
