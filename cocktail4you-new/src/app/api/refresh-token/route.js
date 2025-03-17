export const runtime = 'nodejs';

import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
	const refreshToken = req.cookies.get('refresh_token').value;

	if (!refreshToken) {
		return NextResponse.json({ error: 'Refresh token manquant' }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

		const newToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
			expiresIn: '15m',
		});

		return NextResponse.json({ token: newToken }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: 'Refresh token invalide ou expiré' }, { status: 401 });
	}
}
