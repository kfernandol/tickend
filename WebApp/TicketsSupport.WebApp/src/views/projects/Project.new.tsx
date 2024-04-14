/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { paths } from '../../routes/paths';
import { classNames } from 'primereact/utils';
//Components
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext';
import { Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import AvatarEditor from '../../components/avatarEditor/avatarEditor';
import { MultiSelect } from 'primereact/multiselect';
//Hooks
import { useTranslation } from 'react-i18next'
import { useGet, usePost } from '../../services/api_services';
import useCustomForm from '../../hooks/useCustomForm';
//Models
import { BasicResponse } from '../../models/responses/basic.response';
import { ProjectForm } from '../../models/forms/project.form';
import { TicketPriorityResponse } from '../../models/responses/ticketPriority.response';
import { TicketStatusResponse } from '../../models/responses/ticketStatus.response';
import { TicketTypeResponse } from '../../models/responses/ticketType.response';
import { UserResponse } from '../../models/responses/users.response';
import { InputTextarea } from 'primereact/inputtextarea';

export default function ProjectNew() {
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    //Form
    const { control, ErrorMessageHtml, errors, handleSubmit, reset, getValues, setValue } = useCustomForm<ProjectForm>(
        {
            photo: undefined,
            name: "",
            description: "",
            clients: [],
            developers: [],
            ticketPriorities: [],
            ticketStatus: [],
            ticketTypes: []
        }
    );
    //Api Request
    const { SendPostRequest, postResponse, errorPost, httpCodePost, loadingPost } = usePost<BasicResponse>();
    const { SendGetRequest } = useGet<TicketPriorityResponse[] | TicketStatusResponse[] | TicketTypeResponse[] | UserResponse[]>()
    const [Priorities, setPriorities] = useState<{ name: string, value: number, color: string }[]>([{ name: "", value: 0, color: "" }]);
    const [Statuses, setStatuses] = useState<{ name: string, value: number, color: string }[]>([{ name: "", value: 0, color: "" }]);
    const [Types, setTypes] = useState<{ name: string, value: number, color: string }[]>([{ name: "", value: 0, color: "" }]);
    const [Developers, setDevelopers] = useState<{ name: string, value: number }[]>([{ name: "", value: 0 }]);
    const [Clients, setClients] = useState<{ name: string, value: number }[]>([{ name: "", value: 0 }]);

    //Translations
    const { t } = useTranslation();
    const CardTitle = t("common.cardTitles.new", { 0: t("navigation.Projects") });
    const CardSubTitle = t("common.cardSubTitles.new", { 0: t("navigation.Projects") });
    const ErrorRequired = t('errors.required');
    const ErrorMaxCaracter = t('errors.maxLength');
    const ErrorMinCaracter = t('errors.minLength');
    const CardButtonSave = t('buttons.save');
    const CardButtonCancel = t('buttons.cancel');
    const LabelName = t("common.labels.name");
    const LabelDescription = t("projects.labels.description");
    const SelectPriorities = t("projects.labels.selectPriorities");
    const SelectTypes = t("projects.labels.SelectTypes");
    const SelectStatus = t("projects.labels.selectStatus");
    const SelectClients = t("projects.labels.selectClients");
    const SelectDeveloper = t("projects.labels.selectDeveloper");

    //Links
    const returnToTable = paths.Projects;

    const onSubmit = async (data: ProjectForm) => {

        const formData = new FormData();

        formData.append('Photo', getValues('photo'));
        formData.append('name', getValues("name"));
        formData.append('description', getValues("description"));
        formData.append('ticketStatusJson', JSON.stringify(getValues("ticketStatus")));
        formData.append('ticketPrioritiesJson', JSON.stringify(getValues("ticketPriorities")));
        formData.append('ticketTypesJson', JSON.stringify(getValues("ticketTypes")));
        formData.append('ClientsJson', JSON.stringify(getValues("clients")));
        formData.append('DevelopersJson', JSON.stringify(getValues("developers")));

        SendPostRequest("v1/projects/", formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    };

    //request initial data
    useEffect(() => {
        const requests = [
            SendGetRequest("v1/ticket/status"),
            SendGetRequest("v1/ticket/types"),
            SendGetRequest("v1/ticket/priorities"),
            SendGetRequest("v1/users"),
        ];

        Promise.all(requests)
            .then((responses) => {
                responses.forEach((response) => {
                    if (response.url === "v1/ticket/priorities") {
                        const resp = response.data as TicketPriorityResponse[];

                        const PrioritiesResponses = resp.map(x => ({
                            name: x.name,
                            value: x.id,
                            color: x.color,
                        }));

                        setPriorities(PrioritiesResponses);
                    }
                    else if (response.url === "v1/ticket/types") {
                        const resp = response.data as TicketTypeResponse[];
                        const TypesResponse = resp.map(x => ({
                            name: x.name,
                            value: x.id,
                            color: x.iconColor
                        }));

                        setTypes(TypesResponse);
                    }
                    else if (response.url === "v1/ticket/status") {
                        const resp = response.data as TicketStatusResponse[];
                        const TicketStatusResponses = resp.map(x => ({
                            name: x.name,
                            value: x.id,
                            color: x.color
                        }));

                        setStatuses(TicketStatusResponses);
                    }
                    else if (response.url === "v1/users") {
                        const resp = response.data as UserResponse[];

                        const clients = resp.filter(x => x.levelPermission === "User").map(x => ({
                            name: `${x.firstName} ${x.lastName}`,
                            value: x.id
                        }));
                        setClients(clients);

                        const developers = resp.filter(x => x.levelPermission === "Developer").map(x => ({
                            name: `${x.firstName} ${x.lastName}`,
                            value: x.id
                        }));
                        setDevelopers(developers);
                    }

                });
            })
            .catch((error) => {
                console.error("Error en las solicitudes:", error);
            });

    }, []);

    //Save New Project
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


    const MultiSelectedItem = (e: number, data: any) => {
        const item = data.find(x => x.value == e);
        return (
            <span style={{ color: `${item?.color}` }}>{item?.name}, </span>
        );
    };

    return (
        <>
            <Toast ref={toast} />
            <Card title={CardTitle} subTitle={CardSubTitle}>
                <form className='mt-5 grid gap-2"' onSubmit={handleSubmit(onSubmit)}>
                    {/* Photo */}
                    <div className='col-12 flex justify-content-center align-item-center mb-5'>
                        <AvatarEditor onChangeAvatar={(file) => setValue("photo", file)} />
                    </div>
                    {/* Name Input */}
                    <div className='col-12'>
                        <Controller
                            name="name"
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.name })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{LabelName}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* LastName Input */}
                    <div className='col-12'>
                        <Controller
                            name="description"
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.description })}></label>
                                    <span className="p-float-label">
                                        <InputTextarea autoResize id={field.name} {...field} rows={4} cols={30} className={classNames({ 'p-invalid': fieldState.error }) + " w-full"} />
                                        <label htmlFor="username">{LabelDescription}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Ticket Priorities */}
                    <div className='col-12'>
                        <Controller
                            name="ticketPriorities"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-float-label w-full">
                                        <MultiSelect id={field.name} name="value" selectedItemTemplate={(e) => MultiSelectedItem(e, Priorities)} className='w-full py-1' value={field.value} filter options={Priorities} onChange={(e) => field.onChange(e.value)} optionLabel="name" placeholder={SelectPriorities} maxSelectedLabels={10} />
                                        <label htmlFor={field.name} >{SelectPriorities}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Ticket Status */}
                    <div className='col-12'>
                        <Controller
                            name="ticketStatus"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-float-label w-full">
                                        <MultiSelect
                                            id={field.name}
                                            name="value"
                                            selectedItemTemplate={(e) => MultiSelectedItem(e, Statuses)}
                                            className='w-full py-1'
                                            value={field.value}
                                            filter
                                            options={Statuses}
                                            onChange={(e) => field.onChange(e.value)}
                                            optionLabel="name"
                                            placeholder={SelectStatus}
                                            maxSelectedLabels={10} />
                                        <label htmlFor={field.name} >{SelectStatus}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Ticket Types */}
                    <div className='col-12'>
                        <Controller
                            name="ticketTypes"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-float-label w-full">
                                        <MultiSelect
                                            id={field.name}
                                            name="value"
                                            selectedItemTemplate={(e) => MultiSelectedItem(e, Types)}
                                            className='w-full py-1'
                                            value={field.value}
                                            filter
                                            options={Types}
                                            onChange={(e) => field.onChange(e.value)}
                                            optionLabel="name"
                                            placeholder={SelectTypes}
                                            maxSelectedLabels={10} />
                                        <label htmlFor={field.name} >{SelectTypes}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Clients */}
                    <div className='col-12'>
                        <Controller
                            name="clients"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-float-label w-full">
                                        <MultiSelect
                                            id={field.name}
                                            name="value"
                                            selectedItemTemplate={(e) => MultiSelectedItem(e, Clients)}
                                            className='w-full py-1'
                                            value={field.value}
                                            filter
                                            options={Clients}
                                            onChange={(e) => field.onChange(e.value)}
                                            optionLabel="name"
                                            placeholder={SelectClients}
                                            maxSelectedLabels={10} />
                                        <label htmlFor={field.name} >{SelectClients}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Developer */}
                    <div className='col-12'>
                        <Controller
                            name="developers"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-float-label w-full">
                                        <MultiSelect
                                            id={field.name}
                                            name="value"
                                            selectedItemTemplate={(e) => MultiSelectedItem(e, Developers)}
                                            className='w-full py-1'
                                            value={field.value}
                                            filter
                                            options={Developers}
                                            onChange={(e) => field.onChange(e.value)}
                                            optionLabel="name"
                                            placeholder={SelectDeveloper}
                                            maxSelectedLabels={10} />
                                        <label htmlFor={field.name} >{SelectDeveloper}</label>
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