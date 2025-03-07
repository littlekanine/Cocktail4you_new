import { useEffect } from 'react';
import CocktailCardCrea from '../cocktailcard/cocktailCardCrea';
import './myCocktails.scss';
import { useCocktails } from '@/app/context/CocktailContext';
import { useAuth } from '@/app/context/AuthContext';

const MyCocktails = ({ userId }) => {
	const { userCocktails, fetchUserCocktails, cocktails, cocktailsCrea, loading, clickedStates, activeCard, handleCardClick, isVisible } = useCocktails();
	const { user } = useAuth();

	useEffect(() => {
		fetchUserCocktails(userId);
		console.log(userId); // 🔄 Charge les cocktails de l'utilisateur
	}, [userId]);

	return (
		<div className="flex center align-center widthFull column">
			<div className="flex center align-center cocktailsCrea widthFull">
				<div className="widthFull">
					{userCocktails.length > 0 ? (
						userCocktails.map((cocktail) => (
							<CocktailCardCrea
								key={cocktail._id}
								cocktail={cocktail}
								userId={userId}
								activeCard={activeCard}
								clickedStates={clickedStates}
								handleCardClick={handleCardClick}
								handleButtonClick={(event) => handleButtonClick(event, index, cocktail._id)}
								isVisible={isVisible}
							/>
						))
					) : (
						<p className="paragraphe">Pas de cocktails créés</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default MyCocktails;
