import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
	if (!token) {
		throw new Error('Token manquant');
	}
	return jwt.verify(token, process.env.JWT_SECRET);
};
