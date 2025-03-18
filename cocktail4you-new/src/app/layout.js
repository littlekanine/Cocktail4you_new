import Providers from './providers';
import './globals.css';
import Header from './header/header';
import { Analytics } from '@vercel/analytics/react';
import Footer from '../app/components/footer/footer';

export const metadata = {
	title: 'Cocktails4You - Cocktails pour barmans amateurs et professionnels',
	description: 'Découvrez les meilleurs cocktails sur Cocktails4You.',
	icons: {
		icon: '/cocktail-svgrepo-com.svg',
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="fr">
			<body className="overflow-none relative">
				<div className="bg-custom"></div>
				<Providers>
					<div className="layout-container">
						<header className="layout-header">
							<Header />
						</header>
						<Analytics />
						<main className="layout-content">{children}</main>
						<footer className="layout-footer">
							<Footer />
						</footer>
					</div>
				</Providers>
			</body>
		</html>
	);
}
