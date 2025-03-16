import AWS from 'aws-sdk';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

export async function POST(req) {
	try {
		// Vérification du type de requête
		if (!req.headers.get('content-type')?.includes('multipart/form-data')) {
			return NextResponse.json({ error: 'Type de contenu invalide' }, { status: 400 });
		}

		const formData = await req.formData();
		const file = formData.get('file');

		if (!file) {
			return NextResponse.json({ error: 'Aucun fichier trouvé' }, { status: 400 });
		}

		// Validation du type et de la taille du fichier
		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
		const maxSize = 5 * 1024 * 1024; // 5 Mo max

		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json({ error: 'Format non autorisé' }, { status: 400 });
		}

		if (file.size > maxSize) {
			return NextResponse.json({ error: 'Fichier trop volumineux (max 5Mo)' }, { status: 400 });
		}

		// Création du nom de fichier unique
		const fileName = `cocktails/${uuidv4()}-${file.name}`;

		// Upload vers S3
		const data = await s3
			.upload({
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				Key: fileName,
				Body: Buffer.from(await file.arrayBuffer()), // Correction
				ContentType: file.type,
			})
			.promise();

		return NextResponse.json({ success: true, url: data.Location }, { status: 200 });
	} catch (error) {
		console.error("Erreur d'upload AWS S3 :", error);
		return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
}
