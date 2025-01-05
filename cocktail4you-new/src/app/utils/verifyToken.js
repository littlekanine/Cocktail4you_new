import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
	if (!token) {
		throw new Error('Token manquant');
	}

	try {
		// Vérifie et décode le token avec le secret
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (error) {
		// Gestion des erreurs de vérification du token
		if (error instanceof jwt.JsonWebTokenError) {
			throw new Error('Token invalide ou malformé');
		} else if (error instanceof jwt.TokenExpiredError) {
			throw new Error('Token expiré');
		} else {
			throw new Error('Erreur lors de la vérification du token');
		}
	}
};
