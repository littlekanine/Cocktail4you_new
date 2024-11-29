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
				<h1 className="flex center widthFull  title-connexion">Rejopignez-nous !</h1>
				<div className="flex connexion column">
					<div className="flex height100vh column center align-center gap10">
                    <div className="nomUtilisateur flex column center width80 ">
							<p>Email</p>
							<label htmlFor="site-search"></label>
							<input type="text" name="q" className="" />
							<div className="flex center">
							</div>
						</div>
						<div className="nomUtilisateur flex column center width80 ">
							<p>Nom d'utilisateur</p>
							<label htmlFor="site-search"></label>
							<input type="text" name="q" className="" />
							<div className="flex center">
							</div>
						</div>
						<div className="flex column center width80 margin10Bottom">
							<p>Mot de passe</p>
							<label htmlFor="site-search"></label>
							<input type="password" name="q" />
							<div className="flex center">
							</div>
						</div>
						<div className="flex center margin10Bottom">
							<Button text="Inscription" className="flex center align-center connexion-button" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
