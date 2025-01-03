const nextConfig = {
	reactStrictMode: true, // Activer le mode strict React
	swcMinify: true, // Utiliser SWC pour la minification
	eslint: {
		ignoreDuringBuilds: true, // Ignorer les erreurs ESLint pendant les builds si nécessaire
	},
	images: {
		unoptimized: true, // Désactive les optimisations d'images de Next.js
	},
};

export default nextConfig;
