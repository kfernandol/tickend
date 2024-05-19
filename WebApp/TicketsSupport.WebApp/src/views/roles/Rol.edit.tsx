import { useEffect, useRef, useState } from 'react'
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
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
//Hooks
import { useTranslation } from 'react-i18next'
import { useGet, usePut } from '../../services/api_services';
import useCustomForm from '../../hooks/useCustomForm';
//Models
import { BasicResponse } from '../../models/responses/basic.response';
import { RolFormModel } from '../../models/forms/rol.form';
import { PermissionLevelResponse } from '../../models/responses/permissionLevel.response';
import { MenusResponse } from '../../models/responses/menus.response';
import { RolesResponse } from '../../models/responses/roles.response';
import { RolesRequest } from '../../models/requests/roles.request';

export default function RolEdit() {
    const { id } = useParams();
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    //Form
    const { control, ErrorMessageHtml, handleSubmit, reset, setValue } = useCustomForm<RolFormModel>({ name: "", permissionLevel: 0, menus: [] }
    );
    const [PermissionLevels, setPermissionLevels] = useState<PermissionLevelResponse[]>();
    const [Menus, setMenus] = useState<MenusResponse[]>([]);
    const [Role, setRole] = useState<RolesResponse>();
    const [SelectedMenus, setSelectedMenus] = useState<MenusResponse[]>([]);
    const [MenusTranslation, setMenusTranslation] = useState<{ name: string, value: string }[]>([]);
    //Request Hook
    const { SendPutRequest, putResponse, loadingPut, errorPut, httpCodePut } = usePut<BasicResponse>();
    const { SendGetRequest } = useGet<RolesResponse | PermissionLevelResponse | MenusResponse>();

    //Translation
    const { t } = useTranslation();
    const CardTitle = t("common.cardTitles.edit", { 0: t("navigation.Roles") });
    const CardSubTitle = t("common.cardSubTitles.edit");
    const ErrorRequired = t('errors.required');
    const ErrorMaxCaracter = t('errors.maxLength');
    const ErrorMinCaracter = t('errors.minLength');
    const CardButtonSave = t('buttons.save');
    const CardButtonCancel = t('buttons.cancel');
    const RolesCardFormName = t('common.labels.name');
    const RolesCardFormPermissionLevel = t("roles.labels.permissionLevel");
    const RolesCardFormDescription = t("roles.labels.description");

    //Links
    const returnToTable = paths.roles;

    //request initial data
    useEffect(() => {
        if (id) {
            const requests = [
                SendGetRequest("v1/roles/PermissionLevels"),
                SendGetRequest("v1/menus"),
                SendGetRequest("v1/roles/" + id)
            ];

            requests.forEach((request) => {
                Promise.resolve(request)
                    .then((response) => {
                        let rol;
                        switch (response.url) {
                            case "v1/roles/PermissionLevels":
                                setPermissionLevels(response.data as PermissionLevelResponse[]);
                                break;
                            case "v1/menus":
                                setMenus(response.data as MenusResponse[]);
                                break;
                            case "v1/roles/" + id:
                                rol = response.data as RolesResponse;
                                setRole(rol);

                                //set data in form
                                setValue("name", rol.name);
                                setValue("permissionLevel", rol.permissionLevelId);
                                if (rol.description)
                                    setValue("description", rol.description);

                        }
                    })
            })
        }
    }, []);

    //process menus
    useEffect(() => {
        if (Role && Menus) {
            const roleMenusId = Role.menus.map(x => x.id);
            setSelectedMenus(Menus.filter(menu => roleMenusId.some(id => Number(menu.id) === id)));
        }
    }, [Role, Menus])

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

    //load translation
    useEffect(() => {
        if (Menus) {
            setMenusTranslation(Menus.map(x => ({ name: x.name, value: t("navigation." + x.name) })));
        }
    }, [Menus, t])

    const onSubmit = async (data: RolFormModel) => {

        const rolData: RolesRequest = {
            name: data.name,
            permissionLevel: data.permissionLevel,
            description: data.description,
            menus: SelectedMenus.map(x => x.id)
        };

        SendPutRequest("v1/roles/" + id, rolData)
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
                                    <label className="align-self-start block mb-1">{RolesCardFormName}</label>
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

                    <div className='col-12'>
                        <Controller
                            name="description"
                            control={control}
                            rules={
                                {
                                    maxLength: {
                                        value: 300,
                                        message: ErrorMaxCaracter.replace("{{0}}", "300")
                                    },
                                }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label className="align-self-start block mb-1">{RolesCardFormDescription}</label>
                                    <InputTextarea
                                        id={field.name}
                                        autoResize
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className={classNames({ 'p-invalid': fieldState.error }) + " w-full py-1"}
                                        rows={5}
                                        cols={30} />

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
                                    <label className="align-self-start block mb-1">{RolesCardFormPermissionLevel}</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="name"
                                        optionValue="id"
                                        options={PermissionLevels}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error }) + " w-full py-1"}
                                    />
                                    {ErrorMessageHtml(field.name)}
                                </>

                            )}
                        />
                    </div>

                    {/* menus checkbox */}
                    <div className='col-12 grid'>
                        {Menus.filter(x => x.parentId === null).map((value: MenusResponse) => (
                            <div className='col-2 px-4' key={`parent-${value.id}`}>
                                <div className='flex flex-column gap-3 h-full'>
                                    <Card
                                        title={MenusTranslation.find(x => x.name == value.name)?.value}
                                        className='text-center h-full' pt={{
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

