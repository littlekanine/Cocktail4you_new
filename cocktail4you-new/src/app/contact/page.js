export default function Contact() {
	return (
		<div className="p-6 max-w-3xl mx-auto">
			<h1 className="text-3xl font-bold mb-6">Contactez-nous</h1>
			<p>Si vous avez des questions, des suggestions ou des préoccupations, n'hésitez pas à nous contacter.</p>
			<h2 className="text-2xl font-bold mt-6">Email</h2>
			<p>
				Vous pouvez nous envoyer un email à l'adresse suivante : <strong>contact@cocktail4you.com</strong>
			</p>
			<h2 className="text-2xl font-bold mt-6">Adresse</h2>
			<p>Si vous souhaitez nous envoyer un courrier physique, vous pouvez utiliser l'adresse suivante :</p>
			<p>
				Cocktail4You
				<br />
				6 Rue Lucien Lafforgue
				<br />
				31000 Toulouse
			</p>
			<h2 className="text-2xl font-bold mt-6">Formulaire de Contact</h2>
			<form className="mt-4">
				<div className="mb-4">
					<label htmlFor="name" className="block text-sm font-bold mb-2">
						Nom
					</label>
					<input type="text" id="name" name="name" className="w-full p-2 border border-gray-300 rounded" required />
				</div>
				<div className="mb-4">
					<label htmlFor="email" className="block text-sm font-bold mb-2">
						Email
					</label>
					<input type="email" id="email" name="email" className="w-full p-2 border border-gray-300 rounded" required />
				</div>
				<div className="mb-4">
					<label htmlFor="message" className="block text-sm font-bold mb-2">
						Message
					</label>
					<textarea id="message" name="message" className="w-full p-2 border border-gray-300 rounded" rows="4" required></textarea>
				</div>
				<button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
					Envoyer
				</button>
			</form>
		</div>
	);
}
