import { useEffect, useRef, useState } from 'react'
import { paths } from '../../routes/paths';
import { classNames } from 'primereact/utils';
//Components
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext';
import { Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
//Hooks
import { useTranslation } from 'react-i18next'
import { useGet, usePost } from '../../services/api_services';
import useCustomForm from '../../hooks/useCustomForm';
//Models
import { UserRequestPost } from '../../models/requests/users.request';
import { UserFormModel } from '../../models/forms/user.form';
import { BasicResponse } from '../../models/responses/basic.response';
import { RolesResponse } from '../../models/responses/roles.response';

export default function UserNew() {
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    //Form
    const { control, ErrorMessageHtml, errors, handleSubmit, reset, getValues } = useCustomForm<UserFormModel>(
        {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            rolId: 0
        }
    );
    //Api Request
    const { SendPostRequest, postResponse, errorPost, httpCodePost, loadingPost } = usePost<BasicResponse>();
    const { SendGetRequest, getResponse } = useGet<RolesResponse[]>()
    const [roles, setRoles] = useState<{ name: string, value: number }[]>([{ name: "", value: 0 }]);

    //Translations
    const { t } = useTranslation();
    const CardTitle = t("common.cardTitles.new", { 0: t("navigation.Users") });
    const CardSubTitle = t("common.cardSubTitles.new", { 0: t("navigation.Users") });
    const ErrorRequired = t('errors.required');
    const ErrorMaxCaracter = t('errors.maxLength');
    const ErrorMinCaracter = t('errors.minLength');
    const ErrorNoMatch = t("errors.noMatch", { 0: t("users.labels.password") });
    const CardButtonSave = t('buttons.save');
    const CardButtonCancel = t('buttons.cancel');
    const CardFormFirstName = t("users.labels.firstName")
    const CardFormLastName = t("users.labels.lastName");
    const CardFormUsername = t("users.labels.username");
    const CardFormEmail = t("users.labels.email");
    const CardFormPassword = t("users.labels.password");
    const CardFormConfirmPassword = t("users.labels.confirmPassword");
    const CardFormRol = t("users.labels.role");

    //Links
    const returnToTable = paths.users;

    const onSubmit = async (data: UserFormModel) => {

        const userData: UserRequestPost = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            rolId: data.rolId,
            username: data.username,
            password: data.password,
        };

        SendPostRequest("v1/users/", userData)
    };

    //request initial data
    useEffect(() => {
        SendGetRequest("v1/roles/");
    }, []);

    //load initial data
    useEffect(() => {
        if (Array.isArray(getResponse)) {
            const areAllRolResponses = getResponse.every(item => Object.prototype.toString.call(item) === '[object Object]' && 'permissionLevel' in item);

            if (areAllRolResponses) {
                const roles = getResponse.map(x => ({
                    name: x.name,
                    value: x.id
                }));

                setRoles(roles);
            }
        }
    }, [getResponse])

    //Save New Rol
    useEffect(() => {
        if (httpCodePost === 200) {
            const { message } = postResponse as BasicResponse;
            toast?.current?.show({ severity: 'success', summary: CardTitle, detail: message, life: 3000 });
            reset();
            setTimeout(() => navigate(returnToTable), 3000);
        }
        if (errorPost && httpCodePost !== 0) {
            if ('errors' in errorPost) {
                const errorsHtml = Object.entries(errorPost.errors).map(([_field, errors], index) => (
                    errors.map((error, errorIndex) => (
                        <li key={`${index}-${errorIndex}`}>{error}</li>
                    ))
                )).flat();
                toast?.current?.show({ severity: 'error', summary: CardTitle, detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
            } else if ('details' in errorPost) {
                toast?.current?.show({
                    severity: 'error', summary: CardTitle, detail: errorPost.details, life: 3000
                });
            }
        }

    }, [errorPost, httpCodePost, postResponse])


    return (
        <>
            <Toast ref={toast} />
            <Card title={CardTitle} subTitle={CardSubTitle}>
                <form className='mt-5 grid gap-2"' onSubmit={handleSubmit(onSubmit)}>
                    {/* FirstName Input */}
                    <div className='col-12 sm:col-6'>
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{CardFormFirstName}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* LastName Input */}
                    <div className='col-12 sm:col-6'>
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{CardFormLastName}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>
                    {/* Username Input */}
                    <div className='col-12 sm:col-6'>
                        <Controller
                            name="username"
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
                                    }

                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{CardFormUsername}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />

                    </div>

                    {/* Email Input */}
                    <div className='col-12 sm:col-6'>
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='email' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{CardFormEmail}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>


                    {/* Password Input */}
                    <div className='col-12 sm:col-6'>
                        <Controller
                            name="password"
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
                                        const { confirmPassword } = getValues();
                                        return confirmPassword === value || ErrorNoMatch;
                                    }
                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='password' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{CardFormPassword}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Password Input */}
                    <div className='col-12 sm:col-6'>
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='password' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{CardFormConfirmPassword}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Rol slect */}
                    <div className='col-12'>
                        <Controller
                            name="rolId"
                            control={control}
                            rules={
                                {
                                    required: ErrorRequired,
                                    min: {
                                        value: 1,
                                        message: ErrorRequired
                                    },
                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-float-label w-full">
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            optionLabel="name"
                                            options={roles}
                                            focusInputRef={field.ref}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={classNames({ 'p-invalid': fieldState.error }) + " w-full py-1"}
                                        />
                                        <label htmlFor={field.name}>{CardFormRol}</label>
                                        {ErrorMessageHtml(field.name)}
                                    </span>
                                </>

                            )}
                        />
                    </div>


                    <div className='col-12'>
                        <div className='flex justify-content-center align-items-center'>
                            <Button label={CardButtonSave} severity="success" className='mr-3' type='submit' loading={loadingPost} />
                            <Link to={returnToTable}>
                                <Button label={CardButtonCancel} severity="secondary" type='button' />
                            </Link>
                        </div>
                    </div>

                </form>
            </Card>
        </>
    )
}