import Link from 'next/link';
import Button from '../components/buttons/Button';
import { useAuth } from '../context/AuthContext';
import SlideButton from '../components/slideButton/SlideButton';

function Header() {
	const { user } = useAuth();

	return (
		<>
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
						<span>{user.username}</span>
					</Link>
				) : (
					<div className="flex row gap20 align-center">
						<div className="flex row gap10 align-center">
							<svg width="30px" height="30px" viewBox="0 0 1.8 1.8" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet">
								<path fill="#ED2939" d="M1.8 1.35a0.2 0.2 0 0 1 -0.2 0.2h-0.4V0.25h0.4a0.2 0.2 0 0 1 0.2 0.2z" />
								<path fill="#002495" d="M0.2 0.25a0.2 0.2 0 0 0 -0.2 0.2v0.9a0.2 0.2 0 0 0 0.2 0.2h0.4V0.25z" />
								<path fill="#EEE" d="M0.6 0.25h0.6v1.3H0.6z" />
							</svg>

							<SlideButton />

							<svg width="30px" height="30px" viewBox="0 0 36 36" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet">
								<path
									fill="#00247D"
									d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"
								></path>
								<path
									fill="#CF1B2B"
									d="M25.14 23l9.712 6.801a3.977 3.977 0 0 0 .99-1.749L28.627 23H25.14zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943V23zm10-10h2.141l9.711-6.8a3.988 3.988 0 0 0-1.937-1.085L23 12.057V13zm-12.141 0L1.148 6.2a3.994 3.994 0 0 0-.991 1.749L7.372 13h3.487z"
								></path>
								<path
									fill="#EEE"
									d="M36 21H21v10h2v-5.836L31.335 31H32a3.99 3.99 0 0 0 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36v-2zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21H0zM36 9a3.983 3.983 0 0 0-1.148-2.8L25.141 13H23v-.943l9.915-6.942A4.001 4.001 0 0 0 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059V9zM13 5v5.837L4.664 5H4a3.985 3.985 0 0 0-2.852 1.2l9.711 6.8H7.372L.157 7.949A3.968 3.968 0 0 0 0 9v.059L5.628 13H0v2h15V5h-2z"
								></path>
								<path fill="#CF1B2B" d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z"></path>
							</svg>
						</div>
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
		</>
	);
}

export default Header;
