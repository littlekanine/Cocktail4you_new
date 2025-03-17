export const runtime = 'nodejs';

import dbConnect from '../../../../lib/mongodb';
import { verifyToken } from '../../utils/verifyToken';
import User from '../../../app/models/UserModel';
import { NextResponse } from 'next/server';

export async function GET(req) {
	const token = req.cookies.get('access_token');
	const tokenValue = token ? token.value : null;

	if (!tokenValue) {
		return NextResponse.json({ error: 'Non autorisé, aucun token trouvé' }, { status: 401 });
	}

	try {
		const decoded = verifyToken(tokenValue);

		await dbConnect();

		const user = await User.findById(decoded.id).select('-password');

		if (!user) {
			return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
		}

		return NextResponse.json({ user });
	} catch (err) {
		console.error('Erreur lors de la vérification du token :', err);
		return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
	}
}
