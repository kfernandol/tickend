import React, { useEffect } from "react";
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
//models
import { AuthRequest } from "../../../models/requests/auth/auth.request";
//hooks
import { Controller } from "react-hook-form";
import useLoginForm from "../../../hooks/form/useLoginForm";
import { useDispatch } from "react-redux";
import { login } from "../../../redux/AuthSlice";
import { useAuthAPI } from "../../../services/api_services";
import BackgroundAnimated from "../../../components/backgroundAnimated/backgroundAnimated";

function LayoutLogin() {
  //hooks
  const { t } = useTranslation();
  const { control, handleSubmit, setError, errors, watch } = useLoginForm();
  const { SendAuthRequest, loading, authResponse, error } = useAuthAPI();
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    const loginData: AuthRequest = {
      username: data.username,
      password: data.password,
    };
    SendAuthRequest("v1/auth/token", loginData);
  };

  useEffect(() => {
    if (authResponse) {
      const keepLogin = watch("keepLogin");
      authResponse.KeepLogged = keepLogin;
      dispatch(login(authResponse));
    }
  }, [authResponse]);


  useEffect(() => {
    if (error) {
      setError("username", {
        type: "manual",
      });
      setError("password", {
        type: "manual",
        message: "Usuario o contraseña invalido"
      })
    }

  }, [error])

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
  };

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
              <h6 className="text-white text-3xl font-normal p-0 m-2">{t("loginTitle")}</h6>
              <h6 className="text-gray-300 text-sm font-light p-0 my-2 mx-2">{t("loginSubtitle")}</h6>
              {/* Form login */}
              <div className="flex justify-content-center">
                <form onSubmit={handleSubmit(onSubmit)} className="w-11 flex flex-column gap-1 align-items-center mt-3">
                  <Controller
                    name="username"
                    control={control}
                    rules={{
                      required: t("usernameRequired"),
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
                            placeholder={t("username")}
                          />
                        </span>
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: t("passwordRequired"),
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
                            placeholder={t("password")}
                          />
                        </span>
                        {getFormErrorMessage(field.name)}
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
                              {t("keepMeLogin")}
                            </label>
                          </div>
                          <Button className="text-sm" label={t("restorePassword")} style={{ color: "#45B9FF" }} link />
                        </div>
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                  <ButtonSubmitLogin label={t("loginSubmit")} loading={loading} />
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
