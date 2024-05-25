import { useEffect, useRef, useState } from "react";
//Css
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
import { Divider } from "primereact/divider";
import GoogleLoginButton from "../../../components/googleLoginButton/GoogleLoginButton";
import { Toast } from "primereact/toast";
//hooks
import { Controller } from "react-hook-form";
import { useAuthAPI } from "../../../services/api_services";
import useCustomForm from "../../../hooks/useCustomForm";
import { Link } from "react-router-dom";
import { paths } from "../../../routes/paths";
import { useTranslation } from "../../../i18n";
//models
import { AuthRegisterRequest } from "../../../models/requests/auth.request";
import { RegisterFormModel } from "../../../models/forms/register.form";
import { ErrorResponse, ErrorsResponse } from "../../../models/responses/basic.response";

export default function LayoutRegister() {
    //Form
    const { control, handleSubmit, ErrorMessageHtml, getValues } = useCustomForm<RegisterFormModel>(
        {
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            password: ""
        });
    //hooks
    const toast = useRef<Toast>(null);
    const [registered, setRegistered] = useState<boolean>(false);
    //Api Request
    const { SendAuthRequest, loadingAuth, authResponse, errorAuth } = useAuthAPI();
    //Translation
    const { t } = useTranslation();
    const RegisterTitle = t('auth.register.title');
    const RegisterSubTitle = t("auth.register.subtitle");
    const UsernameRequired = t("auth.register.usernameRequired");
    const PasswordRequired = t("auth.register.passwordRequired");
    const FirstName = t("users.labels.firstName")
    const LastName = t("users.labels.lastName");
    const Username = t("users.labels.username");
    const Email = t("users.labels.email");
    const Password = t("users.labels.password");
    const ConfirmPassword = t("users.labels.confirmPassword");
    const returnHome = t("auth.register.labels.returnHome");
    const registerConfirmMessage = t("auth.register.labels.registerConfirmMessage");
    const OrTxt = t("auth.register.labels.or");
    const UsernamePlaceholderTxt = t("auth.register.placeholder.username");
    const PasswordPlaceholderTxt = t("auth.register.placeholder.password");
    const FirstNamePlaceholderTxt = t("auth.register.placeholder.firstname");
    const LastNamePlaceholderTxt = t("auth.register.placeholder.lastname");
    const EmailPlaceholderTxt = t("auth.register.placeholder.email");
    const ConfirmPasswordPlaceholderTxt = t("auth.register.placeholder.confirmPassword");
    const LoginSubmit = t("auth.register.submit");
    const areNewTxt = t("auth.register.labels.areOld");
    const createAccountTxt = t("auth.register.labels.loginAccount");
    const TitleMessageTxt = t("auth.register.labels.TitleMessage");
    const SubTitleMessageTxt = t("auth.register.labels.SubTitleMessage");
    const ErrorRequired = t('errors.required');
    const ErrorMaxCaracter = t('errors.maxLength');
    const ErrorMinCaracter = t('errors.minLength');
    const ErrorNoMatch = t("errors.noMatch", { 0: t("users.labels.password") });

    //Submit Form
    const onSubmitLogin = (data: RegisterFormModel) => {
        const registerData: AuthRegisterRequest = {
            username: data.username,
            password: data.password,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName
        };
        SendAuthRequest("v1/auth/register", registerData);
    };

    //Api Response
    useEffect(() => {
        if (authResponse) {
            setRegistered(true);
        }
    }, [authResponse]);


    useEffect(() => {
        let errorResponse = errorAuth;
        if (errorResponse) {
            if (typeof (errorResponse as ErrorResponse | ErrorsResponse).details === "string") // String Details
            {
                errorResponse = errorResponse as ErrorResponse;
                toast?.current?.show({
                    severity: 'error', summary: RegisterTitle, detail: errorResponse.details, life: 3000
                });
            }
            else // Json Details
            {
                errorResponse = errorResponse as ErrorsResponse;
                const errorsHtml = Object.entries(errorResponse.details).map(([_field, errors], index) => (
                    errors.map((error, errorIndex) => (
                        <li key={`${index}-${errorIndex}`}>{error}</li>
                    ))
                )).flat();
                toast?.current?.show({ severity: 'error', summary: RegisterTitle, detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
            }
        }
    }, [errorAuth, authResponse])

    return (
        <>
            {registered == false
                ? <>
                    <Toast ref={toast} />
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
                            <h2 className="my-0">{RegisterTitle}</h2>
                            <p className="mt-0 mb-4">{RegisterSubTitle}</p>
                            <form onSubmit={handleSubmit(onSubmitLogin)} className="grid align-items-center w-9">
                                <div className="col-12">
                                    { /*Username*/}
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
                                                <label className="align-self-start">{Username}</label>
                                                <IconField iconPosition="left" className="w-full">
                                                    <InputIcon className="pi pi-id-card"> </InputIcon>
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
                                </div>

                                <div className="col-12 md:col-6">
                                    { /*FirstName*/}
                                    <Controller
                                        name="firstName"
                                        control={control}
                                        rules={
                                            {
                                                required: ErrorRequired,
                                                maxLength: {
                                                    value: 150,
                                                    message: ErrorMaxCaracter.replace("{{0}}", "150")
                                                },
                                                minLength: {
                                                    value: 3,
                                                    message: ErrorMinCaracter.replace("{{0}}", "3")
                                                }

                                            }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <label className="align-self-start block mb-1">{FirstName}</label>
                                                <IconField iconPosition="left" className="w-full">
                                                    <InputIcon className="pi pi-user"> </InputIcon>
                                                    <InputText
                                                        id={field.name}
                                                        value={field.value}
                                                        className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        placeholder={FirstNamePlaceholderTxt}
                                                    />
                                                </IconField>
                                                {ErrorMessageHtml(field.name)}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="col-12 md:col-6">
                                    { /*lastName*/}
                                    <Controller
                                        name="lastName"
                                        control={control}
                                        rules={
                                            {
                                                required: ErrorRequired,
                                                maxLength: {
                                                    value: 150,
                                                    message: ErrorMaxCaracter.replace("{{0}}", "150")
                                                },
                                                minLength: {
                                                    value: 3,
                                                    message: ErrorMinCaracter.replace("{{0}}", "3")
                                                }

                                            }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <label className="align-self-start  block mb-1">{LastName}</label>
                                                <IconField iconPosition="left" className="w-full">
                                                    <InputIcon className="pi pi-user"> </InputIcon>
                                                    <InputText
                                                        id={field.name}
                                                        value={field.value}
                                                        className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        placeholder={LastNamePlaceholderTxt}
                                                    />
                                                </IconField>
                                                {ErrorMessageHtml(field.name)}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="col-12">
                                    {/* Email Input */}
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={
                                            {
                                                required: ErrorRequired,
                                                maxLength: {
                                                    value: 200,
                                                    message: ErrorMaxCaracter.replace("{{0}}", "200")
                                                },
                                                minLength: {
                                                    value: 5,
                                                    message: ErrorMinCaracter.replace("{{0}}", "5")
                                                }

                                            }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <label className="align-self-start block mb-1">{Email}</label>
                                                <IconField iconPosition="left" className="w-full">
                                                    <InputIcon className="pi pi-envelope"> </InputIcon>
                                                    <InputText
                                                        id={field.name}
                                                        value={field.value}
                                                        className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        placeholder={EmailPlaceholderTxt}
                                                    />
                                                </IconField>
                                                {ErrorMessageHtml(field.name)}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="col-12 md:col-6">
                                    { /*Password*/}
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
                                </div>

                                <div className="col-12 md:col-6">
                                    {/* Confirm Password*/}
                                    <Controller
                                        name="confirmPassword"
                                        control={control}
                                        rules={
                                            {
                                                required: ErrorRequired,
                                                maxLength: {
                                                    value: 50,
                                                    message: ErrorMaxCaracter.replace("{{0}}", "50")
                                                },
                                                minLength: {
                                                    value: 5,
                                                    message: ErrorMinCaracter.replace("{{0}}", "5")
                                                },
                                                validate: (value) => {
                                                    const { password } = getValues();
                                                    return password === value || ErrorNoMatch;
                                                }
                                            }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <label className="align-self-start block mb-1">{ConfirmPassword}</label>
                                                <IconField iconPosition="left" className="w-full">
                                                    <InputIcon className="pi pi-lock"> </InputIcon>
                                                    <InputText
                                                        id={field.name}
                                                        value={field.value}
                                                        type="password"
                                                        className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        placeholder={ConfirmPasswordPlaceholderTxt}
                                                    />
                                                </IconField >
                                                {ErrorMessageHtml(field.name)}
                                            </>
                                        )}
                                    />
                                </div>

                                {/*Login Button*/}
                                <ButtonSubmitLogin label={LoginSubmit} loading={loadingAuth} className="mt-5 mx-2" />
                            </form>
                            {/*OR Divider*/}
                            <div className="flex align-items-center mt-4 mb-3 w-7">
                                <Divider layout="horizontal" className="border-gray-900" />
                                <p className="mx-3">{OrTxt}</p>
                                <Divider layout="horizontal" />
                            </div>
                            {/* Enter with Google */}
                            <div className="flex w-9 px-1">
                                <GoogleLoginButton />
                            </div>
                            {/* Register Button */}
                            <div className="flex align-items-center justify-content-center mt-4">
                                <p className="my-0 mr-2">{areNewTxt}</p>
                                <Link to={paths.home} className="align-self-end my-0">
                                    <Button type="button" className="text-sm p-0" label={createAccountTxt} style={{ color: "#45B9FF" }} link />
                                </Link>
                            </div>
                            {/*Logo upana*/}
                            <img className="absolute bottom-0 right-0 w-6rem mb-3 mr-3" alt="logo-upana.png" src="/src/assets/imgs/logo-upana.png"></img>
                        </div>
                    </div>
                </>
                : <>
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

                            <p className="text-xl px-5">
                                {registerConfirmMessage}
                            </p>

                            <Link to={"/"} className="w-11 mt-5">
                                <Button icon="pi pi-home" label={returnHome} className="bg-gray-900 border-0 w-full"></Button>
                            </Link>

                            {/*Logo upana*/}
                            <img className="absolute bottom-0 right-0 w-6rem mb-3 mr-3" alt="logo-upana.png" src="/src/assets/imgs/logo-upana.png"></img>
                        </div>
                    </div>
                </>}

        </>
    );
}