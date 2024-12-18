import dbConnect from '../../../../lib/mongodb'; // Connexion à la DB
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '@/app/models/UserModel';

async function sendVerificationEmail(email, token) {
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		const verificationUrl = `${process.env.BASE_URL}/api/user/verify?token=${token}`;

		// Contenu de l'e-mail
		const mailOptions = {
			from: process.env.EMAIL_USER, // Expéditeur
			to: email, // Destinataire
			subject: 'Vérification de votre adresse e-mail',
			html: `
				<p>Bonjour,</p>
				<p>Merci de vous être inscrit. Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse e-mail :</p>
				<a href="${verificationUrl}" target="_blank">Confirmer mon email</a>
				<p>Ce lien expire dans 1 heure.</p>
			`,
		};

		// Envoyer l'e-mail
		await transporter.sendMail(mailOptions);
		console.log(`Email de vérification envoyé à ${email}`);
	} catch (err) {
		console.error("Erreur lors de l'envoi de l'e-mail de vérification :", err);
		throw new Error("Erreur lors de l'envoi de l'e-mail de vérification.");
	}
}

export async function POST(req) {
	try {
		const { email, username, password } = await req.json();

		// Vérifier que les champs ne sont pas vides
		if (!email || !username || !password) {
			return new Response(JSON.stringify({ error: 'Tous les champs sont requis' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		// Connexion à MongoDB
		await dbConnect();

		// Vérifier si l'utilisateur existe déjà
		const existingUser = await User.findOne({ $or: [{ email }, { username }] });
		if (existingUser) {
			return new Response(JSON.stringify({ error: "Email ou nom d'utilisateur déjà utilisé" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		// Hacher le mot de passe
		const hashedPassword = await bcrypt.hash(password, 10);

		// Créer un nouvel utilisateur
		const newUser = new User({ email, username, password: hashedPassword });
		const token = crypto.randomBytes(32).toString('hex');
		newUser.emailVerificationToken = token;
		newUser.emailVerificationExpires = Date.now() + 3600000; // Expire dans 1 heure
		await newUser.save();

		// Envoyer l'email de confirmation
		await sendVerificationEmail(email, token);

		// Retourner une réponse indiquant que l'inscription est réussie
		return new Response(JSON.stringify({ message: 'Inscription réussie. Veuillez vérifier votre email.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	}
}
