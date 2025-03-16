'use client';

import { CocktailProvider } from './context/CocktailContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { PostCocktailsProvider } from './context/PostCocktailsContext';

export default function Providers({ children }) {
	return (
		<LanguageProvider>
			<AuthProvider>
				<PostCocktailsProvider>
					<CocktailProvider>{children}</CocktailProvider>
				</PostCocktailsProvider>
			</AuthProvider>
		</LanguageProvider>
	);
}
