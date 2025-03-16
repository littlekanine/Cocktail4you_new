const nextConfig = {
	reactStrictMode: true, // Activer le mode strict React
	eslint: {
		ignoreDuringBuilds: true, // Ignorer les erreurs ESLint pendant les builds si nécessaire
	},
	images: {
		domains: ['cocktails-image-4you.s3.eu-north-1.amazonaws.com'], // Ajoutez votre domaine S3 ici
	},
	serverActions: {
		bodySizeLimit: '10mb', // Augmenter la limite de taille à 10 Mo
	},
};

export default nextConfig;
