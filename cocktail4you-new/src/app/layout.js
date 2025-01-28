'use client';

import './globals.css';
import { CocktailProvider } from './context/CocktailContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './header/header';

export default function RootLayout({ children }) {
	return (
		<html lang="fr">
			<body className="overflow-none">
				<LanguageProvider>
					<AuthProvider>
						<CocktailProvider>
							<div className="layout-container">
								<header className="layout-header">
									<Header />
								</header>
								<main className="layout-content">{children}</main>
							</div>
						</CocktailProvider>
					</AuthProvider>
				</LanguageProvider>
			</body>
		</html>
	);
}
