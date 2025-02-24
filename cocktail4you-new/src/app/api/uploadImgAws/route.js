import AWS from 'aws-sdk';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Configuration AWS
const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

export async function POST(req) {
	try {
		const formData = await req.formData();
		const file = formData.get('file'); // Récupérer le fichier depuis le front

		if (!file) {
			return NextResponse.json({ error: 'Aucun fichier trouvé' }, { status: 400 });
		}

		// Convertir le fichier en buffer
		const buffer = await file.arrayBuffer();
		const fileName = `cocktails/${uuidv4()}-${file.name}`;

		// Paramètres pour l'upload sur S3
		const params = {
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: fileName,
			Body: Buffer.from(buffer),
			ContentType: file.type,
			ACL: 'public-read',
		};

		// Envoyer à S3
		const data = await s3.upload(params).promise();

		return NextResponse.json({ success: true, url: data.Location }, { status: 200 });
	} catch (error) {
		console.error("Erreur d'upload AWS S3 :", error);
		return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
}
