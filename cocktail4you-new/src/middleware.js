import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req) {
	const token = req.cookies.get('auth_token'); // Récupère le token du cookie

	if (!token) {
		// Redirige l'utilisateur vers la page de connexion si le token est manquant
		return NextResponse.redirect(new URL('/connexion', req.url));
	}

	try {
		// Vérifie et décode le token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log('Token valide. Utilisateur :', decoded);

		// Ajouter les informations utilisateur dans les en-têtes pour un usage ultérieur
		const headers = new Headers(req.headers);
		headers.set('x-user', JSON.stringify(decoded));

		return NextResponse.next({
			request: {
				headers,
			},
		});
	} catch (err) {
		console.error('Token invalide ou expiré :', err.message);
		// Redirige vers la page de connexion si le token est invalide
		return NextResponse.redirect(new URL('/connexion', req.url));
	}
}

// Configurer les chemins auxquels le middleware s'applique
export const config = {
	matcher: ['/utilisateur/:path*'], // Appliquer au chemin utilisateur, à modifié !!
};
