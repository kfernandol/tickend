import { useEffect, useRef, useState } from 'react'
import { FilterMatchMode } from 'primereact/api';
import { paths } from '../../routes/paths';
import { RootState } from '../../redux/store';
//components
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import Swal from 'sweetalert2'
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
//hooks
import { useDelete, useGet } from "../../services/api_services";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import useTokenData from '../../hooks/useTokenData';
//models
import { BasicResponse, ErrorResponse, ErrorsResponse } from '../../models/responses/basic.response';
import { ProjectResponse } from '../../models/responses/project.response';
import { TicketPriorityResponse } from '../../models/responses/ticketPriority.response';
import { TicketStatusResponse } from '../../models/responses/ticketStatus.response';
import { TicketTypeResponse } from '../../models/responses/ticketType.response';
import { UserResponse } from '../../models/responses/users.response';
import { AuthToken } from '../../models/tokens/token.model';

export default function Projects() {
    const toast = useRef<Toast>(null);
    //Redux
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);
    //Table
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    const [TableData, setTableData] = useState<{
        id: number,
        photo: React.JSX.Element,
        name: string,
        description: string,
        ticketTypes: string[],
        ticketStatus: string[],
        ticketPriorities: string[],
        clients: string[],
        developers: string[]
    }[]>();
    //Api Request
    const { SendDeleteRequest, deleteResponse, errorDelete, httpCodeDelete } = useDelete<BasicResponse>();
    const { SendGetRequest, loadingGet } = useGet<ProjectResponse[] | TicketPriorityResponse[] | TicketStatusResponse[] | TicketTypeResponse[]>();
    const [Projects, setProjects] = useState<ProjectResponse[]>([]);
    const [TicketPriorities, setTicketPriorities] = useState<TicketPriorityResponse[]>([]);
    const [TicketStatus, setTicketStatus] = useState<TicketStatusResponse[]>([]);
    const [TicketType, setTicketType] = useState<TicketTypeResponse[]>([]);
    const [Users, setUsers] = useState<UserResponse[]>([]);

    //Translations
    const { t } = useTranslation();
    const GlobalConfirmationDeleteText = t("deleteConfirmation.description", { 0: t("element.Project").toLowerCase() + "?" });
    const GlobalConfirmation = t("deleteConfirmation.title");
    const GlobalButtonDelete = t("buttons.delete");
    const GlobalButtonCancel = t("common.cardFormButtons.cancel");
    const GlobalSearch = t("placeholders.search");
    const TableDeleteTitle = t("deleteConfirmation.title");
    const TableTitle = t("projects.tableTitle");
    const TableHeaderNew = t("projects.labels.new")
    const TableHeaderId = t("common.labels.id");
    const TableHeaderName = t("common.labels.name");
    const TableHeaderActions = t("common.labels.actions");
    const TableHeaderPhoto = t("projects.labels.photo");
    const TableHeaderDescription = t("projects.labels.description");
    const TableHeaderStatus = t("projects.labels.status");
    const TableHeaderPriorities = t("projects.labels.priorities");
    const TableHeaderTypes = t("projects.labels.types");
    const TableHeaderClients = t("projects.labels.clients");
    const TableHeaderDeveloper = t("projects.labels.developer");
    const TableNoElements = t("common.table.noElements");
    const PageName = t("navigation.Projects");

    //Links
    const NewItemUrl = paths.newProject;
    const EditItemUrl = paths.editProjectWithId;

    //Send Request
    useEffect(() => {
        const requests = [
            SendGetRequest("v1/projects"),
            SendGetRequest("v1/ticket/priorities"),
            SendGetRequest("v1/ticket/status"),
            SendGetRequest("v1/ticket/types"),
            SendGetRequest("v1/users")
        ];

        Promise.all(requests)
            .then((responses) => {
                responses.forEach((response) => {
                    switch (response.url) {
                        case "v1/projects":
                            setProjects(response.data as ProjectResponse[]);
                            break;
                        case "v1/ticket/priorities":
                            setTicketPriorities(response.data as TicketPriorityResponse[]);
                            break;
                        case "v1/ticket/status":
                            setTicketStatus(response.data as TicketStatusResponse[]);
                            break;
                        case "v1/ticket/types":
                            setTicketType(response.data as TicketTypeResponse[]);
                            break;
                        case "v1/users":
                            setUsers(response.data as UserResponse[]);
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

    //Set DataTable
    useEffect(() => {

        const Data = Projects.map(x => ({
            id: x.id,
            name: x.name,
            description: x.description,
            photo: x.photo !== null && x.photo !== "" ? <Avatar image={`${x.photo}`} size='large' /> : <Avatar image={'/src/assets/imgs/project-default.png'} size='large' />,
            ticketStatus: TicketStatus.map(status => { const IncludeItem = x.ticketStatus.includes(status.id); return IncludeItem === false ? "" : `${status.name}, `; }),
            ticketPriorities: TicketPriorities.map(priority => { const IncludeItem = x.ticketPriorities.includes(priority.id); return IncludeItem === false ? "" : `${priority.name}, `; }),
            ticketTypes: TicketType.map(type => { const IncludeItem = x.ticketTypes.includes(type.id); return IncludeItem === false ? "" : `${type.name}, `; }),
            clients: Users.map(user => { const IncludeItem = x.clients.includes(user.id); return IncludeItem === false ? "" : `${user.firstName} ${user.lastName}` }),
            developers: Users.map(user => { const IncludeItem = x.developers.includes(user.id); return IncludeItem === false ? "" : `${user.firstName} ${user.lastName}` }),

        }));
        setTableData(Data);

    }, [Projects, TicketStatus, TicketPriorities, TicketType])

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
            setTimeout(() => SendGetRequest("v1/projects").then((result) => { setProjects(result.data) }), 3000);
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
                <Button icon="pi pi-trash" severity='danger' aria-label="Bookmark" onClick={() => { confirmDelete(rowData.id) }} key={rowData.id}></Button>
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
        }).then((result) => {
            if (result.isConfirmed) {
                SendDeleteRequest("v1/projects/" + id);
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
                            value={TableData}
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
                            <Column field="photo" header={TableHeaderPhoto} sortable />
                            <Column field="name" header={TableHeaderName} sortable />
                            <Column field="description" header={TableHeaderDescription} sortable />
                            <Column field="ticketStatus" header={TableHeaderStatus} sortable />
                            <Column field="ticketPriorities" header={TableHeaderPriorities} sortable />
                            <Column field="ticketTypes" header={TableHeaderTypes} sortable />
                            <Column field="clients" header={TableHeaderClients} sortable />
                            <Column field="developers" header={TableHeaderDeveloper} sortable />
                            {getTokenData?.PermissionLevel === "Administrator" ? <Column header={TableHeaderActions} body={ActionsTableTemplate} sortable /> : <></>}
                        </DataTable>
                    </Card>
                </>
            }

        </>


    )
}
