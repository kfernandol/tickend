/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
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
//Hooks
import { useTranslation } from 'react-i18next'
import { useGet, usePut } from '../../services/api_services';
import useCustomForm from '../../hooks/useCustomForm';
//Models
import { BasicResponse } from '../../models/responses/basic.response';
import { PermissionLevelResponse } from '../../models/responses/permissionLevel.response';
import { MenusResponse } from '../../models/responses/menus.response';
import { MenusRequestPost } from '../../models/requests/menus.request';
import { MenuFormModel } from '../../models/forms/menu.form';

export default function MenuEdit() {
    const { id } = useParams();
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    //Form
    const { control, ErrorMessageHtml, errors, handleSubmit, reset, setValue } = useCustomForm<MenuFormModel>(
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
    const { SendGetRequest, getResponse } = useGet<PermissionLevelResponse | MenusResponse>();

    //Translation
    const { t } = useTranslation();
    const CardTitle = t("common.cardTitles.edit", { 0: t("navigation.Menus") });
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
        SendGetRequest("v1/menus");
        SendGetRequest("v1/menus/" + id)
    }, []);

    //load initial data
    useEffect(() => {
        if (getResponse && !Array.isArray(getResponse)) {
            //Set form data
            const response = getResponse as MenusResponse;
            const areAllMenuResponses = 'name' in response && 'id' in response && 'parentId' in response && 'show' in response;
            if (areAllMenuResponses) {
                setValue("name", response.name);
                setValue("url", response.url);
                setValue("icon", response.icon);
                setValue("position", response.position);
                setValue("parentId", response.parentId);
                setValue("show", response.show);

            }
        }
        else if (getResponse && Array.isArray(getResponse)) {
            const response = getResponse as MenusResponse[];
            //Set data menu
            const areAllMenusResponses = response.every(item => Object.prototype.toString.call(item) === '[object Object]' && 'name' in item && 'id' in item && 'parentId' in item && 'show' in item);
            if (areAllMenusResponses) {
                setMenus(response);
            }
        }
    }, [getResponse])

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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    const onClickIcon = (icon) => {
        setValue("icon", icon)
    }

    return (
        <>
            <Toast ref={toast} />
            <Card title={CardTitle} subTitle={CardSubTitle}>
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.name })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{CardFormName}</label>
                                    </span>
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.name })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{CardFormUrl}</label>
                                    </span>
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.name })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{CardFormIcon}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
                                </>
                            )}
                        />
                    </div>

                    <Card className='w-full'>
                        <div className='grid text-center' style={{ maxHeight: "250px", overflowY: "auto" }}>
                            {Object.entries(PrimeIcons).filter(([key]) => key.toLowerCase().includes(FilterIcon.toLowerCase())).map(([key, value]) => (
                                <div key={`${key}-${value}`} className='col-3 md:col-1 mb-5'>
                                    <Button onClick={() => onClickIcon(value)} type='button' icon={value} rounded text severity='info' aria-label="Bookmark" />
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.name })}></label>
                                    <span className="p-float-label">
                                        <InputNumber
                                            id={field.name}
                                            inputRef={field.ref}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onValueChange={(e) => field.onChange(e)}
                                            useGrouping={false}
                                            className='w-full'
                                            inputClassName={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} />
                                        <label htmlFor={field.name}>{CardFormPosition}</label>
                                    </span>
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.name })}></label>
                                    <span className="p-float-label w-full">
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            options={Menus.filter(x => x.parentId === null)}
                                            optionLabel="name"
                                            optionValue='id'
                                            showClear
                                            className={classNames({ 'p-invalid': fieldState.error } + " w-full py-1")} />
                                        <label htmlFor={field.name}>{CardFormParentId}</label>
                                    </span>
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
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.show })}></label>

                                    <div className="flex align-items-center">
                                        <Checkbox inputId={field.name} checked={field.value} className={classNames({ 'p-invalid mr-1': fieldState.error })} onChange={(e) => field.onChange(e.checked)} />
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