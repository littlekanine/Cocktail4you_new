export const runtime = 'nodejs';

import dbConnect from '../../../../lib/mongodb';
import User from '../../models/UserModel';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import axios from 'axios';
import bcrypt from 'bcryptjs';

async function sendVerificationEmail(email, token, id) {
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

		const verificationUrl = `${process.env.BASE_URL}/api/verif-email?token=${token}&id=${id}`;

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: 'Vérification de votre adresse e-mail',
			html: `
				<p>Bonjour,</p>
				<p>Merci de vous être inscrit. Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse e-mail :</p>
				<p><a href="${verificationUrl}" target="_blank" style="text-decoration:none; color:blue; font-weight:bold;">Cliquez ici pour valider votre compte</a></p>
				<p>Ce lien expire dans 1 heure.</p>
			`,
		};

		await transporter.sendMail(mailOptions);
	} catch (err) {
		console.error("Erreur lors de l'envoi de l'e-mail de vérification :", err);
		throw new Error("Erreur lors de l'envoi de l'e-mail de vérification.");
	}
}

export async function POST(req) {
	try {
		const { email, username, password, gRecaptchaToken } = await req.json();

		if (!email || !username || !password || !gRecaptchaToken) {
			return new Response(JSON.stringify({ error: 'Tous les champs sont requis' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		const recaptchaResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
			params: {
				secret: process.env.RECAPTCHAT_SECRET_KEY,
				response: gRecaptchaToken,
			},
		});

		if (!recaptchaResponse.data.success || recaptchaResponse.data.score < 0.5) {
			return new Response(JSON.stringify({ error: 'Vérification reCAPTCHA échouée' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		await dbConnect();

		const existingUser = await User.findOne({ $or: [{ email }, { username }] });
		if (existingUser) {
			return new Response(JSON.stringify({ error: "Email ou nom d'utilisateur déjà utilisé" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		// const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			email,
			username,
			password,
		});

		const token = crypto.randomBytes(32).toString('hex');
		newUser.emailVerificationToken = token;
		newUser.emailVerificationExpires = Date.now() + 3600000;

		await newUser.save();

		await sendVerificationEmail(email, token, newUser._id);

		return new Response(
			JSON.stringify({
				message: 'Utilisateur créé avec succès. Vérifiez votre e-mail.',
				redirectTo: `${process.env.BASE_URL}/waiting-confirm?name=${encodeURIComponent(newUser.username)}&email=${encodeURIComponent(newUser.email)}`,
			}),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	}
}
