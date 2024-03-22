import React, { useEffect, useRef, useState } from 'react'
import { paths } from '../../routes/paths';
import { classNames } from 'primereact/utils';

//Models
import { UserRequestPut } from '../../models/requests/users.request';
import { UserFormModel } from '../../models/forms/user.form';
import { BasicResponse } from '../../models/responses/basic.response';
import { UserResponse } from '../../models/responses/users.response';

//Hooks
import { useTranslation } from 'react-i18next'
import { useGet, usePut } from '../../services/api_services';
import useUserForm from '../../hooks/form/useUserForm';

//Components
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext';
import { Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RolesResponse } from '../../models/responses/roles.response';



function EditUsers() {
    const [roles, setRoles] = useState<{ name: string, value: number }[]>([{ name: "", value: 0 }]);
    const toast = useRef<Toast>(null);
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { control, getFormErrorMessage, errors, handleSubmit, reset, getValues, setValue } = useUserForm();
    const { SendPutRequest, putResponse, loadingPut, errorPut, httpCodePut } = usePut<BasicResponse>();
    const { SendGetRequest, getResponse, loadingGet } = useGet<UserResponse | RolesResponse>()

    const onSubmit = async (data: UserFormModel) => {

        if (id) {
            const userData: UserRequestPut = {
                id: parseInt(id),
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                rolId: data.rolId,
                username: data.username,
                password: data.password,
            };

            SendPutRequest("v1/users/" + id, userData)
        }
    };

    //request user data
    useEffect(() => {
        SendGetRequest("v1/users/" + id);
        SendGetRequest("v1/roles/");
    }, [])

    //Load user data

    useEffect(() => {

        if (getResponse) {
            if (Array.isArray(getResponse)) {

                //Is Rol List Response
                const areAllRolResponses = getResponse.every(item => Object.prototype.toString.call(item) === '[object Object]' && 'permissionLevel' in item);
                if (areAllRolResponses) {
                    const roles = getResponse.map(x => ({
                        name: x.name,
                        value: x.id
                    }));

                    setRoles(roles);
                }

                //Is User Response
            } else if ('firstName' in getResponse) {
                setValue("firstName", getResponse.firstName);
                setValue("lastName", getResponse.lastName);
                setValue("email", getResponse.email);
                setValue("rolId", getResponse.rolId);
                setValue("username", getResponse.username);
            }
        }

    }, [getResponse]);

    //Save User Edit
    useEffect(() => {
        if (errorPut && httpCodePut !== 0) {
            if (httpCodePut === 200) {
                const { message } = putResponse as BasicResponse;
                toast?.current?.show({ severity: 'success', summary: t("UserCardTitleEditUser"), detail: message, life: 3000 });
                reset();
                setTimeout(() => navigate(paths.users), 3000);
            } else {
                if ('errors' in errorPut) {
                    const errorsHtml = Object.entries(errorPut.errors).map(([_field, errors], index) => (
                        errors.map((error, errorIndex) => (
                            <li key={`${index}-${errorIndex}`}>{error}</li>
                        ))
                    )).flat();
                    toast?.current?.show({ severity: 'error', summary: t("UserCardTitleEditUser"), detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
                } else if ('details' in errorPut) {
                    toast?.current?.show({
                        severity: 'error', summary: t("UserCardTitleEditUser"), detail: errorPut.details, life: 3000
                    });
                }
            }
        }

    }, [errorPut])


    return (
        <>
            {loadingGet
                ?
                <div className='flex h-full w-full justify-content-center align-items-center'>
                    <ProgressSpinner />
                </div>
                :

                <>
                    <Toast ref={toast} />
                    <Card title={t("UserCardTitleEditUser")} subTitle={t("UserCardSubTitleEditUser")}>
                        <form className='mt-5 grid gap-2"' onSubmit={handleSubmit(onSubmit)}>
                            {/* FirstName Input */}
                            <div className='col-6'>
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
                            <div className='col-6'>
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
                            <div className='col-6'>
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
                            <div className='col-6'>
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
                            <div className='col-6'>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={
                                        {
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
                            <div className='col-6'>
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    rules={
                                        {
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

                            {/* Rol Select */}
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
                                            <Dropdown
                                                id={field.name}
                                                value={field.value}
                                                optionLabel="name"
                                                placeholder={t("UserCardFormRol")}
                                                options={roles}
                                                focusInputRef={field.ref}
                                                onChange={(e) => field.onChange(e.value)}
                                                className={classNames({ 'p-invalid': fieldState.error }) + " w-full py-1"}
                                            />
                                            {getFormErrorMessage(field.name)}
                                        </>

                                    )}
                                />
                            </div>


                            <div className='col-12'>
                                <div className='flex justify-content-center align-items-center'>
                                    <Button label={t("UserCardFormButtonEdit")} severity="success" className='mr-3' type='submit' loading={loadingPut} />
                                    <Link to={paths.users}>
                                        <Button label={t("UserCardFormButtonCancel")} severity="secondary" type='button' />
                                    </Link>
                                </div>
                            </div>

                        </form>
                    </Card>
                </>

            }
        </>
    )
}

export default EditUsers;