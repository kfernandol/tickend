import React, { LegacyRef, useEffect, useRef, useState } from 'react'
import { FilterMatchMode } from 'primereact/api';
import { paths } from '../../routes/paths';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
//components
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
//hooks
import { useDelete, useGet } from "../../services/api_services";
import { useTranslation } from 'react-i18next';
//models
import { BasicResponse, ErrorResponse } from '../../models/responses/basic.response';
import { Badge } from 'primereact/badge';
import { TicketTypeResponse } from '../../models/responses/ticketType.response';

export default function TicketTypes() {
    const toast = useRef<Toast>(null);
    //Table Filters
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    //Api Request
    const { SendDeleteRequest, deleteResponse, errorDelete, httpCodeDelete } = useDelete<BasicResponse>();
    const { SendGetRequest, getResponse, loadingGet } = useGet<TicketTypeResponse[]>();
    const [menus, setMenus] = useState<any>([]);
    let deleteTicketTypeId = "";

    //Translations
    const { t } = useTranslation();
    const GlobalConfirmationDeleteText = t("GlobalConfirmationDeleteText");
    const GlobalConfirmation = t("GlobalConfirmation");
    const GlobalButtonDelete = t("GlobalButtonDelete");
    const GlobalButtonCancel = t("GlobalButtonCancel");
    const GlobalSearch = t("GlobalSearch");
    const GlobalTextTrue = t("GlobalTextTrue");
    const GlobalTextFalse = t("GlobalTextFalse");
    const TableTitle = t("TicketTypeTableTitle");
    const TableDeleteTitle = t("TicketTypeTableDeleteTitle");
    const CardTitleNewElement = t("MenusCardTitleNewMenu");
    const TableHeaderNew = t("TicketTypeTableHeaderNewTicketType")
    const TableHeaderId = t("TicketTypeTableHeaderId");
    const TableHeaderName = t("TicketTypeTableHeaderName");
    const TableHeaderIcon = t("TicketTypeTableHeaderIcon");
    const TableHeaderIconColor = t("TicketTypeTableHeaderIconColor");
    const TableHeaderActions = t("TicketTypeTableHeaderActions");


    //Send Request
    useEffect(() => {
        SendGetRequest("v1/ticket/types");
    }, [deleteResponse])

    //Get Response
    useEffect(() => {
        if (getResponse) {
            const menus = getResponse.map(x => ({
                id: x.id,
                name: x.name,
                icon: <i className={x.icon} />,
                iconColor: <Badge value={x.iconColor} style={{ backgroundColor: x.iconColor }}></Badge>
            }))

            setMenus(menus);
        }
    }, [getResponse, t]);

    //Notification Api Response
    useEffect(() => {
        //Delete user complete
        if (httpCodeDelete === 200) {
            toast?.current?.show({ severity: 'error', summary: TableDeleteTitle, detail: deleteResponse?.message, life: 3000 });
        }
        //Bad Request
        else if (httpCodeDelete == 400) {
            const errorResponse: ErrorResponse = errorDelete?.response?.data as ErrorResponse;

            if (errorResponse) {
                const errorsJson: string[] = JSON.parse(errorResponse.details);
                //ErrorResponse with list errors
                if (errorsJson) {
                    const errorsHtml = Object.values(errorsJson).flat().map((error, index) => {
                        return <li>{index + 1}. {error}</li>;
                    });

                    toast?.current?.show({ severity: 'error', summary: CardTitleNewElement, detail: <ul id='errors-toast'>{errorsHtml}</ul>, life: 3000 });
                } else {
                    toast?.current?.show({ severity: 'error', summary: CardTitleNewElement, detail: errorResponse.details, life: 3000 });
                }
            }
        }
        else {
            const response = errorDelete?.response?.data as ErrorResponse;
            if (response) {
                toast?.current?.show({ severity: 'error', summary: CardTitleNewElement, detail: response.details, life: 3000 });
            }
        }
    }, [deleteResponse, errorDelete, httpCodeDelete, t])


    //Table Search Filter
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        const _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };


    const TableHeader = (
        <div className="flex flex-wrap justify-content-between align-items-center gap-2 p-2" >
            {/* Table Title */}
            <span className='text-2xl text-white'>{TableTitle}</span>
            {/* Filter */}
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={GlobalSearch} />
            </span>
            {/* Add new */}
            <Link to={paths.newTicketType}>
                <Button icon="pi pi-plus" severity='success'>
                    <span className='pl-2'>{TableHeaderNew}</span>
                </Button>
            </Link>
        </div>
    );

    const ActionsTableTemplate = (rowData: { id: string; }) => {
        const editUrlPath = paths.EditTicketTypeWithId.slice(0, paths.EditTicketTypeWithId.length - 3);
        return <>
            <div className='flex gap-2'>
                <Link to={editUrlPath + rowData.id}>
                    <Button icon="pi pi-pencil" severity='warning' aria-label="Bookmark"></Button>
                </Link>
                <Button icon="pi pi-trash" severity='danger' aria-label="Bookmark" onClick={() => { confirmDelete(rowData.id) }}></Button>
            </div>
        </>
    }

    //Confirm Delete User Dialog
    const confirmDelete = (id: string) => {
        deleteTicketTypeId = id;
        confirmDialog({
            message: GlobalConfirmationDeleteText,
            header: GlobalConfirmation,
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: acceptDelete,
        });
    };

    //Accept Delete user
    function acceptDelete() {
        SendDeleteRequest("v1/ticket/types/" + deleteTicketTypeId);
    }

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
                    <div className="card" style={{ backgroundColor: "#17212f5D" }}>
                        <DataTable
                            value={menus}
                            header={TableHeader}
                            style={{ backgroundColor: "#17212f5D" }}
                            dataKey="id"
                            paginator
                            rows={10}
                            size='small'
                            filters={filters}
                            globalFilterFields={['id', 'name', 'icon', 'iconColor']}
                            emptyMessage="No customers found."
                        >
                            <Column style={{ width: '5rem' }} />
                            <Column field="id" header={TableHeaderId} sortable />
                            <Column field="name" header={TableHeaderName} sortable />
                            <Column field="icon" header={TableHeaderIcon} sortable />
                            <Column field="iconColor" header={TableHeaderIconColor} sortable />
                            <Column header={TableHeaderActions} body={ActionsTableTemplate} sortable />
                        </DataTable>
                    </div>
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
                                            acceptDelete();
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
