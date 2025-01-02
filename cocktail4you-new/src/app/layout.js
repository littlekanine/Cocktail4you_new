'use client';

import './globals.css';
import { CocktailProvider } from './context/CocktailContext';
import Link from 'next/link';
import Button from './components/buttons/Button';
import { useState } from 'react';
import { metadata, viewport } from './config/seoConfig';

export default function RootLayout({ children }) {
	const [user, setUser] = useState(null);
	return (
		<html lang="fr">
			<body>
				<CocktailProvider>
					<div className="layout-container">
						<header className="layout-header">
							<Link href="/">
								<div className="logo">
									<h2>
										C<span className="number">4</span>Y
									</h2>
								</div>
							</Link>
							<div className="button-user">
								{user ? (
									<Link href="/user-space">
										<span>{user.firstName}</span>
									</Link>
								) : (
									<div>
										<Link href="/connexion">
											<Button
												icon={
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
														<path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z" />
													</svg>
												}
												className="button-user-svg"
											/>
										</Link>
									</div>
								)}
							</div>
						</header>
						<main className="layout-content">{children}</main>
					</div>
				</CocktailProvider>
			</body>
		</html>
	);
}
