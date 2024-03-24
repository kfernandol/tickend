import React, { useEffect, useRef, useState } from 'react'
import { paths } from '../../routes/paths';
import { classNames } from 'primereact/utils';
import { PrimeIcons } from 'primereact/api';
//Components
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext';
import { Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';

//Hookss
import { useTranslation } from 'react-i18next'
import { useGet, usePost } from '../../services/api_services';
import useMenuForm from '../../hooks/form/useMenuForm';

//Models
import { BasicResponse, ErrorResponse } from '../../models/responses/basic.response';
import { RolFormModel } from '../../models/forms/rol.form';
import { PermissionLevelResponse } from '../../models/responses/permissionLevel.response';
import { MenusResponse } from '../../models/responses/menus.response';
import { Checkbox } from 'primereact/checkbox';
import { Menu } from 'primereact/menu';
import { MenusRequestPost } from '../../models/requests/menus.request';
import { MenuFormModel } from '../../models/forms/menu.form';

export default function NewMenu() {
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    //Form
    const { control, getFormErrorMessage, errors, handleSubmit, reset, getValues, setValue } = useMenuForm();
    const [Menus, setMenus] = useState<MenusResponse[]>([]);
    //Request Hook
    const { SendPostRequest, postResponse, loadingPost, errorPost, httpCodePost } = usePost<BasicResponse>();
    const { SendGetRequest, getResponse, loadingGet, errorGet, httpCodeGet } = useGet<PermissionLevelResponse | MenusResponse>();

    //Translation
    const { t } = useTranslation();
    const CardTitleEdit = t("MenusCardTitleNewMenu");
    const CardSubTitle = t("MenusCardSubTitleNewMenu");
    const ErrorRequired = t('ErrorIsRequired');
    const ErrorMaxCaracter = t('ErrorMaxCaracter');
    const ErrorMinCaracter = t('ErrorMinCaracter');
    const CardButtonSave = t('MenusCardFormButtonSave');
    const CardButtonCancel = t('MenusCardFormButtonCancel');
    const CardFormName = t('MenusCardFormName');
    const CardFormUrl = t('MenusCardFormUrl');
    const CardFormIcon = t('MenusCardFormIcon');
    const CardFormPosition = t('MenusCardFormPosition');
    const CardFormParentId = t('MenusCardFormParentId');
    const CardFormShow = t('MenusCardFormShow');


    //request initial data
    useEffect(() => {
        SendGetRequest("v1/roles/PermissionLevels");
        SendGetRequest("v1/menus");
    }, []);

    //load initial data
    useEffect(() => {
        if (Array.isArray(getResponse)) {

            //Set data menu
            const areAllMenuResponses = getResponse.every(item => Object.prototype.toString.call(item) === '[object Object]' && 'name' in item && 'id' in item && 'parentId' in item && 'show' in item);
            if (areAllMenuResponses) {
                setMenus(getResponse);
            }
        }
    }, [getResponse])

    //Save New Rol
    useEffect(() => {
        if (httpCodePost === 200) {
            const { message } = postResponse as BasicResponse;
            toast?.current?.show({ severity: 'success', summary: CardTitleEdit, detail: message, life: 3000 });
            reset();
            setTimeout(() => navigate(paths.menus), 3000);
        }
        if (errorPost && httpCodePost !== 0) {
            if ('errors' in errorPost) {
                const errorsHtml = Object.entries(errorPost.errors).map(([_field, errors], index) => (
                    errors.map((error, errorIndex) => (
                        <li key={`${index}-${errorIndex}`}>{error}</li>
                    ))
                )).flat();
                toast?.current?.show({ severity: 'error', summary: CardTitleEdit, detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
            } else if ('details' in errorPost) {
                toast?.current?.show({
                    severity: 'error', summary: CardTitleEdit, detail: errorPost.details, life: 3000
                });
            }
        }

    }, [errorPost, httpCodePost, postResponse])

    const onSubmit = async (data: MenuFormModel) => {

        const menuData: MenusRequestPost = {
            name: data.name,
            url: data.url,
            icon: data.icon,
            position: data.position,
            parentId: data.parentId,
            show: data.show
        };

        SendPostRequest("v1/menus/", menuData)
    };

    const onClickIcon = (icon) => {
        setValue("icon", icon)
    }

    return (
        <>
            <Toast ref={toast} />
            <Card title={CardTitleEdit} subTitle={CardSubTitle}>
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
                                        value: 150,
                                        message: ErrorMaxCaracter + 150
                                    },
                                    minLength: {
                                        value: 3,
                                        message: ErrorMinCaracter + 3
                                    }

                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.name })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{CardFormName}</label>
                                    </span>
                                    {getFormErrorMessage(field.name)}
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
                                        value: 150,
                                        message: ErrorMaxCaracter + 150
                                    },
                                    minLength: {
                                        value: 3,
                                        message: ErrorMinCaracter + 3
                                    }

                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.name })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{CardFormUrl}</label>
                                    </span>
                                    {getFormErrorMessage(field.name)}
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
                                    required: ErrorRequired,
                                    maxLength: {
                                        value: 150,
                                        message: ErrorMaxCaracter + 150
                                    },
                                    minLength: {
                                        value: 3,
                                        message: ErrorMinCaracter + 3
                                    }

                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.name })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} type='text' className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{CardFormIcon}</label>
                                    </span>
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>

                    <Card>
                        <div className='grid text-center' style={{ maxHeight: "250px", overflowY: "auto" }}>
                            {Object.entries(PrimeIcons).map(([key, value]) => (
                                <div className='col-3 md:col-1 mb-5'>
                                    <Button onClick={() => onClickIcon(value)} type='button' icon={value} rounded text severity="primary" aria-label="Bookmark" />
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
                                    maxLength: {
                                        value: 150,
                                        message: ErrorMaxCaracter + 150
                                    },
                                    minLength: {
                                        value: 3,
                                        message: ErrorMinCaracter + 3
                                    }

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
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Parent Select */}
                    <div className='col-12 sm: col-6'>
                        <Controller
                            name="parentId"
                            control={control}
                            rules={
                                {
                                    required: ErrorRequired,
                                    maxLength: {
                                        value: 150,
                                        message: ErrorMaxCaracter + 150
                                    },
                                    minLength: {
                                        value: 3,
                                        message: ErrorMinCaracter + 3
                                    }

                                }}
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
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Show Checkbox */}
                    <div className='col-12 sm: col-6'>
                        <Controller
                            name="show"
                            control={control}
                            rules={
                                {
                                    required: ErrorRequired,
                                    maxLength: {
                                        value: 150,
                                        message: ErrorMaxCaracter + 150
                                    },
                                    minLength: {
                                        value: 3,
                                        message: ErrorMinCaracter + 3
                                    }

                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.show })}></label>

                                    <div className="flex align-items-center">
                                        <Checkbox inputId={field.name} checked={field.value} inputRef={field.ref} className={classNames({ 'p-invalid mr-1': fieldState.error })} onChange={(e) => field.onChange(e.checked)} />
                                        <label htmlFor={field.name} className="ml-2">{CardFormShow}</label>
                                    </div>

                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>

                    <div className='col-12'>
                        <div className='flex justify-content-center align-items-center'>
                            <Button label={CardButtonSave} severity="success" className='mr-3' type='submit' loading={loadingPost} />
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