import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import "./header.scss";
import ChoiceLanguage from "../components/slideButton/choiceLanguage";
import { useLanguage } from "../context/LanguageContext";

function Header() {
    const { user } = useAuth();
    const { isFrench } = useLanguage();

    return (
        <div className="flex center align-center gap20 header">
            <div className=" header-hover flex row gap20 center align-center">
                <Link href="/">
                    <p>Menu</p>
                </Link>
                {user ? (
                    <Link href="/user-space">
                        <p>{isFrench ? "Mon compte" : "My account"}</p>
                    </Link>
                ) : (
                    <div className="flex row gap20 align-center">
                        <Link href="/connexion">
                            <p>{isFrench ? "Connexion" : "Login"}</p>
                        </Link>
                    </div>
                )}

                <ChoiceLanguage />
            </div>
        </div>
    );
}

export default Header;
