import { useEffect, useRef, useState } from 'react'
import { paths } from '../../routes/paths';
import { classNames } from 'primereact/utils';
//Components
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext';
import { Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';

//Hookss
import { useTranslation } from 'react-i18next'
import { useGet, usePost } from '../../services/api_services';
import useCustomForm from '../../hooks/useCustomForm';

//Models
import { RolesRequestPost } from '../../models/requests/roles.request';
import { BasicResponse } from '../../models/responses/basic.response';
import { RolFormModel } from '../../models/forms/rol.form';
import { PermissionLevelResponse } from '../../models/responses/permissionLevel.response';
import { MenusResponse } from '../../models/responses/menus.response';

export default function RolNew() {
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    //Form
    const { control, ErrorMessageHtml, errors, handleSubmit, reset } = useCustomForm<RolFormModel>({ name: "", permissionLevel: 0, menus: [] });
    const [PermissionLevels, setPermissionLevels] = useState<{ name: string, value: number }[]>([{ name: "", value: 0 }]);
    const [Menus, setMenus] = useState<MenusResponse[]>([]);
    const [SelectedMenus, setSelectedMenus] = useState<MenusResponse[]>([]);
    //Request Hook
    const { SendPostRequest, postResponse, loadingPost, errorPost, httpCodePost } = usePost<BasicResponse>();
    const { SendGetRequest, getResponse } = useGet<PermissionLevelResponse | MenusResponse>();

    //Translation
    const { t } = useTranslation();
    const CardTitle = t("common.cardTitles.new", { 0: t("navigation.Roles") });
    const CardSubTitle = t("common.cardSubTitles.new", { 0: t("navigation.Roles") });
    const ErrorRequired = t('errors.required');
    const ErrorMaxCaracter = t('errors.maxLength');
    const ErrorMinCaracter = t('errors.minLength');
    const CardButtonSave = t('buttons.save');
    const CardButtonCancel = t('buttons.cancel');
    const RolesCardFormName = t('common.labels.name');
    const RolesCardFormPermissionLevel = t("roles.labels.permissionLevel");

    //Links
    const returnToTable = paths.roles;

    //request initial data
    useEffect(() => {
        SendGetRequest("v1/roles/PermissionLevels");
        SendGetRequest("v1/menus");
    }, []);

    //load initial data
    useEffect(() => {
        if (Array.isArray(getResponse)) {
            const areAllPermissionLevelResponses = getResponse.every(item => Object.prototype.toString.call(item) === '[object Object]' && 'name' in item && 'id' in item && !('parentId' in item));
            const areAllMenuResponses = getResponse.every(item => Object.prototype.toString.call(item) === '[object Object]' && 'name' in item && 'id' in item && 'parentId' in item && 'show' in item);
            //Is permission level response
            if (areAllPermissionLevelResponses) {
                const permissionLevel = getResponse.map(x => ({
                    name: x.name,
                    value: x.id
                }));
                setPermissionLevels(permissionLevel);
            }

            //Is Menu response
            if (areAllMenuResponses) {
                setMenus(getResponse);
            }
        }
    }, [getResponse])

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

    const onSubmit = async (data: RolFormModel) => {

        const rolData: RolesRequestPost = {
            name: data.name,
            permissionLevel: data.permissionLevel,
            menus: SelectedMenus.map(x => x.id)
        };

        SendPostRequest("v1/roles/", rolData)
    };

    const onMenuChange = (e: CheckboxChangeEvent) => {
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
                                        <label htmlFor={field.name}>{RolesCardFormName}</label>
                                    </span>
                                    {ErrorMessageHtml(field.name)}
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
                                        {ErrorMessageHtml(field.name)}
                                    </span>
                                </>

                            )}
                        />
                    </div>

                    {/* menus checkbox */}

                    <div className='col-12 grid'>
                        {Menus.filter(x => x.parentId === null).map((value: MenusResponse) => (
                            <div className='col-2 px-4' key={`parent-${value.id}`}>
                                <div className='flex flex-column gap-3 h-full'>
                                    <Card title={value.name} className='text-center h-full' pt={{
                                        body: { className: "px-2" }
                                    }} >
                                        {Menus.filter(x => x.parentId === value.id).map((childValue: MenusResponse) => (
                                            <div key={`child-${childValue.id}`} className="flex align-items-center pb-2 px-0">
                                                <Checkbox
                                                    inputId={`${childValue.name}-${childValue.id}`}
                                                    name={childValue.name}
                                                    value={childValue}
                                                    onChange={onMenuChange}
                                                    checked={SelectedMenus.some((item) => item.id === childValue.id)}
                                                />
                                                <label htmlFor={childValue.name} className="ml-2">{t("navigation." + childValue.name)}</label>
                                            </div>
                                        ))}
                                    </Card>
                                </div>
                            </div>
                        ))}
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