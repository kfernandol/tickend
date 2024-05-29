import { useEffect, useRef, useState } from 'react'
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
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import Swal from 'sweetalert2';
//hooks
import { useDelete, useGet } from "../../services/api_services";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import useTokenData from '../../hooks/useTokenData';
//models
import { BasicResponse, ErrorResponse, ErrorsResponse } from '../../models/responses/basic.response';
import { TicketStatusResponse } from '../../models/responses/ticketStatus.response';
import { RootState } from '../../redux/store';
import { AuthToken } from '../../models/tokens/token.model';
import { TicketPriorityResponse } from '../../models/responses/ticketPriority.response';

export default function TicketPriority() {
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
    const { SendGetRequest, loadingGet } = useGet<TicketStatusResponse[]>();
    const [TicketPriorities, setTicketPriorities] = useState<
        {
            id: number,
            name: string,
            color: React.JSX.Element,
        }[]>([]);

    //Translations
    const { t } = useTranslation();
    const GlobalConfirmationDeleteText = t("deleteConfirmation.description", { 0: t("element.ticketPriority").toLowerCase() + "?" });
    const GlobalConfirmation = t("deleteConfirmation.title");
    const GlobalButtonDelete = t("buttons.delete");
    const GlobalButtonCancel = t("common.cardFormButtons.cancel");
    const GlobalSearch = t("placeholders.search");
    const TableDeleteTitle = t("deleteConfirmation.title");
    const TableTitle = t("ticketPriorities.tableTitle");
    const TableHeaderNew = t("ticketPriorities.labels.new")
    const TableHeaderId = t("common.labels.id");
    const TableHeaderName = t("common.labels.name");
    const TableHeaderColor = t("ticketPriorities.labels.color");
    const TableHeaderActions = t("common.labels.actions");
    const TableNoElements = t("common.table.noElements");
    const PageName = t("navigation.TicketPriority");

    //Links
    const NewItemUrl = paths.newTicketPriorities;
    const EditItemUrl = paths.EditTicketPrioritiesWithId;

    //Send Request
    useEffect(() => {
        const requests = [
            SendGetRequest("v1/ticket/priorities")
        ];

        Promise.all(requests)
            .then((responses) => {
                responses.forEach((response) => {
                    switch (response.url) {
                        case "v1/ticket/priorities":
                            setTicketPriorities((response.data as TicketPriorityResponse[]).map((x) => (
                                {
                                    id: x.id,
                                    name: x.name,
                                    color: <Badge value={x.color} style={{ backgroundColor: x.color }}></Badge>
                                }
                            )));
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
            setTimeout(() => SendGetRequest("v1/ticket/priorities").then((value) => {
                setTicketPriorities((value.data as TicketPriorityResponse[]).map((x) => (
                    {
                        id: x.id,
                        name: x.name,
                        color: <Badge value={x.color} style={{ backgroundColor: x.color }}></Badge>
                    }
                )));
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
                SendDeleteRequest("v1/ticket/priorities/" + id)
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
                        {getTokenData?.permissionLevel === "Administrator"
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
                            value={TicketPriorities}
                            header={TableHeader}
                            dataKey="id"
                            paginator
                            rows={10}
                            size='small'
                            filters={filters}
                            globalFilterFields={['id', 'name', 'color']}
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
                            <Column field="color" header={TableHeaderColor} sortable />
                            {getTokenData?.permissionLevel === "Administrator" ? <Column header={TableHeaderActions} body={ActionsTableTemplate} sortable /> : <></>}
                        </DataTable>
                    </Card>
                </>
            }

        </>


    )
}
