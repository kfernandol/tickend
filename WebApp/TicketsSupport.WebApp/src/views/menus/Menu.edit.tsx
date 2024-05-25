import { useEffect, useRef, useState } from 'react'
import { paths } from '../../routes/paths';
import { classNames } from 'primereact/utils';
import { PrimeIcons } from 'primereact/api';
//Components
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext';
import { Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { SelectItemOptionsType } from 'primereact/selectitem';
//Hooks
import { useTranslation } from 'react-i18next'
import { useGet, usePut } from '../../services/api_services';
import useCustomForm from '../../hooks/useCustomForm';
//Models
import { BasicResponse, ErrorResponse, ErrorsResponse } from '../../models/responses/basic.response';
import { PermissionLevelResponse } from '../../models/responses/permissionLevel.response';
import { MenusResponse } from '../../models/responses/menus.response';
import { MenusRequestPost } from '../../models/requests/menus.request';
import { MenuFormModel } from '../../models/forms/menu.form';

export default function MenuEdit() {
    const { id } = useParams();
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    const MenusNames: SelectItemOptionsType =
        [
            { label: 'Security', value: 'Security' },
            { label: 'Users', value: 'Users' },
            { label: 'Roles', value: 'Roles' },
            { label: 'Menus', value: 'Menus' },
            { label: 'ProjectsP', value: 'ProjectsP' },
            { label: 'Projects', value: 'Projects' },
            { label: 'TicketsP', value: 'TicketsP' },
            { label: 'Tickets', value: 'Tickets' },
            { label: 'TicketTypes', value: 'TicketTypes' },
            { label: 'TicketStatus', value: 'TicketStatus' },
            { label: 'TicketPriority', value: 'TicketPriority' },
        ]

    //Form
    const { control, ErrorMessageHtml, handleSubmit, reset, setValue } = useCustomForm<MenuFormModel>(
        {
            name: "",
            icon: "",
            parentId: 0,
            position: 0,
            show: true,
            url: ""
        }
    );
    const [Menus, setMenus] = useState<MenusResponse[]>([]);
    const [FilterIcon, setFilterIcon] = useState<string>('');
    //Request Hook
    const { SendPutRequest, putResponse, loadingPut, errorPut, httpCodePut } = usePut<BasicResponse>();
    const { SendGetRequest } = useGet<PermissionLevelResponse | MenusResponse>();

    //Translation
    const { t } = useTranslation();
    const CardTitle = t("common.cardTitles.edit", { 0: t("element.menu") });
    const CardSubTitle = t("common.cardSubTitles.edit");
    const ErrorRequired = t('errors.required');
    const ErrorMaxCaracter = t('errors.maxLength');
    const ErrorMinCaracter = t('errors.minLength');
    const CardButtonSave = t('buttons.save');
    const CardButtonCancel = t('buttons.cancel');
    const CardFormName = t('common.labels.name');
    const CardFormUrl = t('menus.labels.url');
    const CardFormIcon = t('menus.labels.icon');
    const CardFormPosition = t('menus.labels.position');
    const CardFormParentId = t('menus.labels.parentId');
    const CardFormShow = t('menus.labels.show');

    //Links
    const returnToTable = paths.menus;

    //request initial data
    useEffect(() => {
        const requests = [
            SendGetRequest("v1/menus"),
            SendGetRequest("v1/menus/" + id)
        ];

        requests.forEach((request) => {
            request.then((response) => {
                switch (response.url) {
                    case "v1/menus":
                        setMenus(response.data as MenusResponse[]);
                        break;
                    case "v1/menus/" + id:
                        setValue("name", (response.data as MenusResponse).name);
                        setValue("url", (response.data as MenusResponse).url);
                        setValue("icon", (response.data as MenusResponse).icon);
                        setValue("position", (response.data as MenusResponse).position);
                        setValue("parentId", (response.data as MenusResponse).parentId);
                        setValue("show", (response.data as MenusResponse).show);
                        break;
                }
            })
        })
    }, []);

    //Save Edit menu
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
            setTimeout(() => navigate(returnToTable), 3000);
        }

    }, [errorPut, httpCodePut, putResponse])

    const onSubmit = async (data: MenuFormModel) => {

        const menuData: MenusRequestPost = {
            name: data.name,
            url: data.url,
            icon: data.icon,
            position: data.position,
            parentId: data.parentId,
            show: data.show
        };

        SendPutRequest("v1/menus/" + id, menuData)
    };

    const onClickIcon = (icon: string) => {
        setValue("icon", icon)
    }

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
                            render={({ field }) => (
                                <>
                                    <label className="align-self-start block mb-1">{CardFormName}</label>
                                    <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.target.value)} options={MenusNames} optionLabel="label" className="w-full py-1" />
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Url Input */}
                    <div className='col-12 sm: col-6'>
                        <Controller
                            name="url"
                            control={control}
                            rules={
                                {
                                    required: ErrorRequired,
                                    maxLength: {
                                        value: 300,
                                        message: ErrorMaxCaracter.replace("{{0}}", "300")
                                    },
                                    minLength: {
                                        value: 1,
                                        message: ErrorMinCaracter.replace("{{0}}", "1")
                                    }

                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label className="align-self-start block mb-1">{CardFormUrl}</label>
                                    <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} readOnly />
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Icon Input */}
                    <div className='col-12 sm: col-6'>
                        <Controller
                            name="icon"
                            control={control}
                            rules={
                                {
                                    maxLength: {
                                        value: 300,
                                        message: ErrorMaxCaracter.replace("{{0}}", "300")
                                    },
                                    minLength: {
                                        value: 3,
                                        message: ErrorMinCaracter.replace("{{0}}", "3")
                                    }

                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label className="align-self-start block mb-1">{CardFormIcon}</label>
                                    <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => { field.onChange(e.target.value); setFilterIcon(e.target.value) }} />
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

                    {/* Position Input */}
                    <div className='col-12 sm: col-6'>
                        <Controller
                            name="position"
                            control={control}
                            rules={
                                {
                                    required: ErrorRequired,
                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label className="align-self-start block mb-1">{CardFormPosition}</label>
                                    <InputNumber
                                        id={field.name}
                                        inputRef={field.ref}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onValueChange={(e) => field.onChange(e)}
                                        useGrouping={false}
                                        className='w-full'
                                        inputClassName={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} />
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Parent Select */}
                    <div className='col-12 sm: col-6'>
                        <Controller
                            name="parentId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label className="align-self-start block mb-1">{CardFormParentId}</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                        options={Menus.filter(x => x.parentId === null)}
                                        optionLabel="name"
                                        optionValue='id'
                                        showClear
                                        className={classNames({ 'p-invalid': fieldState.error } + " w-full py-1")} />
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Show Checkbox */}
                    <div className='col-12 sm: col-6'>
                        <Controller
                            name="show"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <div className="flex align-items-center">
                                        <Checkbox inputId={field.name} checked={field.value} inputRef={field.ref} className={classNames({ 'p-invalid mr-1': fieldState.error })} onChange={(e) => field.onChange(e.checked)} />
                                        <label htmlFor={field.name} className="ml-2">{CardFormShow}</label>
                                    </div>

                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    <div className='col-12'>
                        <div className='flex justify-content-center align-items-center'>
                            <Button label={CardButtonSave} severity="success" className='mr-3' type='submit' loading={loadingPut} />
                            <Link to={paths.menus}>
                                <Button label={CardButtonCancel} severity="secondary" type='button' />
                            </Link>
                        </div>
                    </div>

                </form>
            </Card>
        </>
    )
}