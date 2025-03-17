export const runtime = 'nodejs';

import dbConnect from '../../../../lib/mongodb';
import User from '../../models/UserModel';

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const token = searchParams.get('token');
	const id = searchParams.get('id');

	if (!token || !id) {
		return new Response(JSON.stringify({ error: 'Token ou ID manquant' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		await dbConnect();

		const user = await User.findOne({
			emailVerificationToken: token,
			emailVerificationExpires: { $gt: Date.now() },
		});

		if (!user) {
			return new Response(JSON.stringify({ error: 'Token invalide ou expiré' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		user.isEmailVerified = true;
		user.emailVerificationToken = undefined;
		user.emailVerificationExpires = undefined;
		await user.save();

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/verify-issue/success',
			},
		});
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
