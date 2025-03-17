export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
	try {
		const secretKey = process.env.RECAPTCHA_SECRET_KEY;
		const { gRecaptchatToken } = await request.json();

		if (!gRecaptchatToken) {
			return NextResponse.json({ success: false, error: 'Missing reCAPTCHA token' }, { status: 400 });
		}

		const formData = `secret=${secretKey}&response=${gRecaptchatToken}`;
		const res = await axios.post('https://www.google.com/recaptcha/api/siteverify', formData, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		const { success, score } = res.data;

		if (success && score > 0.5) {
			return NextResponse.json({ success: true, score });
		} else {
			return NextResponse.json({ success: false, error: 'reCAPTCHA verification failed', score }, { status: 403 });
		}
	} catch (error) {
		console.error('reCAPTCHA verification error:', error);
		return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
	}
}
