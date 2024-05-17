import { useEffect } from "react";
//Css
import "./layoutLogin.css"
import logoBlack from "../../../../src/assets/logo-black.svg";
//Components
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import LaguageSelect from "../../../components/lenguajeSelect/languageSelect"
import ButtonSubmitLogin from "../../../components/buttonSubmitLogin/buttonSubmitLogin";
import { Player } from '@lottiefiles/react-lottie-player';
//redux
import { useDispatch } from "react-redux";
import { login } from "../../../redux/Slices/AuthSlice";
//hooks
import { Controller } from "react-hook-form";
import { useAuthAPI } from "../../../services/api_services";
import useCustomForm from "../../../hooks/useCustomForm";
import { LoginFormModel } from "../../../models/forms/login.form";
import { Link } from "react-router-dom";
import { paths } from "../../../routes/paths";
import { useTranslation } from "../../../i18n";
//models
import { AuthRequest } from "../../../models/requests/auth.request";
import { Divider } from "primereact/divider";

function LayoutLogin() {
    //Form
    const { control, handleSubmit, setError, errors, ErrorMessageHtml } = useCustomForm<LoginFormModel>({ username: "", password: "" });
    //hooks
    const dispatch = useDispatch();
    //Api Request
    const { SendAuthRequest, loadingAuth, authResponse, errorAuth } = useAuthAPI();
    //Translation
    const { t } = useTranslation();
    const LoginTitle = t('auth.login.title');
    const LoginSubTitle = t("auth.login.subtitle");
    const UsernameRequired = t("auth.login.usernameRequired");
    const PasswordRequired = t("auth.login.passwordRequired");
    const Username = t("auth.login.labels.username");
    const Password = t("auth.login.labels.password");
    const OrTxt = t("auth.login.labels.or");
    const UsernamePlaceholderTxt = t("auth.login.placeholder.username");
    const PasswordPlaceholderTxt = t("auth.login.placeholder.password");
    const LoginSubmit = t("auth.login.submit");
    const RestorePassword = t("auth.login.restorePassword");
    const DataInvalid = t("auth.login.loginInvalid")
    const continueGoogleTxt = t("auth.login.labels.continueGoogle");
    const areNewTxt = t("auth.login.labels.areNew");
    const createAccountTxt = t("auth.login.labels.createAccount");
    const TitleMessageTxt = t("auth.login.labels.TitleMessage");
    const SubTitleMessageTxt = t("auth.login.labels.SubTitleMessage");

    //Submit Form
    const onSubmitLogin = (data: LoginFormModel) => {
        const loginData: AuthRequest = {
            username: data.username,
            password: data.password,
        };
        SendAuthRequest("v1/auth/token", loginData);
    };

    //Api Response
    useEffect(() => {
        if (authResponse) {
            dispatch(login(authResponse));
        }
    }, [authResponse]);


    useEffect(() => {
        if (errorAuth) {
            setError("username", {
                type: "manual",
                message: DataInvalid
            });
            setError("password", {
                type: "manual",
                message: DataInvalid
            })
        }

    }, [errorAuth])

    return (
        <>
            <LaguageSelect className="absolute top-0 right-0" />
            <div className="grid h-screen w-screen m-0">
                <div className="hidden md:flex flex-column justify-content-center align-items-center md:col-7 lg:col-8 bg-yellow-100">
                    <Player
                        autoplay
                        loop
                        src="/src/assets/Animation-Support.json" />
                    <h1 className="mb-0 text-lg">{TitleMessageTxt}</h1>
                    <p className="text-sm my-2">{SubTitleMessageTxt}</p>
                </div>
                <div className="col-12 md:col-5 lg:col-4 flex flex-column justify-content-center align-items-center">
                    <img alt="logo.png" src={logoBlack} width="40%" className="mb-6" />
                    <form onSubmit={handleSubmit(onSubmitLogin)} className="flex flex-column gap-1 align-items-center w-7">
                        <Controller
                            name="username"
                            control={control}
                            rules={{
                                required: UsernameRequired,
                                maxLength: { value: 50, message: "El maximo de caracteres es de 50" },
                                minLength: { value: 5, message: "El minimo de caracteres es 5" }
                            }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ "p-error": errors.username })}></label>
                                    <label className="align-self-start">{Username}</label>
                                    <IconField iconPosition="left" className="w-full">
                                        <InputIcon className="pi pi-user"> </InputIcon>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            placeholder={UsernamePlaceholderTxt}
                                        />
                                    </IconField>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: PasswordRequired,
                                maxLength: { value: 25, message: "El maximo de caracteres es 25" },
                                minLength: { value: 5, message: "El minimo de caracteres es 5" }
                            }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ "p-error": errors.password })}></label>
                                    <label className="align-self-start">{Password}</label>
                                    <IconField iconPosition="left" className="w-full">
                                        <InputIcon className="pi pi-lock"> </InputIcon>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            type="password"
                                            className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            placeholder={PasswordPlaceholderTxt}
                                        />
                                    </IconField>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />

                        {/*Reset Password Button*/}
                        <Link to={paths.resetPassword} className="align-self-end mb-4">
                            <Button type="button" className="text-sm p-0" label={RestorePassword} style={{ color: "#45B9FF" }} link />
                        </Link>
                        {/*Login Button*/}
                        <ButtonSubmitLogin label={LoginSubmit} loading={loadingAuth} />
                    </form>
                    {/*OR Divider*/}
                    <div className="flex align-items-center mt-4 mb-3 w-7">
                        <Divider layout="horizontal" className="border-gray-900" />
                        <p className="mx-3">{OrTxt}</p>
                        <Divider layout="horizontal" />
                    </div>
                    {/* Enter with Google */}
                    <div className="flex w-7">
                        <button className="gsi-material-button w-full">
                            <div className="gsi-material-button-state"></div>
                            <div className="gsi-material-button-content-wrapper">
                                <div className="gsi-material-button-icon">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: "block" }}>
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                        <path fill="none" d="M0 0h48v48H0z"></path>
                                    </svg>
                                </div>
                                <span className="gsi-material-button-contents">{continueGoogleTxt}</span>
                                <span style={{ display: "none" }}>{continueGoogleTxt}</span>
                            </div>
                        </button>
                    </div>
                    {/* Register Button */}
                    <div className="flex align-items-center justify-content-center mt-4">
                        <p className="my-0 mr-2">{areNewTxt}</p>
                        <Link to={paths.register} className="align-self-end my-0">
                            <Button type="button" className="text-sm p-0" label={createAccountTxt} style={{ color: "#45B9FF" }} link />
                        </Link>
                    </div>
                    {/*Logo upana*/}
                    <img className="absolute bottom-0 right-0 w-6rem mb-3 mr-3" alt="logo-upana.png" src="/src/assets/imgs/logo-upana.png"></img>
                </div>
            </div>
        </>
    );
}

export default LayoutLogin;
