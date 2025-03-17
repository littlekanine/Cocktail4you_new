import React from 'react';
import './page.scss';
import Link from 'next/link';
import Button from '../../components/buttons/Button';

const page = () => {
	return (
		<div className="success height100vh flex center widthFull ">
			<div className="flex center align-center">
				<div className="flex column text-center gap20">
					<h1 className="shadow">Une erreur est survenue</h1>
					<h2 className="shadow">Veuillez tenter de re-créer un compte </h2>
					<Link href="/">
						<Button text="Page d'acceuil" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default page;
