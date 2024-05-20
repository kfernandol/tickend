import { useEffect, useRef, useState } from 'react'
import { paths } from '../../routes/paths';
import { classNames } from 'primereact/utils';
//Components
import { PrimeIcons } from 'primereact/api';
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext';
import { Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { ColorPicker } from 'primereact/colorpicker';
//Hooks
import { useTranslation } from 'react-i18next'
import { useGet, usePut } from '../../services/api_services';
import useCustomForm from '../../hooks/useCustomForm';
//Models
import { BasicResponse } from '../../models/responses/basic.response';
import { TicketTypeFormModel } from '../../models/forms/ticketType.form';
import { TicketTypeRequest } from '../../models/requests/ticketType.request';
import { TicketTypeResponse } from '../../models/responses/ticketType.response';

export default function TicketTypeEdit() {
    const { id } = useParams();
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    //Form
    const { control, ErrorMessageHtml, errors, handleSubmit, reset, setValue } = useCustomForm<TicketTypeFormModel>({ name: "", icon: "", iconColor: "#FF0000" });
    const [FilterIcon, setFilterIcon] = useState<string>('');
    const [IconColor, setIconColor] = useState<string>('');
    //Request API
    const { SendPutRequest, putResponse, loadingPut, errorPut, httpCodePut } = usePut<BasicResponse>();
    const { SendGetRequest } = useGet<TicketTypeResponse>();

    //Translation
    const { t } = useTranslation();
    const CardTitle = t("common.cardTitles.edit", { 0: t("element.ticketTypes") });
    const CardSubTitle = t("common.cardSubTitles.edit");
    const ErrorRequired = t('errors.required');
    const ErrorMaxCaracter = t('errors.maxLength');
    const ErrorMinCaracter = t('errors.minLength');
    const CardButtonSave = t('buttons.save');
    const CardButtonCancel = t('buttons.cancel');
    const CardFormName = t("common.labels.name");
    const CardFormIcon = t("ticketTypes.labels.icon");
    const CardFormIconColor = t("ticketTypes.labels.iconColor");

    //Links
    const returnToTable = paths.ticketTypes;

    //Request data
    useEffect(() => {
        const requests = [
            SendGetRequest("/v1/ticket/types/" + id)
        ];

        requests.forEach((request) => {
            Promise.resolve(request)
                .then((response) => {
                    switch (response.url) {
                        case "/v1/ticket/types/" + id:
                            setValue("name", (response.data as TicketTypeResponse).name)
                            setValue("icon", (response.data as TicketTypeResponse).icon)
                            setValue("iconColor", (response.data as TicketTypeResponse).iconColor)
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

    const onSubmit = async (data: TicketTypeFormModel) => {

        const typeTicketRequest: TicketTypeRequest = {
            name: data.name,
            icon: data.icon,
            iconColor: data.iconColor
        };

        SendPutRequest("v1/ticket/types/" + id, typeTicketRequest)
    };

    const onClickIcon = (icon: string) => {
        setValue("icon", icon)
    }

    return (
        <>
            <Toast ref={toast} />
            <Card
                title={CardTitle}
                subTitle={CardSubTitle} pt={{
                    root: { className: "my-5 px-4 pt-3" },
                    title: { className: "mt-3" },
                    subTitle: { className: "mb-1" },
                    body: { className: "pb-0 pt-1" },
                    content: { className: "pt-0" }
                }}>
                <form className='mt-5 grid gap-2"' onSubmit={handleSubmit(onSubmit)}>
                    {/* Name Input */}
                    <div className='col-12 sm: col-6'>
                        <Controller
                            name="name"
                            control={control}
                            rules={
                                {
                                    required: ErrorRequired,
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
                                    <label className="align-self-start block mb-1">{CardFormName}</label>
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

                    <div className='col-12 sm: col-6'>
                        <Controller
                            name="icon"
                            control={control}
                            rules={
                                {
                                    required: ErrorRequired,
                                    maxLength: {
                                        value: 50,
                                        message: ErrorMaxCaracter.replace("{{0}}", "50")
                                    },
                                    minLength: {
                                        value: 1,
                                        message: ErrorMinCaracter.replace("{{0}}", "1")
                                    }

                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.name })}></label>
                                    <div className='grid'>
                                        <div className='col'>
                                            <label className="align-self-start block mb-1">{CardFormIcon}</label>
                                            <InputText
                                                id={field.name}
                                                value={field.value}
                                                type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"}
                                                onChange={(e) => { field.onChange(e.target.value); setFilterIcon(e.target.value) }} />
                                        </div>
                                        <div className='col-1 flex justify-content-center align-items-center'>
                                            <i className={field.value} style={{ fontSize: '24px', color: IconColor }}></i>
                                        </div>
                                    </div>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    <Card className='w-full'>
                        <div className='grid text-center' style={{ maxHeight: "250px", overflowY: "auto" }}>
                            {Object.entries(PrimeIcons).filter(([key]) => key.toLowerCase().includes(FilterIcon.toLowerCase())).map(([key, value]) => (
                                <div key={`${key}-${value}`} className='col-3 md:col-1 mb-5'>
                                    <Button onClick={() => onClickIcon(value)} type='button' icon={value} rounded text severity="info" aria-label="Bookmark" />
                                </div>

                            ))}
                        </div>
                    </Card>

                    {/* Icon Color Input */}
                    <div className='col-12 sm: col-6'>
                        <Controller
                            name="iconColor"
                            control={control}
                            rules={
                                {
                                    maxLength: {
                                        value: 7,
                                        message: ErrorMaxCaracter.replace("{{0}}", "7")
                                    },
                                    minLength: {
                                        value: 7,
                                        message: ErrorMinCaracter.replace("{{0}}", "7")
                                    }

                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.name })}></label>
                                    <div className='grid  mt-5'>
                                        <div className='col-1 flex align-items-center justify-content-center'>
                                            <ColorPicker format="hex" value={field.value} onChange={(e) => { field.onChange("#" + e.value); setIconColor("#" + e.value) }} />
                                        </div>

                                        <div className='col'>
                                            <label className="align-self-start block mb-1">{CardFormIconColor}</label>
                                            <InputText
                                                id={field.name}
                                                value={field.value}
                                                type='text'
                                                className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"}
                                                onChange={(e) => { field.onChange(e.target.value); setIconColor(e.target.value) }} />
                                        </div>
                                    </div>

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
    )
}