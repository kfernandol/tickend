//hooks
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePost } from "../../services/api_services";
//icons
import { GoogleOriginal } from 'devicons-react';
//redux
import { useDispatch } from "react-redux";
import { login } from "../../redux/Slices/AuthSlice";
import { Button } from "primereact/button";

function GoogleLoginButton() {
    //hooks
    const { t } = useTranslation();
    const { SendPostRequest, httpCodePost, loadingPost } = usePost();
    const dispatch = useDispatch();
    //translation
    const continueGoogleTxt = t("auth.login.labels.continueGoogle");
    //states
    const [tokenResponse, setTokenResponse] = useState<TokenResponse>();

    useEffect(() => {
        if (tokenResponse) {
            SendPostRequest("v1/auth/token/google", tokenResponse)
                .then((response) => {
                    if (httpCodePost)
                        dispatch(login(response.data))
                });
        }
    }, [tokenResponse, httpCodePost])

    const handlerLoginClick = useGoogleLogin({
        onSuccess: (tokenResponse) => setTokenResponse(tokenResponse)
    })

    return (
        <>
            <Button
                id="loginGoogleBtn"
                className="w-full"
                severity="secondary"
                outlined
                onClick={() => handlerLoginClick()} >
                {loadingPost
                    ? <i className="pi pi-spin pi-spinner" style={{ fontSize: '1.25rem' }}></i>
                    : <GoogleOriginal size={"1.25rem"} />}
                <span className="p-button-label p-c" data-pc-section="label">{continueGoogleTxt}</span>
            </Button>
        </>
    );
}

export default GoogleLoginButton;