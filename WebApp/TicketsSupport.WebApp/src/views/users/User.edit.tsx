import { useEffect, useRef, useState } from 'react'
import { paths } from '../../routes/paths';
import { classNames } from 'primereact/utils';
//Components
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext';
import { Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
//Hooks
import { useTranslation } from 'react-i18next'
import { useGet, usePut } from '../../services/api_services';
import useCustomForm from '../../hooks/useCustomForm';
//Models
import { UserFormModel } from '../../models/forms/user.form';
import { BasicResponse } from '../../models/responses/basic.response';
import { UserResponse } from '../../models/responses/users.response';
import { RolesResponse } from '../../models/responses/roles.response';
import { UserRequest } from '../../models/requests/users.request';



export default function UserEdit() {
    const toast = useRef<Toast>(null);
    const { id } = useParams();
    const navigate = useNavigate();
    //Form
    const { control, ErrorMessageHtml, handleSubmit, reset, getValues, setValue } = useCustomForm<UserFormModel>(
        {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            direction: "",
            phone: "",
            confirmPassword: "",
            rolId: 0
        }
    );

    //Api Request
    const { SendPutRequest, putResponse, loadingPut, errorPut, httpCodePut } = usePut<BasicResponse>();
    const { SendGetRequest, loadingGet } = useGet<UserResponse | RolesResponse>()
    const [roles, setRoles] = useState<RolesResponse[]>();

    //Translations
    const { t } = useTranslation();
    const CardTitle = t("common.cardTitles.edit", { 0: t("element.user") });
    const CardSubTitle = t("common.cardSubTitles.edit");
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

        if (id) {
            const userData: UserRequest = {
                id: parseInt(id),
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                rolId: data.rolId,
                username: data.username,
                password: data.password,
                phone: data.phone,
                direction: data.direction
            };

            SendPutRequest("v1/users/" + id, userData)
        }
    };

    //request user data
    useEffect(() => {
        const request = [
            SendGetRequest("v1/users/" + id),
            SendGetRequest("v1/roles/"),
        ];

        request.forEach((request) => {
            Promise.resolve(request)
                .then((result) => {
                    switch (result.url) {
                        case "v1/users/" + id:
                            setValue("firstName", (result.data as UserResponse).firstName);
                            setValue("lastName", (result.data as UserResponse).lastName);
                            setValue("email", (result.data as UserResponse).email);
                            setValue("rolId", (result.data as UserResponse).rolId);
                            setValue("username", (result.data as UserResponse).username);
                            setValue("direction", (result.data as UserResponse).direction);
                            setValue("phone", (result.data as UserResponse).phone);
                            break;
                        case "v1/roles/":
                            setRoles((result.data as RolesResponse[]));
                            break;
                    }
                })
        })
    }, [])

    //Save New Rol
    useEffect(() => {
        if (httpCodePut === 200) {
            const { message } = putResponse as BasicResponse;
            toast?.current?.show({ severity: 'success', summary: CardTitle, detail: message, life: 3000 });
            reset();
            setTimeout(() => navigate(returnToTable), 3000);
        }
        if (errorPut && httpCodePut !== 0) {
            if ('errors' in errorPut) {
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
            {loadingGet
                ?
                <div className='flex h-full w-full justify-content-center align-items-center'>
                    <ProgressSpinner />
                </div>
                :

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
                                    <Button label={CardButtonSave} severity="success" className='mr-3' type='submit' loading={loadingPut} />
                                    <Link to={returnToTable}>
                                        <Button label={CardButtonCancel} severity="secondary" type='button' outlined />
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