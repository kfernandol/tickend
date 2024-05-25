import { useEffect, useRef, useState } from 'react'
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
import { BasicResponse, ErrorResponse, ErrorsResponse } from '../../models/responses/basic.response';
import { ProfileForm } from '../../models/forms/profile.form'
import { Card } from 'primereact/card';
import { ProfileRequest } from '../../models/requests/profile.request';

export default function Profile() {
    const toast = useRef<Toast>(null);
    //Hooks
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);
    const { control, getValues, setValue, ErrorMessageHtml, handleSubmit, reset } = useCustomForm<ProfileForm>(
        {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            photo: undefined,
            confirmPassword: '',
            direction: '',
            phone: ''
        });
    const [user, setUser] = useState<UserResponse>();
    //Api Requet
    const { SendPutRequest, errorPut, httpCodePut, loadingPut, putResponse } = usePut();
    const { SendGetRequest } = useGet<UserResponse>()
    //translate
    const { t } = useTranslation();
    const labelFirstName = t("profile.labels.firstName");
    const ErrorMaxCaracter = t('errors.maxLength');
    const ErrorMinCaracter = t('errors.minLength');
    const CardButtonSave = t('buttons.save');
    const labelLastName = t("profile.labels.lastName");
    const ErrorNoMatch = t("errors.noMatch", { 0: t("users.labels.password") });
    const CardTitle = t("common.cardTitles.edit", { 0: t("element.profile") });
    const labelEmail = t("profile.labels.email");
    const labelPassword = t("profile.labels.password");
    const labelConfirmPassword = t("profile.labels.confirmPassword");
    const labelDirection = t("profile.labels.direction");
    const labelPhone = t("profile.labels.phone");
    const CardSubTitle = t("common.cardSubTitles.edit");


    //Request Dataa
    useEffect(() => {
        const requests = [
            SendGetRequest("v1/users/" + getTokenData?.id)
        ]

        requests.forEach((request) => {
            Promise.resolve(request)
                .then((response) => {
                    switch (response.url) {
                        case "v1/users/" + getTokenData?.id:
                            setUser(response.data as UserResponse);
                            setValue("firstName", (response.data as UserResponse).firstName);
                            setValue("lastName", (response.data as UserResponse).lastName);
                            setValue("email", (response.data as UserResponse).email);
                            setValue("direction", (response.data as UserResponse).direction);
                            setValue("phone", (response.data as UserResponse).phone);
                            break;
                    }
                })
        })
    }, [])

    const onSubmitProfile = (data: ProfileForm) => {

        const formData: ProfileRequest = {
            photo: data.photo,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
            email: data.email,
            direction: data.direction ?? '',
            phone: data.phone ?? ''
        }

        SendPutRequest("v1/users/profile/" + getTokenData?.id, formData)
    }

    //Update Profile
    useEffect(() => {
        let errorResponse = errorPut;
        if (httpCodePut !== 200) {
            if (errorResponse) {
                if (typeof (errorResponse as ErrorResponse | ErrorsResponse).details === "string") // String Details
                {
                    errorResponse = errorResponse as ErrorResponse;
                    toast?.current?.show({
                        severity: 'error', summary: CardTitle, detail: errorResponse.details, life: 3000
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
                    toast?.current?.show({ severity: 'error', summary: CardTitle, detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
                }
            }
        } else {
            const { message } = putResponse as BasicResponse;
            toast?.current?.show({ severity: 'success', summary: CardTitle, detail: message, life: 3000 });
            reset();
            setTimeout(() => window.location.replace("/"), 3000);
        }

    }, [errorPut, httpCodePut, putResponse])

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
                <form onSubmit={handleSubmit(onSubmitProfile)} className="flex flex-column gap-2">
                    <div className='grid'>
                        {/* Photo */}
                        <div className='col-12 flex justify-content-center align-item-center mb-5'>
                            <AvatarEditor onChangeAvatar={(file) => setValue("photo", file)} PhotoBase64={user?.photo} />
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
                                        <label className="align-self-start block mb-1">{labelFirstName}</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            type='text'
                                            className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"}
                                            onChange={(e) => field.onChange(e.target.value)} />
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
                                        <label className="align-self-start block mb-1">{labelLastName}</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            type='text'
                                            className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"}
                                            onChange={(e) => field.onChange(e.target.value)} />
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
                                rules={
                                    {
                                        maxLength: {
                                            value: 100,
                                            message: ErrorMaxCaracter.replace("{{0}}", "100")
                                        },
                                        minLength: {
                                            value: 3,
                                            message: ErrorMinCaracter.replace("{{0}}", "3")
                                        }

                                    }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label className="align-self-start block mb-1">{labelDirection}</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            type='text'
                                            className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"}
                                            onChange={(e) => field.onChange(e.target.value)} />
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
                                        <label className="align-self-start block mb-1">{labelEmail}</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            type='email'
                                            className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"}
                                            onChange={(e) => field.onChange(e.target.value)} />
                                        {ErrorMessageHtml(field.name)}
                                    </>
                                )}
                            />
                        </div>

                        {/* Phone Input */}
                        <div className='col-12 sm:col-6 py-0'>
                            <Controller
                                name="phone"
                                control={control}
                                rules={
                                    {
                                        maxLength: {
                                            value: 16,
                                            message: ErrorMaxCaracter.replace("{{0}}", "16")
                                        },
                                        minLength: {
                                            value: 8,
                                            message: ErrorMinCaracter.replace("{{0}}", "8")
                                        }

                                    }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label className="align-self-start block mb-1">{labelPhone}</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            type='phone'
                                            className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"}
                                            onChange={(e) => field.onChange(e.target.value)} />
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
                                        <label className="align-self-start block mb-1">{labelPassword}</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            type='password'
                                            className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"}
                                            onChange={(e) => field.onChange(e.target.value)} />
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
                                        <label className="align-self-start block mb-1">{labelConfirmPassword}</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            type='password'
                                            className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"}
                                            onChange={(e) => field.onChange(e.target.value)} />
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
            </Card>
        </>


    )
}