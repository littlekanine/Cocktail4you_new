// import cocktailsData from '../../../assets/cocktails-test-MongoDb.json';
import './cocktails.scss';

const Cocktails = ({ cocktails }) => {
	return (
		<div className="flex column gap20 ">
			{cocktails.map((cocktail) => (
				<div className=" flex center gap20" key={cocktail.id}>
					<img src={cocktail.img} alt={cocktail.name} />
					<div className=" card-info flex column center design-card">
						<h1>{cocktail.name}</h1>
						<h2>{cocktail.category}</h2>
						<h3>{cocktail.tags}</h3>
					</div>
				</div>
			))}
		</div>
	);
};

export default Cocktails;
