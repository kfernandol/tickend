import { useEffect, useRef, useState } from 'react'
import { paths } from '../../routes/paths';
import { classNames } from 'primereact/utils';
//Components
import { Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Editor } from 'primereact/editor';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
//Hooks
import { useTranslation } from 'react-i18next'
import { useGet, usePut } from '../../services/api_services';
import useCustomForm from '../../hooks/useCustomForm';
import { useSelector } from 'react-redux';
import useTokenData from '../../hooks/useTokenData';
//Models
import { BasicResponse } from '../../models/responses/basic.response';
import { TicketForm } from '../../models/forms/ticket.form';
import { ProjectResponse } from '../../models/responses/project.response';
import { TicketTypeResponse } from '../../models/responses/ticketType.response';
import { TicketRequest } from '../../models/requests/ticket.request';
import { TicketResponse } from '../../models/responses/ticket.response';
import { TicketPriorityResponse } from '../../models/responses/ticketPriority.response';
import { TicketStatusResponse } from '../../models/responses/ticketStatus.response';
import { RootState } from '../../redux/store';
import { AuthToken } from '../../models/tokens/token.model';

export default function TicketsEdit() {
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    const { id } = useParams();
    //Redux
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);
    //Form
    const { control, ErrorMessageHtml, errors, handleSubmit, reset, setValue, getValues, watch } = useCustomForm<TicketForm>({ Title: '', Description: '', Priority: null, Project: null, Status: null, Type: null, });
    //Request API
    const { SendPutRequest, putResponse, loadingPut, errorPut, httpCodePut } = usePut<BasicResponse>();
    const { SendGetRequest } = useGet<ProjectResponse>();
    const [Ticket, setTicket] = useState<TicketResponse>();
    const [Projects, setProjects] = useState<ProjectResponse[]>();
    const [TicketType, setTicketType] = useState<TicketTypeResponse[]>();
    const [TicketPriorities, setTicketPriorities] = useState<TicketPriorityResponse[]>();
    const [TicketStatus, setTicketStatus] = useState<TicketStatusResponse[]>();
    //Translation
    const { t } = useTranslation();
    const CardTitle = t("common.cardTitles.new", { 0: t("navigation.Ticket") });
    const ErrorRequired = t('errors.required');
    const ErrorMinCaracter = t('errors.minLength');
    const CardButtonUpdated = t('buttons.updated');
    const CardFormDescription = t("tickets.labels.description");
    const CardFormProject = t("tickets.labels.project");
    const CardFormType = t("tickets.labels.type");
    const CardFormPriority = t("tickets.labels.priority");
    const CardFormStatus = t("tickets.labels.status");
    const CardFormClosed = t("tickets.labels.closed");
    const CardLabelProperties = t("tickets.labels.properties");

    //Links
    const returnToTable = paths.Tickets;

    //Request Data
    useEffect(() => {
        const requests = [
            SendGetRequest('v1/projects'),
            SendGetRequest('v1/tickets/' + id)
        ]
        Promise.all(requests)
            .then((responses) => {
                responses.forEach((response) => {
                    switch (response.url) {
                        case "v1/projects":
                            setProjects(response.data as ProjectResponse[]);
                            break;
                        case "v1/tickets/" + id:
                            setTicket(response.data as TicketResponse);
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
        if (ProjectId) {
            const requests = [
                SendGetRequest('v1/ticket/types/byproject/' + ProjectId),
                SendGetRequest('v1/ticket/status/byproject/' + ProjectId),
                SendGetRequest('v1/ticket/priorities/byproject/' + ProjectId)
            ]
            Promise.all(requests)
                .then((responses) => {
                    responses.forEach((response) => {
                        switch (response.url) {
                            case "v1/ticket/types/byproject/" + ProjectId:
                                setTicketType(response.data as TicketTypeResponse[]);
                                break;
                            case 'v1/ticket/status/byproject/' + ProjectId:
                                setTicketStatus(response.data as TicketStatusResponse[]);
                                break;
                            case 'v1/ticket/priorities/byproject/' + ProjectId:
                                setTicketPriorities(response.data as TicketPriorityResponse[]);
                                break;
                            default:
                                break;
                        }
                    });
                })
                .catch((error) => {
                    console.error("Error en las solicitudes:", error);
                });
        }
    }, [watch("Project")])
    useEffect(() => {
        if (Ticket) {
            setValue("Description", Ticket.description);
            setValue("Project", Ticket.projectId);
            setValue("Type", Ticket.ticketTypeId);
            setValue("Status", Ticket.ticketStatusId);
            setValue("Priority", Ticket.ticketPriorityId);
            setValue("Closed", Ticket.isClosed)
        }
    }, [Ticket])

    //Update Ticket Toast
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

    //Submit Form
    const onSubmit = async (data: TicketForm) => {
        const TicketRequest: TicketRequest = {
            title: data.Title,
            description: data.Description,
            projectId: data.Project as number,
            ticketTypeId: data.Type as number,
            ticketPriorityId: data.Priority as number,
            ticketStatusId: data.Status as number,
            isClosed: data.Closed
        };

        SendPutRequest("v1/tickets/" + id, TicketRequest)
    };

    const renderEditorHeaderEmpty = () => { return (<></>); };

    const headerEmpty = renderEditorHeaderEmpty();

    return (
        <>
            <Toast ref={toast} />
            <form className='mt-5 grid gap-2"' onSubmit={handleSubmit(onSubmit)}>

                <div className='col-9'>
                    <div className='grid'>
                        {/* Title Input */}
                        <div className='col-12'>
                            <h1 className='my-0 font-semibold text-2xl'>{Ticket?.title}</h1>
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
                                        <Editor
                                            value={field.value}
                                            onTextChange={(e) => field.onChange(e.htmlValue)}
                                            style={{ height: '600px' }}
                                            placeholder={CardFormDescription}
                                            readOnly
                                            headerTemplate={headerEmpty} />
                                        {ErrorMessageHtml(field.name)}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className='col-3'>

                    <div className='sticky top-0'>

                        <div className='grid'>
                            {/* Title Properties */}
                            <div className='col-12 mb-4'>
                                <h1 className='my-0 font-semibold text-lg'>{CardLabelProperties}</h1>
                            </div>
                            {/* Project Select */}
                            <div className='col-12'>
                                <Controller
                                    name="Project"
                                    control={control}
                                    rules={
                                        {
                                            required: ErrorRequired
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
                                                    disabled
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
                                            required: ErrorRequired
                                        }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.Type })}></label>
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

                            {/* Ticket Priority Select */}
                            {getTokenData?.PermissionLevel === "Administrator" ? 
                            <div className='col-12'>
                                <Controller
                                    name="Priority"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.Priority })}></label>
                                            <span className="p-float-label w-full">
                                                <Dropdown
                                                    id={field.name}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    options={TicketPriorities}
                                                    optionLabel="name"
                                                    optionValue='id'
                                                    showClear
                                                    className={classNames({ 'p-invalid': fieldState.error } + " w-full py-1")} />
                                                <label htmlFor={field.name}>{CardFormPriority}</label>
                                            </span>

                                            {ErrorMessageHtml(field.name)}
                                        </>
                                    )}
                                />
                                </div>
                                :
                                null
                            }

                            {/* Ticket Status Select */}
                            {getTokenData?.PermissionLevel === "Administrator" || getTokenData?.PermissionLevel === "Developer" ? 
                            <div className='col-12'>
                                <Controller
                                    name="Status"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.Status })}></label>
                                            <span className="p-float-label w-full">
                                                <Dropdown
                                                    id={field.name}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    options={TicketStatus}
                                                    optionLabel="name"
                                                    optionValue='id'
                                                    showClear
                                                    className={classNames({ 'p-invalid': fieldState.error } + " w-full py-1")} />
                                                <label htmlFor={field.name}>{CardFormStatus}</label>
                                            </span>

                                            {ErrorMessageHtml(field.name)}
                                        </>
                                    )}
                                />
                            </div>
                            :
                            null
                            }

                            {/* Ticket Closed */}
                            {getTokenData?.PermissionLevel === "Administrator" || getTokenData?.PermissionLevel === "Developer" ?
                                <div className='col-12'>
                                    <Controller
                                        name="Closed"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <div className='flex align-items-center'>
                                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.Closed })}></label>
                                                    <label className='mr-2' htmlFor={field.name}>{CardFormClosed}</label>
                                                    <InputSwitch checked={field.value} onChange={(e) => field.onChange(e.value)} />

                                                    {ErrorMessageHtml(field.name)}
                                                </div>
                                            </>
                                        )}
                                    />
                                </div>
                                :
                                null
                            }

                            <div className='col-12'>
                                <div className='flex justify-content-center align-items-center'>
                                    <Button label={CardButtonUpdated} severity="success" className='mr-3' type='submit' loading={loadingPut} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </form>
        </>
    )
}