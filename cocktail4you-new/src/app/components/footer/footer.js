'use client';

import Link from 'next/link'; // Import de Link pour la navigation
import './footer.scss';

export default function Footer() {
	return (
		<footer className="bg-gray-900 text-white p-4 text-center">
			<div className="flex center align-center gap-10">
				<p className="text-sm">&copy; {new Date().getFullYear()} Cocktail4You - Tous droits réservés.</p>
				<nav className="flex gap-10">
					{/* Liens vers les pages sans modal */}
					<Link href="/mentions-legales" className="modalMention">
						Mentions légales
					</Link>
					<Link href="/politique-confidentialite" className="modalMention">
						Confidentialité
					</Link>
					<Link href="/contact" className="modalMention">
						Contact
					</Link>
				</nav>
			</div>
		</footer>
	);
}
