import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import './header.scss';

function Header() {
	const { user } = useAuth();

	return (
		<div className="flex center align-center gap20 header">
			<div className=" header-hover flex row gap20 center align-center">
				<Link href="/">
					<p>Menu</p>
				</Link>
				{user ? (
					<Link href="/user-space">
						<p>Mon compte</p>
					</Link>
				) : (
					<div className="flex row gap20 align-center">
						<Link href="/connexion">
							<p>Connexion</p>
						</Link>
					</div>
				)}
				<p>Langues</p>
			</div>
		</div>
	);
}

export default Header;
