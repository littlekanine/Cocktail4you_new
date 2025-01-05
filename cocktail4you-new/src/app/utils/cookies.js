// utils/cookies.js
export function getCookie(name) {
	if (typeof window !== 'undefined') {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) {
			const token = parts.pop().split(';').shift();
			console.log('Token trouvé:', token); // Ajout d'un log pour vérifier le token
			return token;
		}
	}
	return null;
}
