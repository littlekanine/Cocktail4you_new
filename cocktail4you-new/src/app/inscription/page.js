'use client';

import './page.scss';
import '../components/homePage/homePage.scss';
import Link from 'next/link';
import Button from '../components/buttons/Button';
import { useState } from 'react';

const Page = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Réinitialiser les messages d'erreur ou de succès
    setError('');
    setMessage('');

    const userData = { email, username, password };

    // Envoi des données du formulaire à l'API
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(data.message); // Afficher un message de succès
    } else {
      setError(data.error); // Afficher un message d'erreur
    }
  };

  return (
    <div className="height100vh flex">
      <div className="connexion-container flex center align-center widthFull column">
        <Link href="/">
          <div className="logo-connexion">
            <h1>
              C<span className="number">4</span>Y
            </h1>
          </div>
        </Link>
        <h1 className="flex center widthFull title-connexion">Rejoignez-nous !</h1>
        <div className="flex connexion column">
          <form onSubmit={handleSubmit} className="flex height100vh column center align-center gap10">
            <div className="flex column center width80">
              <p>Email</p>
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex column center width80">
              <p>Nom d'utilisateur</p>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="flex column center width80 margin10Bottom">
              <p>Mot de passe</p>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex center margin10Bottom">
              <Button text="Inscription" className="flex center align-center connexion-button" />
            </div>
          </form>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Page;
