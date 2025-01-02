import dbConnect from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/UserModel';

export async function POST(req) {
	try {
		const { username, password } = await req.json();

		if (!username || !password) {
			return new Response(JSON.stringify({ error: 'Email et mot de passe sont requis' }), { status: 400 });
		}

		await dbConnect();

		const user = await User.findOne({ username });
		if (!user) {
			return new Response(JSON.stringify({ error: "Nom d'utilisateur ou mot de passe incorrect" }), { status: 401 });
		}
		const passwordTrimmed = password.trim();
		const isPasswordValid = await bcrypt.compare(passwordTrimmed, user.password);
		console.log('Mot de passe envoyé (trimmed) :', passwordTrimmed);
		console.log('Mot de passe en base:', user.password);
		console.log('Mot de passe valide:', isPasswordValid);

		if (!isPasswordValid) {
			return new Response(JSON.stringify({ error: "Nom d'utilisateur ou mot de passe incorrect" }), { status: 401 });
		}

		const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

		return new Response(JSON.stringify({ message: 'Connexion réussie' }), {
			status: 200,
			headers: {
				'Set-Cookie': `token=${token}; HttpOnly; Secure; Path=/; Max-Age=604800`,
				'Content-Type': 'application/json',
			},
		});
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500 });
	}
}
