import React from 'react';
import './page.scss';
import Link from 'next/link';
import Button from '../../components/buttons/Button';

const page = () => {
	return (
		<div className="success height100vh flex center widthFull ">
			<div className="flex center align-center">
				<div className="flex column text-center gap20">
					<h2 className="">Votre compte a bien été verifié !</h2>
					<h3 className="">Mettez vos cocktails préférés en favori et téléchargez la liste des ingrédients </h3>
					<h3 className="">Patagez nous vos créations</h3>
					<Link href="/">
						<Button text="Page d'acceuil" className="buttonHome" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default page;
