//components
import { Player } from "@lottiefiles/react-lottie-player";
import { Button } from "primereact/button";
//hooks
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


function Page404() {
    const { t } = useTranslation();
    //Translations
    const returnTxt = t("resetPasswordSend.labels.return")
    return (
        <div className="grid p-0 m-0 h-screen flex justify-content-center align-items-center">
            <div className="col-4 flex flex-column align-items-center">
                <h5 className="text-8xl my-0">404</h5>
                <h5 className="text-xl my-0">Opps! Not Found</h5>
                <Link to={"/"} className="w-3">
                    <Button icon="pi pi-home" label={returnTxt} className="w-full mt-5" text raised outlined severity="secondary" />
                </Link>
            </div>
            <div className="col-8">
                <Player
                    autoplay
                    loop
                    style={{ width: "60%" }}
                    src="/src/assets/Animation-404.json" />
            </div>
        </div>
    );
}

export default Page404;