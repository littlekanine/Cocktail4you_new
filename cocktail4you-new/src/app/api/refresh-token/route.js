// /src/app/api/refresh-token/route.js
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server'; // Utilisation de NextResponse

export async function POST(req) {
	// Récupération du refresh token depuis les cookies
	const refreshToken = req.cookies.get('refresh_token').value; // .get() pour obtenir les cookies

	if (!refreshToken) {
		return NextResponse.json({ error: 'Refresh token manquant' }, { status: 401 });
	}

	try {
		// Vérifie le refresh token
		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

		// Génère un nouveau token d'authentification
		const newToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
			expiresIn: '15m', // Expiration courte pour le token principal
		});

		// Retourner le nouveau token
		return NextResponse.json({ token: newToken }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Refresh token invalide ou expiré' }, { status: 401 });
	}
}
