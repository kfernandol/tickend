//components
import { Avatar } from "primereact/avatar";
import { CascadeSelect, CascadeSelectChangeEvent } from "primereact/cascadeselect";
import { SelectItemOptionsType } from "primereact/selectitem";
import Swal from "sweetalert2";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Controller } from "react-hook-form";
import AvatarEditor from "../avatarEditor/avatarEditor";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
//redux
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { changeOrganization } from "../../redux/Slices/ApiServiceSlice";
import { login } from "../../redux/Slices/AuthSlice";
//hooks
import { useEffect, useRef, useState } from "react";
import { useAuthAPI, useDelete, useGet, usePost, usePut } from "../../services/api_services";
import { useTranslation } from 'react-i18next';
import useCustomForm from "../../hooks/useCustomForm";
import useTokenData from "../../hooks/useTokenData";
//models
import { OrganizationResponse } from "../../models/responses/organization.response";
import OrganizationForm from "../../models/forms/organization.form";
import { OrganizationRequest } from "../../models/requests/organization.request";
import { AuthToken } from "../../models/tokens/token.model";
import { BasicResponse, ErrorResponse, ErrorsResponse } from "../../models/responses/basic.response";

interface props {
    onChange?: (event: CascadeSelectChangeEvent) => void,
}

interface OrganizationOptions {
    id?: number,
    name: string,
    nameColor?: string,
    photo?: string | null,
    icon?: string,
    iconColor?: string,
    action?: string
    options?: OrganizationSubOptions[]
}

