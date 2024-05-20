import { useEffect, useState } from 'react'
//componets
import LaguageSelect from "../../components/lenguajeSelect/languageSelect";
import ButtonSubmitLogin from '../../components/buttonSubmitLogin/buttonSubmitLogin';
import { Controller } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Card } from 'primereact/card';
//hooks
import useCustomForm from '../../hooks/useCustomForm';
import { usePut } from '../../services/api_services';
import { useTranslation } from 'react-i18next';
//models
import { ResetPasswordForm } from '../../models/forms/resetPassword.form';
import { BasicResponse } from '../../models/responses/basic.response';
import { ResetPasswordRequest } from '../../models/requests/resetPassword.request';

export default function ResetPassword() {
    const [SendHash, setSendHash] = useState(false);
    const [Email, setEmail] = useState<string>("");
    //hooks
    const { ErrorMessageHtml, control, errors, handleSubmit } = useCustomForm<ResetPasswordForm>({ email: '' });
    const { SendPutRequest, httpCodePut, loadingPut, putResponse } = usePut<BasicResponse>();

    //Translate
    const { t } = useTranslation();
    const ErrorRequired = t('errors.required');
    const ErrorMaxCaracter = t('errors.maxLength');
    const ErrorMinCaracter = t('errors.minLength');
    const Title = t("resetPassword.title");
    const SubTitle = t("resetPassword.subTitle");
    const Submit = t("resetPassword.labels.submit");
    //Email sending
    const TitleSend = t("resetPasswordSend.title");
    const SubTitleSend = t("resetPasswordSend.subTitle");
    const ReturnHome = t("resetPasswordSend.labels.return");
    //Links
    const returnPage = paths.home;

    const onSubmitResetPassword = (e: ResetPasswordForm) => {
        setEmail(e.email);

        const request: ResetPasswordRequest = {
            email: e.email
        }

        SendPutRequest("v1/auth/reset-password", request);
    }

    useEffect(() => {
        if (httpCodePut === 200) {
            setSendHash(true);
        }
    }, [httpCodePut, putResponse])

    return (
        <>
            <LaguageSelect className="absolute right-0" />
            <div className="grid h-screen w-screen flex justify-content-center align-items-center">
                <div className="col-3">
                    <Card className="w-full">
                        {/*Reset password form*/}
                        {SendHash === false ?
                            <>
                                <Link to={returnPage} className='absolute'>
                                    <i className='pi pi-chevron-left' style={{ color: '#fff' }}></i>
                                </Link>
                                <div className='flex justify-content-center align-items-center w-full mt-2 mb-6'>
                                    <img src="data:image/png;base64,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"></img>
                                </div>
                                {/* Header Restore password */}
                                <h6 className="text-gray-900 text-3xl text-center font-normal p-0 m-2 my-2">{Title}</h6>
                                <h6 className="text-gray-500 text-sm text-center font-light p-0 my-2 mx-2">{SubTitle}</h6>
                                {/* Form Restore password */}
                                <div className="flex justify-content-center">
                                    <form onSubmit={handleSubmit(onSubmitResetPassword)} className="w-11 flex flex-column gap-1 align-items-center mt-3">
                                        <Controller
                                            name="email"
                                            control={control}
                                            rules={{
                                                required: ErrorRequired,
                                                maxLength: { value: 50, message: ErrorMaxCaracter.replace("{{0}}", "50") },
                                                minLength: { value: 5, message: ErrorMinCaracter.replace("{{0}}", "5") }
                                            }}
                                            render={({ field, fieldState }) => (
                                                <div className="my-2 w-full">
                                                    <label htmlFor={field.name} className={classNames({ "p-error": errors.email })}></label>
                                                    <IconField iconPosition="left" className="w-full">
                                                        <InputIcon className="pi pi-inbox"> </InputIcon>
                                                        <InputText
                                                            id={field.name}
                                                            value={field.value}
                                                            type='email'
                                                            className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                                            style={{ backgroundColor: "transparent" }}
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                            placeholder={"Email"}
                                                        />
                                                    </IconField>
                                                    {ErrorMessageHtml(field.name)}
                                                </div>
                                            )}
                                        />

                                        <ButtonSubmitLogin label={Submit} loading={loadingPut} />
                                    </form>

                                </div>
                            </>
                            :
                            <>
                                {/*Reset password sending*/}
                                <div className='flex justify-content-center align-items-center w-full mt-2 mb-6'>
                                    <img src="data:image/png;base64,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"></img>
                                </div>
                                {/* Header Restore password */}
                                <h6 className="text-gray-900 text-3xl text-center font-normal p-0 m-2 my-2">{TitleSend}</h6>
                                <h6 className="text-gray-500 text-sm text-center font-light p-0 my-2 mx-2">{SubTitleSend}</h6>
                                <h4 className='text-center my-5 text-2xl font-bold'>{Email}</h4>
                                <Link to={returnPage}>
                                    <ButtonSubmitLogin label={ReturnHome} loading={loadingPut} />
                                </Link>
                            </>
                        }
                    </Card>
                </div>

            </div>
        </>
    )
}
