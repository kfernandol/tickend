import { useEffect } from "react";
//Css
import "./layoutLogin.css"
//Translation
import { useTranslation } from "../../../i18n";
//Components
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import LaguageSelect from "../../../components/lenguajeSelect/languageSelect"
import ButtonSubmitLogin from "../../../components/buttonSubmitLogin/buttonSubmitLogin";
import BackgroundAnimated from "../../../components/backgroundAnimated/backgroundAnimated";
//models
import { AuthRequest } from "../../../models/requests/auth.request";
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

function LayoutLogin() {
    //Form
    const { control, handleSubmit, setError, errors, watch, ErrorMessageHtml } = useCustomForm<LoginFormModel>({ username: "", password: "", keepLogin: false });
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
    const KeepMeLogin = t("auth.login.keepMeLogin");
    const LoginSubmit = t("auth.login.submit");
    const RestorePassword = t("auth.login.restorePassword");
    const DataInvalid = t("auth.login.loginInvalid")

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
            authResponse.KeepLogged = watch("keepLogin");
            dispatch(login(authResponse));
        }
    }, [authResponse]);


    useEffect(() => {
        if (errorAuth) {
            setError("username", {
                type: "manual",
            });
            setError("password", {
                type: "manual",
                message: DataInvalid
            })
        }

    }, [errorAuth])

    return (
        <>
            <BackgroundAnimated />
            <LaguageSelect />
            <div className="grid h-screen w-screen m-0 p-0">
                <div className="col-12 sm:col-6 sm:col-offset-3 md:col-5 md:col-offset-4 lg:col-10 lg:col-offset-1 lg:px-5 xl:col-8 xl:col-offset-2 xl:px-8">
                    {/*Login Form*/}
                    <div className="grid h-full justify-content-center align-items-center">
                        <div className="col-10 sm:col-10 lg:col-4 bg-red h-23rem login-container">
                            {/* Header Login */}
                            <h6 className="text-white text-3xl font-normal p-0 m-2">{LoginTitle}</h6>
                            <h6 className="text-gray-300 text-sm font-light p-0 my-2 mx-2">{LoginSubTitle}</h6>
                            {/* Form login */}
                            <div className="flex justify-content-center">
                                <form onSubmit={handleSubmit(onSubmitLogin)} className="w-11 flex flex-column gap-1 align-items-center mt-3">
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
                                                <span className="p-input-icon-left w-full">
                                                    <i className="pi pi-user" />
                                                    <InputText
                                                        id={field.name}
                                                        value={field.value}
                                                        className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                                        style={{ backgroundColor: "transparent" }}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        placeholder={Username}
                                                    />
                                                </span>
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
                                                <span className="p-input-icon-left w-full">
                                                    <i className="pi pi-lock" />
                                                    <InputText
                                                        id={field.name}
                                                        value={field.value}
                                                        type="password"
                                                        className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        placeholder={Password}
                                                    />
                                                </span>
                                                {ErrorMessageHtml(field.name)}
                                            </>
                                        )}
                                    />
                                    <Controller
                                        name="keepLogin"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <div className="flex align-items-center justify-content-between w-12">
                                                    <div>
                                                        <Checkbox
                                                            inputId={field.name}
                                                            checked={field.value}
                                                            inputRef={field.ref}
                                                            className={classNames({ "p-invalid": fieldState.error })}
                                                            onChange={(e) => field.onChange(e.checked)}
                                                        />
                                                        <label htmlFor={field.name} className="ml-2 text-sm text-white">
                                                            {KeepMeLogin}
                                                        </label>
                                                    </div>
                                                    <Link to={paths.resetPassword}>
                                                        <Button type="button" className="text-sm" label={RestorePassword} style={{ color: "#45B9FF" }} link />
                                                    </Link>
                                                </div>
                                                {ErrorMessageHtml(field.name)}
                                            </>
                                        )}
                                    />
                                    <ButtonSubmitLogin label={LoginSubmit} loading={loadingAuth} />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default LayoutLogin;
