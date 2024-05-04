import { useEffect, useRef } from 'react'
//components
import { classNames } from 'primereact/utils';
import { Controller } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import AvatarEditor from '../../components/avatarEditor/avatarEditor'
//hooks
import useTokenData from '../../hooks/useTokenData';
import { useSelector } from 'react-redux';
import { useGet, usePut } from '../../services/api_services';
import useCustomForm from '../../hooks/useCustomForm'
import { useTranslation } from 'react-i18next';
//redux
import { RootState } from '../../redux/store';
//models
import { AuthToken } from '../../models/tokens/token.model';
import { UserResponse } from '../../models/responses/users.response';
import { BasicResponse } from '../../models/responses/basic.response';
import { ProfileForm } from '../../models/forms/profile.form'

export default function Profile() {
    const toast = useRef<Toast>(null);
    //Hooks
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);
    const { control, errors, getValues, setValue, ErrorMessageHtml, handleSubmit, reset } = useCustomForm<ProfileForm>(
        {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            photo: undefined,
            confirmPassword: ''
        });
    const { SendPutRequest, errorPut, httpCodePut, loadingPut, putResponse } = usePut();
    const { SendGetRequest, getResponse } = useGet<UserResponse>()

    //translate
    const { t } = useTranslation();
    const labelFirstName = t("profile.labels.firstName");
    const ErrorMaxCaracter = t('errors.maxLength');
    const ErrorMinCaracter = t('errors.minLength');
    const CardButtonSave = t('buttons.save');
    const labelLastName = t("profile.labels.lastName");
    const ErrorNoMatch = t("errors.noMatch", { 0: t("users.labels.password") });
    const CardTitle = t("common.cardTitles.edit", { 0: t("navigation.Profile") });
    const labelEmail = t("profile.labels.email");
    const labelPassword = t("profile.labels.password");
    const labelConfirmPassword = t("profile.labels.confirmPassword");

    const onSubmitProfile = (data: ProfileForm) => {
        const formData = new FormData();

        formData.append('photo', getValues("photo"));
        formData.append('firstName', getValues("firstName"));
        formData.append('lastName', getValues("lastName"));
        formData.append('password', getValues("password"));
        formData.append('email', getValues("email"));

        SendPutRequest("v1/users/profile/" + getTokenData?.id, data, { headers: { 'Content-Type': 'multipart/form-data' } })
    }

    useEffect(() => {
        SendGetRequest("v1/users/" + getTokenData?.id);
    }, [])

    //Load initial data
    useEffect(() => {

        if (getResponse) {
            setValue("firstName", getResponse.firstName);
            setValue("lastName", getResponse.lastName);
            setValue("email", getResponse.email);
        }

    }, [getResponse]);

    //Update Profile
    useEffect(() => {
        if (httpCodePut === 200) {
            const { message } = putResponse as BasicResponse;
            toast?.current?.show({ severity: 'success', summary: CardTitle, detail: message, life: 3000 });
            reset();
            setTimeout(() => window.location.replace("/"), 3000);
        }
        if (errorPut && httpCodePut !== 0) {
            if ('errors' in errorPut) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const errorsHtml = Object.entries(errorPut.errors).map(([_field, errors], index) => (
                    errors.map((error, errorIndex) => (
                        <li key={`${index}-${errorIndex}`}>{error}</li>
                    ))
                )).flat();
                toast?.current?.show({ severity: 'error', summary: CardTitle, detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
            } else if ('details' in errorPut) {
                toast?.current?.show({
                    severity: 'error', summary: CardTitle, detail: errorPut.details, life: 3000
                });
            }
        }

    }, [errorPut, httpCodePut, putResponse])

    return (
        <>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit(onSubmitProfile)} className="flex flex-column gap-2">
                <div className='grid'>
                    {/* Photo */}
                    <div className='col-12 flex justify-content-center align-item-center mb-5'>
                        <AvatarEditor onChangeAvatar={(file) => setValue("photo", file)} />
                    </div>
                    {/* FirstName Input */}
                    <div className='col-12 sm:col-6 py-0'>
                        <Controller
                            name="firstName"
                            control={control}
                            rules={
                                {
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{labelFirstName}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* LastName Input */}
                    <div className='col-12 sm:col-6 py-0'>
                        <Controller
                            name="lastName"
                            control={control}
                            rules={
                                {
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{labelLastName}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Password Input */}
                    <div className='col-12 sm:col-6 py-0'>
                        <Controller
                            name="password"
                            control={control}
                            rules={
                                {
                                    maxLength: {
                                        value: 50,
                                        message: ErrorMaxCaracter.replace("{{0}}", "50")
                                    },
                                    minLength: {
                                        value: 5,
                                        message: ErrorMinCaracter.replace("{{0}}", "5")
                                    },
                                    validate: (value) => {
                                        const { confirmPassword } = getValues();
                                        return confirmPassword === value || ErrorNoMatch;
                                    }
                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='password' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{labelPassword}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Password Input */}
                    <div className='col-12 sm:col-6 py-0'>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            rules={
                                {
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='password' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{labelConfirmPassword}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Email Input */}
                    <div className='col-12 sm:col-6 py-0'>
                        <Controller
                            name="email"
                            control={control}
                            rules={
                                {
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='email' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{labelEmail}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    <div className='col-12'>
                        <div className='flex justify-content-center align-items-center'>
                            <Button label={CardButtonSave} severity="success" className='mr-3' type='submit' loading={loadingPut} />
                        </div>
                    </div>

                </div>
            </form>
        </>


    )
}