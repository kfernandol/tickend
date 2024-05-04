import React, { useEffect, useRef, useState } from 'react'
import { FilterMatchMode } from 'primereact/api';
import { paths } from '../../routes/paths';
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
import { BasicResponse, ErrorResponse, ErrorsResponse } from '../../models/responses/basic.response';
import { Badge } from 'primereact/badge';
import { TicketTypeResponse } from '../../models/responses/ticketType.response';
import Swal from 'sweetalert2';

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
    const [TicketTypes, setTicketTypes] = useState<{
        id: number,
        name: string,
        icon: React.JSX.Element,
        iconColor: React.JSX.Element,
    }[]>([]);

    //Translations
    const { t } = useTranslation();
    const GlobalConfirmationDeleteText = t("deleteConfirmation.description", { 0: t("element.TicketTypes").toLowerCase() + "?" });
    const GlobalConfirmation = t("deleteConfirmation.title");
    const GlobalButtonDelete = t("buttons.delete");
    const GlobalButtonCancel = t("common.cardFormButtons.cancel");
    const GlobalSearch = t("placeholders.search");
    const TableDeleteTitle = t("deleteConfirmation.title");
    const TableTitle = t("ticketTypes.tableTitle");
    const TableHeaderNew = t("ticketTypes.labels.new")
    const TableHeaderId = t("common.labels.id");
    const TableHeaderName = t("common.labels.name");
    const TableHeaderIcon = t("ticketTypes.labels.icon");
    const TableHeaderIconColor = t("ticketTypes.labels.iconColor");
    const TableHeaderActions = t("common.labels.actions");

    //Links
    const NewItemUrl = paths.newTicketType;
    const EditItemUrl = paths.EditTicketTypeWithId;


    //Send Request
    useEffect(() => {
        SendGetRequest("v1/ticket/types");
    }, [deleteResponse])

    //Get Response
    useEffect(() => {
        if (getResponse) {
            const TicketTypes = getResponse.map(x => ({
                id: x.id,
                name: x.name,
                icon: <i className={x.icon} />,
                iconColor: <Badge value={x.iconColor} style={{ backgroundColor: x.iconColor }}></Badge>
            }))

            setTicketTypes(TicketTypes);
        }
    }, [getResponse, t]);

    //Notification delete
    useEffect(() => {
        if (httpCodeDelete === 200) {
            toast?.current?.show({ severity: 'success', summary: TableDeleteTitle, detail: deleteResponse?.message, life: 3000 });
            setTimeout(() => SendGetRequest("v1/ticket/priorities"), 3000);
        }
        if (errorDelete && httpCodeDelete !== 0) {
            if ('errors' in errorDelete) {//Is Errors Response
                const errors = errorDelete as ErrorsResponse;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const errorsHtml = Object.entries(errors.errors).map(([_field, errors], index) => (
                    errors.map((error, errorIndex) => (
                        <li key={`${index}-${errorIndex}`}>{error}</li>
                    ))
                )).flat();
                toast?.current?.show({ severity: 'error', summary: TableDeleteTitle, detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
            } else if ('details' in errorDelete) {//Is Error Response
                const error = errorDelete as ErrorResponse;
                toast?.current?.show({
                    severity: 'error', summary: TableDeleteTitle, detail: error.details, life: 3000
                });
            }
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
            <span className='text-2xl text-white'>{TableTitle}</span>
            {/* Filter */}
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={GlobalSearch} />
            </span>
            {/* Add new */}
            <Link to={NewItemUrl}>
                <Button icon="pi pi-plus" severity='success'>
                    <span className='pl-2'>{TableHeaderNew}</span>
                </Button>
            </Link>
        </div>
    );

    const ActionsTableTemplate = (rowData: { id: string; }) => {
        const editUrlPath = EditItemUrl.slice(0, EditItemUrl.length - 3);
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
                SendDeleteRequest("v1/ticket/types/" + id)
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
                    <div className="card" style={{ backgroundColor: "#17212f5D" }}>
                        <DataTable
                            value={TicketTypes}
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
                </>
            }

        </>


    )
}
