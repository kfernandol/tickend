import React, { useEffect, useRef, useState } from 'react'
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

//Hookss
import { useTranslation } from 'react-i18next'
import { useGet, usePost, usePut } from '../../services/api_services';
import useRolForm from '../../hooks/form/useRolForm';

//Models
import { RolesRequestPost } from '../../models/requests/roles.request';
import { BasicResponse, ErrorResponse } from '../../models/responses/basic.response';
import { RolFormModel } from '../../models/forms/rol.form';
import { PermissionLevelResponse } from '../../models/responses/permissionLevel.response';
import { MenusResponse } from '../../models/responses/menus.response';
import { Checkbox } from 'primereact/checkbox';
import { RolesResponse } from '../../models/responses/roles.response';

export default function EditRol() {
    const { id } = useParams();
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    //Form
    const { control, getFormErrorMessage, errors, handleSubmit, reset, getValues, setValue } = useRolForm();
    const [PermissionLevels, setPermissionLevels] = useState<{ name: string, value: number }[]>([{ name: "", value: 0 }]);
    const [Menus, setMenus] = useState<MenusResponse[]>([]);
    const [SelectedMenus, setSelectedMenus] = useState<MenusResponse[]>([]);
    //Request Hook
    const { SendPutRequest, putResponse, loadingPut, errorPut, httpCodePut } = usePut<BasicResponse>();
    const { SendGetRequest, getResponse, loadingGet, errorGet, httpCodeGet } = useGet<RolesResponse | PermissionLevelResponse | MenusResponse>();

    //Translation
    const { t } = useTranslation();
    const CardTitleEdit = t("RolesCardTitleEditRol");
    const CardSubTitle = t("RolesCardSubTitleEditRol");
    const ErrorRequired = t('ErrorIsRequired');
    const ErrorMaxCaracter = t('ErrorMaxCaracter');
    const ErrorMinCaracter = t('ErrorMinCaracter');
    const CardButtonSave = t('RolesCardTitleEditRol');
    const CardButtonCancel = t('RolesCardFormButtonCancel');
    const RolesCardFormName = t('RolesCardFormName');
    const RolesCardFormPermissionLevel = t("RolesCardFormPermissionLevel");


    //request initial data
    useEffect(() => {
        if (id) {
            SendGetRequest("v1/roles/PermissionLevels");
            SendGetRequest("v1/menus");
            SendGetRequest("v1/roles/" + id)
        }

    }, []);

    //load initial data
    useEffect(() => {
        if (getResponse) {
            const areAllRoleResponse = 'id' in getResponse && 'name' in getResponse && 'permissionLevel' in getResponse && 'menus' in getResponse;
            if (areAllRoleResponse) {
                let response = getResponse as RolesResponse;
                const permissionLevel = PermissionLevels.find(x => x.name == response.permissionLevel);
                const menus = response.menus.map(x => x.id);
                const menusSelected = Menus.filter(menu => menus.some(id => Number(menu.id) === id));
                //Set Name
                setValue("name", response.name);
                //Set Permission Levelz
                if (permissionLevel)
                    setValue("permissionLevel", permissionLevel.value)
                //Set menus
                setSelectedMenus(menusSelected);
            }
            else if (Array.isArray(getResponse)) {
                const areAllPermissionLevelResponses = getResponse.every(item => Object.prototype.toString.call(item) === '[object Object]' && 'name' in item && 'id' in item && !('parentId' in item));
                const areAllMenuResponses = getResponse.every(item => Object.prototype.toString.call(item) === '[object Object]' && 'name' in item && 'id' in item && 'parentId' in item && 'show' in item);

                //Is permission level array
                if (areAllPermissionLevelResponses) {
                    let response = getResponse as PermissionLevelResponse[];

                    const permissionLevel = response.map(x => ({
                        name: x.name,
                        value: x.id
                    }));

                    setPermissionLevels(permissionLevel);
                }

                //Is Menu array
                if (areAllMenuResponses) {
                    let response = getResponse as MenusResponse[];

                    setMenus(response);
                }
            }
        }
    }, [getResponse])

    //Save New Rol
    useEffect(() => {
        if (httpCodePut === 200) {
            const { message } = putResponse as BasicResponse;
            toast?.current?.show({ severity: 'success', summary: CardTitleEdit, detail: message, life: 3000 });
            reset();
            setTimeout(() => navigate(paths.roles), 3000);
        }
        if (errorPut && httpCodePut !== 0) {
            if ('errors' in errorPut) {
                const errorsHtml = Object.entries(errorPut.errors).map(([_field, errors], index) => (
                    errors.map((error, errorIndex) => (
                        <li key={`${index}-${errorIndex}`}>{error}</li>
                    ))
                )).flat();
                toast?.current?.show({ severity: 'error', summary: CardTitleEdit, detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
            } else if ('details' in errorPut) {
                toast?.current?.show({
                    severity: 'error', summary: CardTitleEdit, detail: errorPut.details, life: 3000
                });
            }
        }

    }, [errorPut, httpCodePut, putResponse])

    const onSubmit = async (data: RolFormModel) => {

        const rolData: RolesRequestPost = {
            name: data.name,
            permissionLevel: data.permissionLevel,
            menus: SelectedMenus.map(x => x.id)
        };

        SendPutRequest("v1/roles/" + id, rolData)
    };

    const onMenuChange = (e) => {
        let _selectedMenu = [...SelectedMenus];

        if (e.checked)
            _selectedMenu.push(e.value);
        else
            _selectedMenu = _selectedMenu.filter(menu => menu.id !== e.value.id);

        setSelectedMenus(_selectedMenu);
    };

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
                                        <label htmlFor={field.name}>{RolesCardFormName}</label>
                                    </span>
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>

                    {/* Rol Select */}
                    <div className='col-12'>
                        <Controller
                            name="permissionLevel"
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
                                    <span className="p-float-label w-full">
                                        <Dropdown
                                            id={field.name}
                                            value={field.value}
                                            optionLabel="name"
                                            placeholder={RolesCardFormPermissionLevel}
                                            options={PermissionLevels}
                                            focusInputRef={field.ref}
                                            onChange={(e) => field.onChange(e.value)}
                                            className={classNames({ 'p-invalid': fieldState.error }) + " w-full py-1"}
                                        />
                                        <label htmlFor={field.name}>{RolesCardFormPermissionLevel}</label>
                                        {getFormErrorMessage(field.name)}
                                    </span>
                                </>

                            )}
                        />
                    </div>

                    {/* menus checkbox */}

                    <div className='col-12 grid'>
                        {Menus.filter(x => x.parentId === null).map((value: MenusResponse, index: number) => (
                            <div className='col-2 px-4' key={`parent-${value.id}`}>
                                <div className='flex flex-column gap-3 h-full'>
                                    <Card title={value.name} className='text-center h-full' >
                                        {Menus.filter(x => x.parentId === value.id).map((childValue: MenusResponse, childIndex: number) => (
                                            <div key={`child-${childValue.id}`} className="flex align-items-center pb-2 px-3">
                                                <Checkbox
                                                    inputId={`${childValue.name}-${childValue.id}`}
                                                    name={childValue.name}
                                                    value={childValue}
                                                    onChange={onMenuChange}
                                                    checked={SelectedMenus.some((item) => item.id === childValue.id)}
                                                />
                                                <label htmlFor={childValue.name} className="ml-2">{childValue.name}</label>
                                            </div>
                                        ))}
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='col-12'>
                        <div className='flex justify-content-center align-items-center'>
                            <Button label={CardButtonSave} severity="success" className='mr-3' type='submit' loading={loadingPut} />
                            <Link to={paths.roles}>
                                <Button label={CardButtonCancel} severity="secondary" type='button' />
                            </Link>
                        </div>
                    </div>

                </form>
            </Card>
        </>
    )
}

