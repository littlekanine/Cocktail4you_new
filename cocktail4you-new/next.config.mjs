const nextConfig = {
	reactStrictMode: true, // Activer le mode strict React
	swcMinify: true, // Utiliser SWC pour la minification
	eslint: {
		ignoreDuringBuilds: true, // Ignorer les erreurs ESLint pendant les builds si nécessaire
	},
	images: {
		domains: ['cocktails-image-4you.s3.eu-north-1.amazonaws.com'], // Ajoutez votre domaine S3 ici
	},
};

export default nextConfig;
