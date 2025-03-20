// @ts-ignore

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/UserModel';

export async function POST(req) {
	try {
		const { username, password } = await req.json();
		console.log('Tentative de connexion pour :', username);
		console.log('Mot de passe	:', password);

		await dbConnect();

		if (!username || !password) {
			return NextResponse.json({ error: 'Requête invalide : fournir un nom d’utilisateur et un mot de passe' }, { status: 400 });
		}

		const user = await User.findOne({ username });

		if (!user) {
			return NextResponse.json({ error: "Nom d'utilisateur ou mot de passe incorrect" }, { status: 401 });
		}

		const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
		if (!isPasswordValid) {
			console.log('Mot de passe entré :', password.trim());
			console.log('Mot de passe stocké :', user.password);

			console.log('Comparaison bcrypt :', isPasswordValid);
			return NextResponse.json({ error: "Nom d'utilisateur ou mot de passe incorrect" }, { status: 401 });
		}

		// Générer les tokens
		const auth_token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '3h' });
		const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

		// Définir les cookies proprement avec `cookies().set()`
		cookies().set('access_token', auth_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // Secure en production
			maxAge: 10800, // 3h
			path: '/',
			sameSite: 'Strict',
		});

		cookies().set('refresh_token', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 604800, // 7 jours
			path: '/',
			sameSite: 'Strict',
		});

		return NextResponse.json({ message: 'Connexion réussie', redirectTo: '/user-space' }, { status: 200 });
	} catch (err) {
		console.error('Erreur interne :', err);
		return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
	}
}
