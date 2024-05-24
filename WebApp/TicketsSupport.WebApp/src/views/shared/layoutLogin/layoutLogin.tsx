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
import GoogleLoginButton from "../../../components/googleLoginButton/GoogleLoginButton";

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
                    <img alt="logo.png" src={logoBlack} width="40%" className="mb-7" />
                    <h2 className="my-0">{LoginTitle}</h2>
                    <p className="mt-0 mb-4">{LoginSubTitle}</p>
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
                        <GoogleLoginButton />
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