interface OrganizationSubOptions {
    cname: string,
    cnameColor?: string,
    icon?: string,
    iconColor?: string
    action?: string
}
export default function OrganizationSelect(props: props) {
    //redux
    const apiService = useSelector((state: RootState) => state.apiService);
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);
    const dispatch = useDispatch();
    //hooks
    const toast = useRef<Toast>(null);
    const { t } = useTranslation();
    const [organizations, setOrganizations] = useState<OrganizationResponse[]>();
    const [organizationsOptions, setOrganizationsOptions] = useState<OrganizationOptions[]>();
    const [organizacionDialogVisible, setOrganizacionDialogVisible] = useState<{ visible: boolean, action: string, organizationId?: number }>({ visible: false, action: "none" });
    const [organizacionPhoto, setOrganizacionPhoto] = useState<string>("");
    const [organizationSelected, setOrganizationSelected] = useState<number>();
    const { SendAuthRequest } = useAuthAPI();
    const { SendGetRequest } = useGet();
    const { SendPutRequest, httpCodePut, errorPut, putResponse } = usePut();
    const { SendPostRequest, httpCodePost, errorPost, postResponse } = usePost();
    const { SendDeleteRequest, httpCodeDelete, errorDelete, deleteResponse } = useDelete<BasicResponse>();

    const { control, ErrorMessageHtml, reset, getValues, setValue } = useCustomForm<OrganizationForm>(
        {
            name: "",
            photo: "",
            address: "",
            email: "",
            phone: "",
        }
    );

    //Translations
    const TableDeleteTitle = t("deleteConfirmation.title");
    const ErrorRequired = t('errors.required');
    const ErrorMaxCaracter = t('errors.maxLength');
    const ErrorMinCaracter = t('errors.minLength');
    const GlobalConfirmationDeleteText = t("deleteConfirmation.description", { 0: t("element.organization").toLowerCase() + "?" });
    const GlobalConfirmation = t("deleteConfirmation.title");
    const GlobalButtonDelete = t("buttons.delete");
    const GlobalButtonCancel = t("common.cardFormButtons.cancel");
    const AddTitle = t("organization.labels.addTitle");
    const EditTitle = t("organization.labels.editTitle");
    const name = t("organization.labels.name");
    const email = t("organization.labels.email");
    const phone = t("organization.labels.phone");
    const address = t("organization.labels.address");
    const addNew = t("organization.labels.addNew");
    const select = t("organization.labels.select");
    const edit = t("organization.labels.edit");
    const deleteTxt = t("organization.labels.delete");
    const selectOrganization = t("organization.placeholder.selectOrganization");

    useEffect(() => {
        const requests = [
            SendGetRequest("v1/organizations"),
        ]

        requests.forEach((request) => {
            Promise.resolve(request)
                .then((response) => {
                    switch (response.url) {
                        case "v1/organizations":
                            setOrganizations(response.data as OrganizationResponse[])
                            break;
                    }
                })
        })
    }, [])

    //Process organizations
    useEffect(() => {
        if (organizations) {

            const options: OrganizationOptions[] = organizations.map((organization) => {
                const baseOptions = [
                    {
                        organization: organization.id,
                        cname: select,
                        cnameColor: "text-teal-500",
                        icon: "pi pi-arrow-right-arrow-left",
                        iconColor: "text-teal-500",
                        action: "select"
                    }
                ];

                // Agregar la opción de edición y eliminación si el usuario tiene nivel de permisos 'Administrator'
                if (getTokenData?.permissionLevel === "Administrator") {
                    baseOptions.push(
                        {
                            organization: organization.id,
                            cname: edit,
                            cnameColor: "text-yellow-500",
                            icon: "pi pi-refresh",
                            iconColor: "text-yellow-500",
                            action: "edit"
                        },
                        {
                            organization: organization.id,
                            cname: deleteTxt,
                            cnameColor: "text-red-500",
                            icon: "pi pi-trash",
                            iconColor: "text-red-500",
                            action: "delete"
                        }
                    );
                }

                return {
                    id: organization.id,
                    name: organization.name,
                    photo: organization.photo,
                    options: baseOptions
                };
            });

            const optionAddNew: OrganizationOptions = {
                name: addNew,
                nameColor: "text-primary",
                icon: "pi pi-plus",
                iconColor: "text-primary",
                action: "new"
            }

            options.push(optionAddNew);
            setOrganizationsOptions(options);
        }
    }, [organizations, t])

    //Change Organization Refresh token
    useEffect(() => {
        if (organizationSelected) {
            const requestRefreshToken = {
                username: getTokenData ? getTokenData.sub : "",
                refreshToken: authenticated.refreshToken,
                organizationId: apiService.organization

            };

            SendAuthRequest('v1/auth/refresh-token', requestRefreshToken)
                .then((response) => {
                    const resp = response.data;
                    dispatch(login(resp));

                })
                .finally(() => window.location.reload());

        }

    }, [organizationSelected])

    //Notification delete
    useEffect(() => {
        let errorResponse = errorDelete;
        if (httpCodeDelete !== 200) {
            if (errorResponse) {
                if (typeof (errorResponse as ErrorResponse | ErrorsResponse).details === "string") // String Details
                {
                    errorResponse = errorResponse as ErrorResponse;
                    toast?.current?.show({
                        severity: 'error', summary: TableDeleteTitle, detail: errorResponse.details, life: 3000
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
                    toast?.current?.show({ severity: 'error', summary: TableDeleteTitle, detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
                }
            }
        } else {
            toast?.current?.show({ severity: 'success', summary: TableDeleteTitle, detail: deleteResponse?.message, life: 3000 });
            SendGetRequest("v1/organizations").then((response) => {
                setOrganizations(response.data as OrganizationResponse[])
            })
        }

    }, [errorDelete, httpCodeDelete, deleteResponse])

    //Add notification
    useEffect(() => {
        let errorResponse = errorPost;
        if (httpCodePost !== 200) {
            if (errorResponse) {
                if (typeof (errorResponse as ErrorResponse | ErrorsResponse).details === "string") // String Details
                {
                    errorResponse = errorResponse as ErrorResponse;
                    toast?.current?.show({
                        severity: 'error', summary: AddTitle, detail: errorResponse.details, life: 3000
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
                    toast?.current?.show({ severity: 'error', summary: AddTitle, detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
                }
            }
        } else {
            const { message } = postResponse as BasicResponse;
            toast?.current?.show({ severity: 'success', summary: AddTitle, detail: message, life: 3000 });
            reset();
            SendGetRequest("v1/organizations").then((response) => {
                setOrganizations(response.data as OrganizationResponse[])
            })
        }

    }, [errorPost, httpCodePost, postResponse])

    //Edit notification
    useEffect(() => {
        let errorResponse = errorPut;
        if (httpCodePut !== 200) {
            if (errorResponse) {
                if (typeof (errorResponse as ErrorResponse | ErrorsResponse).details === "string") // String Details
                {
                    errorResponse = errorResponse as ErrorResponse;
                    toast?.current?.show({
                        severity: 'error', summary: EditTitle, detail: errorResponse.details, life: 3000
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
                    toast?.current?.show({ severity: 'error', summary: EditTitle, detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
                }
            }
        } else {
            const { message } = putResponse as BasicResponse;
            toast?.current?.show({ severity: 'success', summary: EditTitle, detail: message, life: 3000 });
            reset();
            SendGetRequest("v1/organizations").then((response) => {
                setOrganizations(response.data as OrganizationResponse[])
            })
        }

    }, [errorPut, httpCodePut, putResponse])

    const organizationOptionTemplate = (option: { name: string, nameColor: string, cname: string, cnameColor: string, icon: string, iconColor: string, photo: string | null }) => {
        return (
            <div className={`flex w-full h-full align-items-center gap-2 `}>
                {option.cname && <i className={`${option.icon} ${option.iconColor}`} />}
                {option.name && option.icon && <i className={`${option.icon} ${option.iconColor}`} />}
                {option.name && option.name !== addNew
                    ? option.photo
                        ? <Avatar size={'normal'} image={option.photo} />
                        : <Avatar size={'normal'} label={option.name[0]} />
                    : null}
                <span className={`${option.cnameColor} ${option.nameColor}`}>{option.cname || option.name}</span>
            </div>
        );
    }

    const footerDialogContent = (
        <div>
            <Button
                label="Save"
                icon="pi pi-check"
                severity="success"
                onClick={() => {
                    handlerSaveClick();
                    setOrganizacionDialogVisible({ visible: false, action: "none" });
                }}
                autoFocus />
            <Button
                label="Cancel"
                icon="pi pi-times"
                severity="secondary"
                onClick={() => {
                    setOrganizacionDialogVisible({ visible: false, action: "none" })
                }} className="p-button-text" />
        </div>
    );

    const handlerSelectChange = (e: CascadeSelectChangeEvent) => {
        //Edit get Data
        if (e.value.action === "edit") {
            SendGetRequest("v1/organizations/" + e.value.organization)
                .then((response) => {
                    const data = response.data as OrganizationResponse;
                    setValue("name", data.name);
                    setValue("address", data.address);
                    setValue("photo", data.photo);
                    setValue("email", data.email);
                    setValue("phone", data.phone);
                    setOrganizacionDialogVisible({ visible: true, action: "edit", organizationId: e.value.organization });
                })
        }

        //Show dialog
        if (e.value.action === "new") {
            setValue("name", "");
            setValue("address", "");
            setValue("photo", "");
            setValue("email", "");
            setValue("phone", "");
            setOrganizacionDialogVisible({ visible: true, action: "new", organizationId: e.value.organization });
        }

        if (e.value.action === "delete") {
            Swal.fire({
                title: GlobalConfirmation,
                text: GlobalConfirmationDeleteText,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: GlobalButtonDelete,
                confirmButtonColor: "#d33",
                cancelButtonText: GlobalButtonCancel,
                cancelButtonColor: "#707070",
            }).then((result) => {
                if (result.isConfirmed) {
                    SendDeleteRequest("v1/organizations/" + e.value.organization);
                    if (e.value.organization === apiService.organization) {
                        const currentIndex = organizations?.findIndex(x => x.id === e.value.organization);
                        if (currentIndex && organizations && currentIndex !== -1) {
                            // Encuentra el siguiente índice, asegurándote de no salirte del rango
                            const nextIndex = (currentIndex + 1) % organizations.length;
                            const nextOrganization = organizations[nextIndex];

                            // Cambia el valor al siguiente elemento
                            setOrganizationSelected(nextOrganization.id);
                            dispatch(changeOrganization(nextOrganization.id))
                        }
                    }
                }
            })
        }

        if (e.value.action === "select") {
            setOrganizationSelected(e.value.organization)
            dispatch(changeOrganization(e.value.organization));
        }

        //Call onchange prop
        if (props.onChange)
            props.onChange(e)
    }

    const handlerAvatarChange = (AvatarBase64: string) => {
        setOrganizacionPhoto(AvatarBase64);
    }

    const handlerSaveClick = () => {
        if (organizacionDialogVisible.organizationId && organizacionDialogVisible.action === "edit") {
            const editRequest: OrganizationRequest = {
                id: organizacionDialogVisible.organizationId,
                name: getValues("name"),
                photo: organizacionPhoto,
                address: getValues("address"),
                email: getValues("email"),
                phone: getValues("phone"),
            }

            SendPutRequest("v1/organizations/" + organizacionDialogVisible.organizationId, editRequest);
        } else {
            const newRequest: OrganizationRequest = {
                name: getValues("name"),
                photo: organizacionPhoto,
                address: getValues("address"),
                email: getValues("email"),
                phone: getValues("phone"),
            }

            SendPostRequest("v1/organizations/", newRequest);
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <CascadeSelect
                value={organizations?.find(x => x.id == apiService.organization)?.name}
                options={organizationsOptions as SelectItemOptionsType}
                optionLabel="name"
                optionGroupLabel="name"
                optionGroupChildren={['options']}
                className="w-full md:w-14rem"
                breakpoint="767px"
                placeholder={selectOrganization}
                itemTemplate={organizationOptionTemplate}
                onChange={(e) => handlerSelectChange(e)}
                style={{ minWidth: '14rem' }} />
            <Dialog
                header={organizacionDialogVisible.action === "edit" ? EditTitle : AddTitle}
                visible={organizacionDialogVisible.visible}
                style={{ width: '50vw' }}
                onHide={() => { if (!organizacionDialogVisible) return; setOrganizacionDialogVisible({ visible: false, action: 'none' }); }}
                footer={footerDialogContent}>
                <div className="flex flex-column align-items-center">
                    <AvatarEditor onChangeAvatar={(e) => handlerAvatarChange(e)} PhotoBase64={organizacionDialogVisible.action === "edit" ? getValues("photo") : undefined} />
                    <div className="grid w-full mt-5">
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
                                        <label className="align-self-start block mb-1">{name}</label>
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

                        {/* Email Input */}
                        <div className='col-6'>
                            <Controller
                                name="email"
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
                                        <label className="align-self-start block mb-1">{email}</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            type='email'
                                            className={classNames({ 'p-invalid': fieldState.error }) + " w-full p-inputtext-lg"}
                                            onChange={(e) => field.onChange(e.target.value)} />
                                        {ErrorMessageHtml(field.name)}
                                    </>
                                )}
                            />
                        </div>

                        {/* Phone Input */}
                        <div className='col-6'>
                            <Controller
                                name="phone"
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
                                        <label className="align-self-start block mb-1">{phone}</label>
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

                        {/* Address Input */}
                        <div className='col-12'>
                            <Controller
                                name="address"
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
                                        <label className="align-self-start block mb-1">{address}</label>
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

                    </div>
                </div>
            </Dialog>
        </>
    )
}