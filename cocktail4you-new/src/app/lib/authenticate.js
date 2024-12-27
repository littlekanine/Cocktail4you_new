// import jwt from 'jsonwebtoken';

// // Middleware pour authentifier les requêtes
// export function authenticate(req) {
//   try {
//     // Récupérer le token de l'en-tête Authorization
//     const authHeader = req.headers.get('Authorization'); // Format attendu : "Bearer <token>"
//     if (!authHeader) {
//       throw new Error('Accès refusé : Aucun jeton fourni');
//     }

//     // Extraire le token
//     const token = authHeader.split(' ')[1]; // Suppression de "Bearer"
//     if (!token) {
//       throw new Error('Accès refusé : Jeton manquant');
//     }

//     // Vérifier le jeton
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Retourner les informations décodées du jeton
//     return decoded;
//   } catch (err) {
//     throw new Error('Accès refusé : Jeton invalide ou expiré');
//   }
// }
