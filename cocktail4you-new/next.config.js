const TerserPlugin = require('terser-webpack-plugin'); // Utilisation de require pour importer le plugin

module.exports = {
	reactStrictMode: true, // Activer le mode strict React
	eslint: {
		ignoreDuringBuilds: true, // Ignorer les erreurs ESLint pendant les builds si nécessaire
	},
	images: {
		domains: ['cocktails-image-4you.s3.eu-north-1.amazonaws.com'], // Ajouter ton domaine S3 ici
	},
	webpack(config, { dev }) {
		if (!dev) {
			// En production, Next.js minifie le code par défaut
			config.optimization.minimizer.push(
				new TerserPlugin({
					terserOptions: {
						compress: {
							drop_console: true, // Supprime les console.log
						},
						output: {
							comments: false, // Supprime les commentaires
						},
					},
				})
			);
		}
		return config;
	},
};
