import './page.scss';
import '../components/homePage/homePage.scss';
import Link from 'next/link';

import Button from '../components/buttons/Button';

const page = () => {
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
				<h1 className="flex center widthFull title-connexion shadow">Accéder à votre espace personnel</h1>
				<div className="flex connexion column center align-center">
					<form className="flex height100vh column center align-center width80" method="POST" action="/api/login">
						<div className="nomUtilisateur flex column center width80">
							<p>Nom d'utilisateur</p>
							<label htmlFor="username"></label>
							<input type="text" name="username" id="username" className="" autoComplete="username" />
							<div className="flex center">
								<p>Nom d'utilisateur oublié ?</p>
							</div>
						</div>
						<div className="flex column center width80 margin10Bottom">
							<p>Mot de passe</p>
							<label htmlFor="password"></label>
							<input type="password" name="password" id="password" autoComplete="current-password" />
							<div className="flex center">
								<p>Mot de passe oublié ?</p>
							</div>
						</div>
						<div className="flex center margin10Bottom">
							<Button text="Connexion" className="flex center align-center connexion-button" />
						</div>
					</form>
					<Link href="/inscription">
						<div>
							<p className="font400">S'inscrire</p>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default page;
