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
import { UserFormModel } from '../../models/forms/user.form';
import { BasicResponse, ErrorResponse, ErrorsResponse } from '../../models/responses/basic.response';
import { RolesResponse } from '../../models/responses/roles.response';
import { UserRequest } from '../../models/requests/users.request';

export default function UserNew() {
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    //Form
    const { control, ErrorMessageHtml, handleSubmit, reset, getValues } = useCustomForm<UserFormModel>(
        {
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            username: undefined,
            password: undefined,
            confirmPassword: undefined,
            rolId: undefined,
        }
    );
    //Api Request
    const { SendPostRequest, postResponse, errorPost, httpCodePost, loadingPost } = usePost<BasicResponse>();
    const { SendGetRequest } = useGet<RolesResponse[]>()
    const [roles, setRoles] = useState<RolesResponse[]>();

    //Translations
    const { t } = useTranslation();
    const CardTitle = t("common.cardTitles.new", { 0: t("element.user") });
    const CardSubTitle = t("common.cardSubTitles.new", { 0: t("element.user").toLowerCase() });
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
    const CardFormDirection = t("users.labels.direction");
    const CardFormPhone = t("users.labels.phone");
    const CardFormRol = t("users.labels.role");

    //Links
    const returnToTable = paths.users;

    const onSubmit = async (data: UserFormModel) => {

        const userData: UserRequest = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            rolId: data.rolId,
            username: "",
            password: "",
        };

        SendPostRequest("v1/users/", userData)
    };

    //request initial data
    useEffect(() => {
        const requests = [
            SendGetRequest("v1/roles/")
        ];

        requests.forEach((request) => {
            Promise.resolve(request)
                .then((response) => {
                    switch (response.url) {
                        case "v1/roles/":
                            setRoles(response.data as RolesResponse[]);
                            break;
                    }
                })
        })
    }, []);

    //Save New Rol
    useEffect(() => {
        let errorResponse = errorPost;
        if (httpCodePost !== 200) {
            if (errorResponse) {
                if (typeof (errorResponse as ErrorResponse | ErrorsResponse).details === "string") // String Details
                {
                    console.log("String details")
                    errorResponse = errorResponse as ErrorResponse;
                    toast?.current?.show({
                        severity: 'error', summary: CardTitle, detail: errorResponse.details, life: 3000
                    });
                }
                else // Json Details
                {
                    errorResponse = errorResponse as ErrorsResponse;
                    console.log(errorResponse)
                    const errorsHtml = Object.entries(errorResponse.details).map(([_field, errors], index) => (
                        errors.map((error, errorIndex) => (
                            <li key={`${index}-${errorIndex}`}>{error}</li>
                        ))
                    )).flat();
                    toast?.current?.show({ severity: 'error', summary: CardTitle, detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
                }
            }
        } else {
            const { message } = postResponse as BasicResponse;
            toast?.current?.show({ severity: 'success', summary: CardTitle, detail: message, life: 3000 });
            reset();
            setTimeout(() => navigate(returnToTable), 3000);
        }

    }, [errorPost, httpCodePost, postResponse])


    return (
        <>
            <Toast ref={toast} />
            <Card
                title={CardTitle}
                subTitle={CardSubTitle}
                pt={{
                    root: { className: "my-5 px-4 pt-3" },
                    title: { className: "mt-3" },
                    subTitle: { className: "mb-1" },
                    body: { className: "pb-0 pt-1" },
                    content: { className: "pt-0" }
                }}>
                <form className='mt-4 grid gap-2"' onSubmit={handleSubmit(onSubmit)}>
                    {/* FirstName Input */}
                    <div className='col-12 md:col-6'>
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
                                    <label className="align-self-start block mb-1">{CardFormFirstName}</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* LastName Input */}
                    <div className='col-12 md:col-6'>
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
                                    <label className="align-self-start  block mb-1">{CardFormLastName}</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>
                    {/* Username Input */}
                    <div className='col-12'>
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
                                    <label className="align-self-start block mb-1">{CardFormUsername}</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />

                    </div>

                    {/* Email Input */}
                    <div className='col-12 md:col-6'>
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
                                    <label className="align-self-start block mb-1">{CardFormEmail}</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Phone Input */}
                    <div className='col-12 md:col-6'>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label className="align-self-start block mb-1">{CardFormPhone}</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Direction Input */}
                    <div className='col-12'>
                        <Controller
                            name="direction"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label className="align-self-start block mb-1">{CardFormDirection}</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Password Input */}
                    <div className='col-12 md:col-6'>
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
                                    <label className="align-self-start block mb-1">{CardFormPassword}</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        type="password"
                                        className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Password Confirm Input */}
                    <div className='col-12 md:col-6'>
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
                                    <label className="align-self-start block mb-1">{CardFormConfirmPassword}</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        type="password"
                                        className={classNames({ "p-invalid": fieldState.error }) + " w-full"}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Rol select */}
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
                                    <label className="align-self-start block mb-1">{CardFormRol}</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="name"
                                        optionValue="id"
                                        options={roles}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error }) + " w-full py-1"}
                                    />
                                    {ErrorMessageHtml(field.name)}
                                </>

                            )}
                        />
                    </div>


                    <div className='col-12'>
                        <div className='flex justify-content-center align-items-center'>
                            <Button label={CardButtonSave} severity="success" className='mr-3' type='submit' loading={loadingPost} />
                            <Link to={returnToTable}>
                                <Button label={CardButtonCancel} severity="secondary" type='button' outlined />
                            </Link>
                        </div>
                    </div>

                </form>
            </Card>
        </>
    )
}