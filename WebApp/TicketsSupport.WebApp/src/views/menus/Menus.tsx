import React, { LegacyRef, useEffect, useRef, useState } from 'react'
import { FilterMatchMode } from 'primereact/api';
import { paths } from '../../routes/paths';
//redux
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
//components
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
import Swal from 'sweetalert2';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Card } from 'primereact/card';
//hooks
import { useDelete, useGet } from "../../services/api_services";
import { useTranslation } from 'react-i18next';
import useTokenData from '../../hooks/useTokenData';
//models
import { BasicResponse, ErrorResponse, ErrorsResponse } from '../../models/responses/basic.response';
import { MenusResponse } from '../../models/responses/menus.response';
import { AuthToken } from '../../models/tokens/token.model';

export default function Menus() {
    const toast = useRef<Toast>(null);
    //Redux
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);
    //Table Filters
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    //Api Request
    const { SendDeleteRequest, deleteResponse, errorDelete, httpCodeDelete } = useDelete<BasicResponse>();
    const { SendGetRequest, loadingGet } = useGet<MenusResponse[]>();
    const [menus, setMenus] = useState<{
        id: number,
        name: string,
        icon: React.JSX.Element,
        url: string,
        parentId: string | undefined,
        position: string | number,
        show: React.JSX.Element,
    }[]>();

    //Translations
    const { t } = useTranslation();
    const GlobalConfirmationDeleteText = t("deleteConfirmation.description", { 0: t("element.menu").toLowerCase() + "?" });
    const GlobalConfirmation = t("deleteConfirmation.title");
    const GlobalButtonDelete = t("buttons.delete");
    const GlobalButtonCancel = t("common.cardFormButtons.cancel");
    const GlobalSearch = t("placeholders.search");
    const TableDeleteTitle = t("deleteConfirmation.title");
    const GlobalTextTrue = t("boolean.true");
    const GlobalTextFalse = t("boolean.false");
    const TableTitle = t("menus.tableTitle");
    const TableHeaderNew = t("menus.labels.new")
    const TableHeaderId = t("common.labels.id");
    const TableHeaderName = t("common.labels.name");
    const TableHeaderActions = t("common.labels.actions");
    const TableHeaderUrl = t("menus.labels.url");
    const TableHeaderIcon = t("menus.labels.icon");
    const TableHeaderPosition = t("menus.labels.position");
    const TableHeaderParentId = t("menus.labels.parentId");
    const TableHeaderShow = t("menus.labels.show");
    const TableNoElements = t("common.table.noElements");
    const PageName = t("navigation.Menus");

    //Links
    const NewItemUrl = paths.newMenus;
    const EditItemUrl = paths.editMenusWithId;

    //Send Request
    useEffect(() => {
        const requests = [
            SendGetRequest("v1/menus")
        ];

        Promise.all(requests)
            .then((responses) => {
                responses.forEach((response) => {
                    switch (response.url) {
                        case "v1/menus":
                            setMenus((response.data as MenusResponse[]).map(x => ({
                                id: x.id,
                                name: x.name,
                                icon: <i className={'pi ' + x.icon} />,
                                url: x.url,
                                parentId: (response.data as MenusResponse[]).find(c => c.id == x.parentId)?.name,
                                position: x.parentId !== null ? x.position : '',
                                show: x.show === true ? <Badge value={GlobalTextTrue} severity="success"></Badge> : <Badge value={GlobalTextFalse} severity="danger"></Badge>
                            })));
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
            setTimeout(() => SendGetRequest("v1/menus").then((value) => {
                setMenus((value.data as MenusResponse[]).map(x => ({
                    id: x.id,
                    name: x.name,
                    icon: <i className={'pi ' + x.icon} />,
                    url: x.url,
                    parentId: (value.data as MenusResponse[]).find(c => c.id == x.parentId)?.name,
                    position: x.parentId !== null ? x.position : '',
                    show: x.show === true ? <Badge value={GlobalTextTrue} severity="success"></Badge> : <Badge value={GlobalTextFalse} severity="danger"></Badge>
                })));
            }), 3000);
        }

    }, [errorDelete, httpCodeDelete, deleteResponse])


    //Table Search Filter
    const onGlobalFilterChange = (e: { target: { value: string | null } }) => {
        const value = e.target.value;
        const _filters = { ...filters };

        _filters['global'].value = value as null;

        setFilters(_filters);
        setGlobalFilterValue(value !== null ? value : '');
    };


    const TableHeader = (
        <div className="flex flex-wrap justify-content-between align-items-center gap-2 p-2" >
            {/* Table Title */}
            <span className='text-xl text-black'>{TableTitle}</span>
            {/* Filter */}
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search"> </InputIcon>
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={GlobalSearch} />
            </IconField>
        </div>
    );

    const ActionsTableTemplate = (rowData: { id: string; }) => {
        const editUrlPath = EditItemUrl.slice(0, EditItemUrl.length - 3);
        return <>
            <div className='flex justify-content-center gap-2'>
                <Link to={editUrlPath + rowData.id}>
                    <Button icon="pi pi-pencil" severity='warning' aria-label="Bookmark"></Button>
                </Link>
                <Button icon="pi pi-trash" severity='danger' aria-label="Bookmark" onClick={() => { confirmDelete(rowData.id) }}></Button>
            </div>
        </>
    }

    const confirmDelete = (id: string) => {
        return Swal.fire({
            title: GlobalConfirmation,
            text: GlobalConfirmationDeleteText,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: GlobalButtonDelete,
            confirmButtonColor: "#d33",
            cancelButtonText: GlobalButtonCancel,
            cancelButtonColor: "#707070",
        }).then((result: { isConfirmed: boolean }) => {
            if (result.isConfirmed) {
                SendDeleteRequest("v1/menus/" + id)
            }
        })
    };

    return (
        <>
            {loadingGet
                ?
                <div className='flex h-full w-full justify-content-center align-items-center'>
                    <ProgressSpinner />
                </div>
                :
                <>
                    <Toast ref={toast} />
                    {/*Title*/}
                    <div className="flex justify-content-between align-items-center my-4">
                        <h2 className="my-0">{PageName}</h2>
                        {/* Add new */}
                        {getTokenData?.PermissionLevel === "Administrator"
                            ? <Link to={NewItemUrl}>
                                <Button icon="pi pi-plus" severity='success'>
                                    <span className='pl-2'>{TableHeaderNew}</span>
                                </Button>
                            </Link>
                            : null}
                    </div>
                    <Card
                        style={{ height: "calc(100% - 125px)" }}
                        pt={{
                            body: { className: "h-full pb-0" },
                            content: { className: "h-full py-0" },
                        }}>
                        <DataTable
                            value={menus}
                            header={TableHeader}
                            dataKey="id"
                            paginator
                            rows={10}
                            size='small'
                            filters={filters}
                            globalFilterFields={['id', 'name', 'url', 'icon', 'position', 'parentId', 'show']}
                            emptyMessage={TableNoElements}
                            stripedRows
                            pt={{
                                root: { className: "h-full flex flex-column" },
                                header: { className: "bg-white border-0 mb-3" },
                                wrapper: { className: "h-full" },
                                column: { headerCell: { className: "bg-yellow-100" } }
                            }}
                        >
                            <Column style={{ width: '5rem' }} />
                            <Column field="id" header={TableHeaderId} sortable />
                            <Column field="name" header={TableHeaderName} sortable />
                            <Column field="url" header={TableHeaderUrl} sortable />
                            <Column field="icon" header={TableHeaderIcon} sortable />
                            <Column field="position" header={TableHeaderPosition} sortable />
                            <Column field="parentId" header={TableHeaderParentId} sortable />
                            <Column field="show" header={TableHeaderShow} sortable />
                            {getTokenData?.PermissionLevel === "Administrator" ? <Column header={TableHeaderActions} body={ActionsTableTemplate} sortable /> : <></>}
                        </DataTable>
                    </Card>

                    <ConfirmDialog
                        content={({ headerRef, contentRef, footerRef, hide, message }) => (
                            <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
                                <div className="border-circle bg-red-500 inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                                    <i className="pi pi-question text-5xl"></i>
                                </div>
                                <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                                    {message.header}
                                </span>
                                <p className="mb-0" ref={contentRef as LegacyRef<HTMLDivElement>}>
                                    {message.message}
                                </p>
                                <div className="flex align-items-center gap-2 mt-4" ref={footerRef as LegacyRef<HTMLDivElement>}>
                                    <Button
                                        label={GlobalButtonDelete}
                                        severity='danger'
                                        onClick={(event) => {
                                            hide(event);
                                        }}
                                        className="w-8rem"
                                    ></Button>
                                    <Button
                                        label={GlobalButtonCancel}
                                        severity='secondary'
                                        outlined
                                        onClick={(event) => {
                                            hide(event);
                                        }}
                                        className="w-8rem"
                                    ></Button>
                                </div>
                            </div>
                        )}
                    />
                </>
            }

        </>


    )
}
