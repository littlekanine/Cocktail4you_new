import React from "react";
import "./page.scss";
import Link from "next/link";
import Button from "@/app/components/buttons/Button";

const page = () => {
    return (
        <div className="success height100vh flex center widthFull ">
            <div className="flex center align-center">
                <div className="flex column text-center gap20">
                    <h1 className="shadow">Votre compte a bien été verifié !</h1>
                    <h2 className="shadow">Mettez vos cocktails préférés en favori et téléchargez la liste des ingrédients </h2>
                    <h2 className="shadow">Patagez nous vos créations</h2>
                    <Link href="/">
                        <Button text="Page d'acceuil" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default page;
