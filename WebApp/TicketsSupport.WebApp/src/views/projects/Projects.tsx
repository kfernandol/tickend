
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
import { BasicResponse, ErrorResponse, ErrorsResponse } from '../../models/responses/basic.response';
import { ProjectResponse } from '../../models/responses/project.response';
import { TicketPriorityResponse } from '../../models/responses/ticketPriority.response';
import { TicketStatusResponse } from '../../models/responses/ticketStatus.response';
import { TicketTypeResponse } from '../../models/responses/ticketType.response';
import { Avatar } from 'primereact/avatar';
import { UserResponse } from '../../models/responses/users.response';

export default function Projects() {
    const toast = useRef<Toast>(null);
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
    const GlobalConfirmationDeleteText = t("deleteConfirmation.description", { 0: t("navigation.Users") });
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
            photo: <Avatar image={`data:image/*;base64,${x.photo}`} size='large' />,
            ticketStatus: TicketStatus.map(status => { const IncludeItem = x.ticketStatus.includes(status.id); return IncludeItem === false ? "" : `${status.name}, `; }),
            ticketPriorities: TicketPriorities.map(priority => { const IncludeItem = x.ticketPriorities.includes(priority.id); return IncludeItem === false ? "" : `${priority.name}, `; }),
            ticketTypes: TicketType.map(type => { const IncludeItem = x.ticketTypes.includes(type.id); return IncludeItem === false ? "" : `${type.name}, `; }),
            clients: Users.map(user => { const IncludeItem = x.clients.includes(user.id); return IncludeItem === false ? "" : `${user.firstName} ${user.lastName}` }),
            developers: Users.map(user => { const IncludeItem = x.developers.includes(user.id); return IncludeItem === false ? "" : `${user.firstName} ${user.lastName}` }),

        }));
        setTableData(Data);

    }, [Projects, TicketStatus, TicketPriorities, TicketType])

    //Notification Api Response
    useEffect(() => {
        if (httpCodeDelete === 200) {
            toast?.current?.show({ severity: 'success', summary: TableDeleteTitle, detail: deleteResponse?.message, life: 3000 });
            setTimeout(() => SendGetRequest("v1/menus"), 3000);
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
        confirmDialog({
            message: GlobalConfirmationDeleteText,
            header: GlobalConfirmation,
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => SendDeleteRequest("v1/projects/" + id),
            reject: () => console.log("aaaaaaaa")
        });
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
                            value={TableData}
                            header={TableHeader}
                            style={{ backgroundColor: "#17212f5D" }}
                            dataKey="id"
                            paginator
                            rows={10}
                            size='small'
                            filters={filters}
                            globalFilterFields={['id', 'name', 'url', 'icon', 'position', 'parentId', 'show']}
                            emptyMessage="No customers found."
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
