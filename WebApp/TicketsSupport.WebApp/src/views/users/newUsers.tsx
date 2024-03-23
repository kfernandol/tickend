import React, { useEffect, useRef, useState } from 'react'
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

//Hookss
import { useTranslation } from 'react-i18next'
import { useGet, usePost } from '../../services/api_services';
import useUserForm from '../../hooks/form/useUserForm';

//Models
import { UserRequestPost } from '../../models/requests/users.request';
import { UserFormModel } from '../../models/forms/user.form';
import { BasicResponse, ErrorResponse } from '../../models/responses/basic.response';
import { RolesResponse } from '../../models/responses/roles.response';

function NewUsers() {
    const [roles, setRoles] = useState<{ name: string, value: number }[]>([{ name: "", value: 0 }]);
    const toast = useRef<Toast>(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { control, getFormErrorMessage, errors, handleSubmit, reset, getValues } = useUserForm();
    const { SendPostRequest, postResponse, loadingPost, errorPost, httpCodePost } = usePost<BasicResponse>();
    const { SendGetRequest, getResponse, loadingGet } = useGet<RolesResponse[]>()

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

    useEffect(() => {
        if (errorPost && httpCodePost !== 0) {
            if (httpCodePost === 200) {
                const { message } = postResponse as BasicResponse;
                toast?.current?.show({ severity: 'success', summary: t("UserCardTitleEditUser"), detail: message, life: 3000 });
                reset();
                setTimeout(() => navigate(paths.users), 3000);
            } else {
                if ('errors' in errorPost) {
                    const errorsHtml = Object.entries(errorPost.errors).map(([_field, errors], index) => (
                        errors.map((error, errorIndex) => (
                            <li key={`${index}-${errorIndex}`}>{error}</li>
                        ))
                    )).flat();
                    toast?.current?.show({ severity: 'error', summary: t("UserCardTitleEditUser"), detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
                } else if ('details' in errorPost) {
                    toast?.current?.show({
                        severity: 'error', summary: t("UserCardTitleEditUser"), detail: errorPost.details, life: 3000
                    });
                }
            }
        }

    }, [errorPost])


    return (
        <>
            <Toast ref={toast} />
            <Card title={t("UserCardTitleNewUser")} subTitle={t("UserCardSubTitleNewUser")}>
                <form className='mt-5 grid gap-2"' onSubmit={handleSubmit(onSubmit)}>
                    {/* FirstName Input */}
                    <div className='col-12 sm:col-6'>
                        <Controller
                            name="firstName"
                            control={control}
                            rules={
                                {
                                    required: t('ErrorIsRequired'),
                                    maxLength: {
                                        value: 150,
                                        message: t('ErrorMaxCaracter') + 150
                                    },
                                    minLength: {
                                        value: 3,
                                        message: t('ErrorMinCaracter') + 3
                                    }

                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{t("UserCardFormFirstName")}</label>
                                    </span>
                                    {getFormErrorMessage(field.name)}
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
                                    required: t('ErrorIsRequired'),
                                    maxLength: {
                                        value: 150,
                                        message: t('ErrorMaxCaracter') + 150
                                    },
                                    minLength: {
                                        value: 3,
                                        message: t('ErrorMinCaracter') + 3
                                    }

                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{t("UserCardFormLastName")}</label>
                                    </span>
                                    {getFormErrorMessage(field.name)}
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
                                    required: t('ErrorIsRequired'),
                                    maxLength: {
                                        value: 50,
                                        message: t('ErrorMaxCaracter') + 50
                                    },
                                    minLength: {
                                        value: 5,
                                        message: t('ErrorMinCaracter') + 5
                                    }

                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{t("UserCardFormUsername")}</label>
                                    </span>
                                    {getFormErrorMessage(field.name)}
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
                                    required: t('ErrorIsRequired'),
                                    maxLength: {
                                        value: 150,
                                        message: t('ErrorMaxCaracter') + 200
                                    },
                                    minLength: {
                                        value: 5,
                                        message: t('ErrorMinCaracter') + 5
                                    }

                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='email' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{t("UserCardFormEmail")}</label>
                                    </span>
                                    {getFormErrorMessage(field.name)}
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
                                    required: t('ErrorIsRequired'),
                                    maxLength: {
                                        value: 150,
                                        message: t('ErrorMaxCaracter') + 50
                                    },
                                    minLength: {
                                        value: 5,
                                        message: t('ErrorMinCaracter') + 5
                                    }

                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='password' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{t("UserCardFormPassword")}</label>
                                    </span>
                                    {getFormErrorMessage(field.name)}
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
                                    required: t('ErrorIsRequired'),
                                    maxLength: {
                                        value: 150,
                                        message: t('ErrorMaxCaracter') + 50
                                    },
                                    minLength: {
                                        value: 5,
                                        message: t('ErrorMinCaracter') + 5
                                    },
                                    validate: (value) => {
                                        const { password } = getValues();
                                        return password === value || t("UserCardFormPassword") + t("ErrorNoMatch");
                                    }
                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.firstName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='password' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{t("UserCardFormConfirmPassword")}</label>
                                    </span>
                                    {getFormErrorMessage(field.name)}
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
                                    required: t('ErrorIsRequired'),
                                    min: {
                                        value: 1,
                                        message: t('ErrorIsRequired')
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
                                        <label htmlFor="dd-city">{t("UserCardFormRol")}</label>
                                        {getFormErrorMessage(field.name)}
                                    </span>
                                </>

                            )}
                        />
                    </div>


                    <div className='col-12'>
                        <div className='flex justify-content-center align-items-center'>
                            <Button label={t("UserCardFormButtonSave")} severity="success" className='mr-3' type='submit' loading={loadingPost} />
                            <Link to={paths.users}>
                                <Button label={t("UserCardFormButtonCancel")} severity="secondary" type='button' />
                            </Link>
                        </div>
                    </div>

                </form>
            </Card>
        </>
    )
}

export default NewUsers