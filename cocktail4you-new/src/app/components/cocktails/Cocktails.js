import cocktails from '../../../assets/cocktails-test-MongoDb.json';
import './cocktails.scss';

const Cocktails = () => {
	return (
		<div className="card-cocktail flex center align-center row">
			<img></img>
			<div className="card-info">
				<h1>
					{cocktails.map((cocktail) => (
						<h3>{cocktail.ingredients.name}</h3>
					))}
				</h1>
			</div>
		</div>
	);
};

export default Cocktails;
