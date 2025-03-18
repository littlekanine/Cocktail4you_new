import nodemailer from 'nodemailer';

export async function POST(req) {
	try {
		const { name, email, message } = await req.json();

		// Configurer le transporteur SMTP
		const transporter = nodemailer.createTransport({
			service: 'gmail', // Remplace par ton service (Gmail, Outlook, etc.)
			auth: {
				user: process.env.EMAIL_USER, // Ton email
				pass: process.env.EMAIL_PASS, // Ton mot de passe ou App Password
			},
		});

		// Options de l'email
		const mailOptions = {
			from: email,
			to: process.env.EMAIL_USER,
			subject: `Nouveau message de ${name}`,
			text: message,
		};

		// Envoyer l'email
		await transporter.sendMail(mailOptions);

		return new Response(JSON.stringify({ success: true, message: 'Email envoyé !' }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ success: false, message: "Erreur lors de l'envoi" }), { status: 500 });
	}
}
