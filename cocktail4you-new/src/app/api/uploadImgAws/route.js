export const runtime = 'nodejs';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

export async function POST(req) {
	try {
		if (!req.headers.get('content-type')?.includes('multipart/form-data')) {
			return NextResponse.json({ error: 'Type de contenu invalide' }, { status: 400 });
		}

		const formData = await req.formData();
		const file = formData.get('file');

		if (!file) {
			return NextResponse.json({ error: 'Aucun fichier trouvé' }, { status: 400 });
		}

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
		const maxSize = 5 * 1024 * 1024;

		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json({ error: 'Format non autorisé' }, { status: 400 });
		}

		if (file.size > maxSize) {
			return NextResponse.json({ error: 'Fichier trop volumineux (max 5Mo)' }, { status: 400 });
		}

		const fileName = `cocktails/${uuidv4()}-${file.name}`;

		const command = new PutObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: fileName,
			Body: Buffer.from(await file.arrayBuffer()),
			ContentType: file.type,
		});

		await s3.send(command);

		const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

		return NextResponse.json({ success: true, url: fileUrl }, { status: 200 });
	} catch (error) {
		console.error("Erreur d'upload AWS S3 :", error);
		return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
}
