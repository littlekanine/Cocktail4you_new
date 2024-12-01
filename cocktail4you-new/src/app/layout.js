import './globals.css';
import { CocktailProvider } from './context/CocktailContext';
import './globals.css';

export const metadata = {
	title: "Cocktails4You - Accueil",
	description: "Découvrez les meilleurs cocktails sur Cocktails4You.",
	icons: {
	  icon: "/cocktail-svgrepo-com.svg",
	},
  };
  
  export const viewport = {
	width: "device-width",
	initialScale: 1,
  };
  


export default function RootLayout({ children }) {
	return (
		<html lang="fr">
			<body>
				<CocktailProvider>{children}</CocktailProvider>
			</body>
		</html>
	);
}
