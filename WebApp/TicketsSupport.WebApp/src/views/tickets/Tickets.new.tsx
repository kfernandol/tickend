import { useEffect, useRef, useState } from 'react'
import { paths } from '../../routes/paths';
import { classNames } from 'primereact/utils';
//Components
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext';
import { Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Editor } from 'primereact/editor';
import { Dropdown } from 'primereact/dropdown';
//Hooks
import { useTranslation } from 'react-i18next'
import { useGet, usePost } from '../../services/api_services';
import useCustomForm from '../../hooks/useCustomForm';
//Models
import { BasicResponse } from '../../models/responses/basic.response';
import { TicketForm } from '../../models/forms/ticket.form';
import { ProjectResponse } from '../../models/responses/project.response';
import { TicketTypeResponse } from '../../models/responses/ticketType.response';
import { TicketRequest } from '../../models/requests/ticket.request';

export default function TicketsNew() {
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    //Form
    const { control, ErrorMessageHtml, errors, handleSubmit, reset, getValues, watch } = useCustomForm<TicketForm>({ Title: '', Description: '', Priority: 0, Project: 0, Status: 0, Type: 0 });
    //Request API
    const { SendPostRequest, postResponse, loadingPost, errorPost, httpCodePost } = usePost<BasicResponse>();
    const { SendGetRequest } = useGet<ProjectResponse>();
    const [Projects, setProjects] = useState<ProjectResponse[]>();
    const [TicketType, setTicketType] = useState<TicketTypeResponse[]>();
    //Translation
    const { t } = useTranslation();
    const CardTitle = t("common.cardTitles.new", { 0: t("navigation.Ticket") });
    const CardSubTitle = t("common.cardSubTitles.new", { 0: t("navigation.Ticket") });
    const ErrorRequired = t('errors.required');
    const ErrorMaxCaracter = t('errors.maxLength');
    const ErrorMinCaracter = t('errors.minLength');
    const CardButtonSave = t('buttons.save');
    const CardButtonCancel = t('buttons.cancel');
    const CardFormTitle = t("tickets.labels.title");
    const CardFormDescription = t("tickets.labels.description");
    const CardFormProject = t("tickets.labels.project");
    const CardFormType = t("tickets.labels.type");
    //Links
    const returnToTable = paths.Tickets;

    //Request Data
    useEffect(() => {
        const requests = [
            SendGetRequest('v1/projects'),
        ]
        Promise.all(requests)
            .then((responses) => {
                responses.forEach((response) => {
                    switch (response.url) {
                        case "v1/projects":
                            setProjects(response.data as ProjectResponse[]);
                            break;
                        default:
                            break;
                    }
                });
            })
            .catch((error) => {
                console.error("Error en las solicitudes:", error);
            });

    }, [])

    useEffect(() => {
        const ProjectId = getValues("Project");
        const requests = [
            SendGetRequest('v1/ticket/types/byproject/' + ProjectId),
        ]
        Promise.all(requests)
            .then((responses) => {
                responses.forEach((response) => {
                    switch (response.url) {
                        case "v1/ticket/types/byproject/" + ProjectId:
                            setTicketType(response.data as TicketTypeResponse[]);
                            break;
                        default:
                            break;
                    }
                });
            })
            .catch((error) => {
                console.error("Error en las solicitudes:", error);
            });

    }, [watch("Project")])

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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    const onSubmit = async (data: TicketForm) => {
        const TicketRequest: TicketRequest = {
            title: data.Title,
            description: data.Description,
            projectId: data.Project,
            ticketTypeId: data.Type
        };

        SendPostRequest("v1/tickets", TicketRequest)
    };

    return (
        <>
            <Toast ref={toast} />
            <Card title={CardTitle} subTitle={CardSubTitle}>
                <form className='mt-5 grid gap-2"' onSubmit={handleSubmit(onSubmit)}>

                    {/* Title Input */}
                    <div className='col-12'>
                        <Controller
                            name="Title"
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.Title })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{CardFormTitle}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Description Input */}
                    <div className='col-12'>
                        <Controller
                            name="Description"
                            control={control}
                            rules={
                                {
                                    required: ErrorRequired,
                                    minLength: {
                                        value: 1,
                                        message: ErrorMinCaracter.replace("{{0}}", "1")
                                    }

                                }}
                            render={({ field }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.Description })}></label>
                                    <Editor value={field.value} onTextChange={(e) => field.onChange(e.htmlValue)} style={{ height: '700px' }} placeholder={CardFormDescription} />
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Project Select */}
                    <div className='col-12'>
                        <Controller
                            name="Project"
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.Project })}></label>
                                    <span className="p-float-label w-full">
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            options={Projects}
                                            optionLabel="name"
                                            optionValue='id'
                                            showClear
                                            className={classNames({ 'p-invalid': fieldState.error } + " w-full py-1")} />
                                        <label htmlFor={field.name}>{CardFormProject}</label>
                                    </span>

                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Ticket Type Select */}
                    <div className='col-12'>
                        <Controller
                            name="Type"
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.Project })}></label>
                                    <span className="p-float-label w-full">
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            options={TicketType}
                                            optionLabel="name"
                                            optionValue='id'
                                            showClear
                                            className={classNames({ 'p-invalid': fieldState.error } + " w-full py-1")} />
                                        <label htmlFor={field.name}>{CardFormType}</label>
                                    </span>

                                    {ErrorMessageHtml(field.name)}
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