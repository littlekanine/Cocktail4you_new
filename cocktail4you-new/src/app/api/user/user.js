// pages/api/register.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, username, password } = req.body;

    // Vérifier que les champs ne sont pas vides
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Emplacement du fichier JSON où tu vas stocker les utilisateurs
    const filePath = path.join(process.cwd(), 'users.json');
    
    // Lire les utilisateurs existants depuis le fichier JSON
    let users = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      users = JSON.parse(fileData);
    }

    // Vérifier si l'email ou le nom d'utilisateur existe déjà
    const existingUser = users.find(user => user.email === email || user.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'Email ou nom d\'utilisateur déjà utilisé' });
    }

    // Ajouter le nouvel utilisateur au tableau
    const newUser = {
      email,
      username,
      password, // N'oublie pas que pour la production, tu devrais hasher les mots de passe !
    };
    users.push(newUser);

    // Sauvegarder les utilisateurs dans le fichier JSON
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');

    return res.status(200).json({ message: 'Utilisateur inscrit avec succès' });
  }

  res.status(405).json({ error: 'Méthode HTTP non autorisée' });
}
