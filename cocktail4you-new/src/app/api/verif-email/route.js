'use client'

import { redirect } from 'next/dist/server/api-utils';
import dbConnect from '../../../../lib/mongodb';
import User from './userModel'; 
import { useRouter } from 'next/router';

export async function GET(req) {
	const router = useRouter();
	try {
		const { searchParams } = new URL(req.url);
		const token = searchParams.get('token');

		await dbConnect();

		const user = await User.findOne({
			emailVerificationToken: token,
			emailVerificationExpires: { $gt: Date.now() }, 
		});

		if (!user) {
			return new Response(JSON.stringify({ error: 'Lien invalide ou expiré' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		user.isEmailVerified = true;
		user.emailVerificationToken = undefined;
		user.emailVerificationExpires = undefined;
		await user.save();

		return new Response(JSON.stringify({ message: 'Email confirmé avec succès' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	}
}
