import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req) {
	const token = req.cookies.get('token'); // Récupère le token du cookie

	if (!token) {
		// Redirige l'utilisateur vers la page de connexion si le token est manquant
		return NextResponse.redirect(new URL('/connexion', req.url));
	}

	try {
		// Vérifie et décode le token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // Ajoute les infos utilisateur à la requête (optionnel)
		return NextResponse.next(); // Continue vers la route demandée
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
