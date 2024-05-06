import { useEffect, useRef, useState } from 'react'
import { paths } from '../../routes/paths';
//Components
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Badge } from 'primereact/badge';
import { Tooltip } from 'primereact/tooltip';
import { Nullable } from 'primereact/ts-helpers';
//Hooks
import { useGet } from '../../services/api_services';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useTokenData from '../../hooks/useTokenData';
//Models
import { MenusResponse } from '../../models/responses/menus.response';
import { ProjectResponse } from '../../models/responses/project.response';
import { TicketStatusResponse } from '../../models/responses/ticketStatus.response';
import { TicketTypeResponse } from '../../models/responses/ticketType.response';
import { TicketPriorityResponse } from '../../models/responses/ticketPriority.response';
import { TicketResponse } from '../../models/responses/ticket.response';
import { RootState } from '../../redux/store';
import { AuthToken } from '../../models/tokens/token.model';

export default function Tickets() {
    const [Tickets, setTickets] = useState<TicketResponse[]>([]);
    const [Projects, setProjects] = useState<ProjectResponse[]>([]);
    const [TicketPriorities, setTicketPriorities] = useState<TicketPriorityResponse[]>([]);
    const [TicketStatus, setTicketStatus] = useState<TicketStatusResponse[]>([]);
    const [TicketType, setTicketType] = useState<TicketTypeResponse[]>([]);

    //Redux
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);
    //Hooks
    const toast = useRef<Toast>(null);
    const { SendGetRequest, loadingGet } = useGet<MenusResponse[] | TicketResponse[]>();
    const navigate = useNavigate();
    //Translate
    const { t } = useTranslation();
    const TableTitle = t('tickets.tableTitle');
    const TableHeaderNew = t('tickets.labels.new');
    const title = t('tickets.labels.title');
    const project = t('tickets.labels.project');
    const priority = t('tickets.labels.priority');
    const type = t('tickets.labels.type');
    const status = t('tickets.labels.status');
    const dateCreated = t('tickets.labels.dateCreated');
    const dateUpdated = t('tickets.labels.dateUpdated');
    const statusOpen = t('tickets.status.open');
    const statusClosed = t('tickets.status.closed');
    //Links
    const NewItemUrl = paths.newTicket;
    const EditItemUrl = paths.editTicketWithId;

    //Send Request
    useEffect(() => {
        const requests = [
            SendGetRequest("v1/tickets"),
            SendGetRequest("v1/projects"),
            SendGetRequest("v1/ticket/priorities"),
            SendGetRequest("v1/ticket/status"),
            SendGetRequest("v1/ticket/types"),
        ];

        Promise.all(requests)
            .then((responses) => {
                responses.forEach((response) => {
                    switch (response.url) {
                        case "v1/tickets":
                            setTickets(response.data as TicketResponse[]);
                            break;
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
                        default:
                            break;
                    }
                });
            })
            .catch((error) => {
                console.error("Error en las solicitudes:", error);
            });
    }, [])

    //Table Filters
    const filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        title: { value: null, matchMode: FilterMatchMode.EQUALS },
        project: { value: null, matchMode: FilterMatchMode.EQUALS },
        type: { value: null, matchMode: FilterMatchMode.EQUALS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        priority: { value: null, matchMode: FilterMatchMode.EQUALS },
        dateCreated: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        dateUpdated: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    };

    const projectBodyTemplate = (rowData: { projectId: number; }) => {
        const project = Projects.find(x => x.id === rowData.projectId);
        return (
            <>
                <div className="flex align-items-center gap-2">
                    {project?.photo !== "" && project?.photo !== null ?
                        <img alt={project?.name} src={`data:image/*;base64,${project?.photo}`} width="32" />
                        :
                        <img alt={project?.name} src={`/src/assets/imgs/project-default.png`} width="32" />}
                    
                    <span>{project?.name}</span>
                </div>
            </>
        );
    };

    const projectItemTemplate = (option: { name: string, photo: string }) => {
        return (
            <>
                {option.photo !== null && option.photo !== "" ?
                    (
                        <div className="flex align-items-center gap-2">
                            <img alt={option.name} src={`data:image/*;base64,${option.photo}`} width="32" />
                            <span>{option.name}</span>
                        </div>
                    )
                    :
                    (
                        <>
                            <div className="flex align-items-center gap-2">
                                <img alt={option.name} src={`/src/assets/imgs/project-default.png`} width="32" />
                                <span>{option.name}</span>
                            </div>
                        </>
                    )}

            </>
        );
    };

    const typeBodyTemplate = (rowData: { ticketTypeId: number }) => {
        const type = TicketType.find(x => x.id === rowData.ticketTypeId);
        if (type) {
            return <>
                <i className={type?.icon + " ticketTooltip"} style={{ color: type?.iconColor }} data-pr-tooltip={type?.name} data-pr-position="right" />
            </>
        } else {
            return <>
                <Badge style={{ backgroundColor: '#bbb' }}></Badge>
            </>
        }
    };

    const statusBodyTemplate = (rowData: { ticketStatusId: number, id : number }) => {
        const status = TicketStatus.find(x => x.id === rowData.ticketStatusId);
        const ticket = Tickets.find(x => x.id === rowData.id);
        if (ticket?.isClosed === true) {
            return <>
                <Badge value={statusClosed} style={{ backgroundColor: '#808080' }}></Badge>
            </>
        }
        else if (status) {
            return <>
                <Badge value={status?.name} style={{ backgroundColor: status?.color }}></Badge>
            </>
        } else {
            return <>
                <Badge value={statusOpen} style={{ backgroundColor: '#008bff' }}></Badge>
            </>
        }

    };

    const priorityBodyTemplate = (rowData: { ticketPriorityId: number }) => {
        const priority = TicketPriorities.find(x => x.id === rowData.ticketPriorityId);
        if (priority) {
            return <>
                <Badge value={priority?.name} style={{ backgroundColor: priority?.color }}></Badge>
            </>
        } else {
            return <>
                <Badge style={{ backgroundColor: '#bbb' }}></Badge>
            </>
        }

    }

    const statusItemTemplate = (option: { name: string, color: string }) => {
        return <Badge value={option.name} style={{ backgroundColor: option.color }}></Badge>;
    };

    const priorityItemTemplate = (option: { icon: string, iconColor: string, name: string }) => {
        return <>
            <i className={option.icon} style={{ color: option.iconColor }}></i><span className='ml-2'>{option.name}</span>
        </>;
    }

    const projectRowFilterTemplate = (options: { value: string, filterApplyCallback: (value: number) => void }) => {
        return (
            <MultiSelect
                value={options.value}
                options={Projects}
                itemTemplate={projectItemTemplate}
                onChange={(e) => options.filterApplyCallback(e.value)}
                optionLabel="name"
                placeholder="Any"
                className="p-column-filter"
                maxSelectedLabels={1}
                style={{ minWidth: '10rem' }}
            />
        );
    };

    const statusRowFilterTemplate = (options: { value: number, filterApplyCallback(name: string): void }) => {
        const status = TicketStatus.find(x => x.id === options.value);
        return (
            <Dropdown value={status?.name} options={TicketStatus} onChange={(e) => options.filterApplyCallback(e.value?.name)} itemTemplate={statusItemTemplate} placeholder="Status" className="p-column-filter" showClear style={{ minWidth: '10rem' }} />
        );
    };

    const priorityRowFilterTemplate = (options: { value: { name: string }, filterApplyCallback: (value: { name: string }) => void }) => {
        return (
            <Dropdown value={options.value?.name} options={TicketPriorities} onChange={(e) => options.filterApplyCallback(e.value?.name)} itemTemplate={statusItemTemplate} placeholder="Type" className="p-column-filter" showClear style={{ minWidth: '10rem' }} />
        );
    }

    const TypeRowFilterTemplate = (options: { value: { name: string }, filterApplyCallback(name: string): void }) => {
        return (
            <Dropdown value={options.value?.name} options={TicketType} onChange={(e) => options.filterApplyCallback(e.value?.name)} itemTemplate={priorityItemTemplate} placeholder="Priority" className="p-column-filter" showClear style={{ minWidth: '10rem' }} />
        );
    }

    const dateFilterTemplate = (options: { value: Date, index: number, filterCallback(value: Nullable<Date>, index: number): void }) => {
        return <Calendar value={options?.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const dateCreatedBodyTemplate = (options: { dateCreated: string }) => {
        const date = new Date(options.dateCreated)

        if (date && options.dateCreated) {
            return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString("en-US")}`;
        } else {
            return ''
        }
    }

    const dateUpdatedBodyTemplate = (options: { dateUpdated: string }) => {
        const date = new Date(options.dateUpdated)

        if (date && options.dateUpdated) {
            return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString("en-US")}`;
        } else {
            return ''
        }
    }

    const TableHeader = () => {
        return (
            <div className="flex flex-wrap justify-content-between align-items-center gap-2 p-2" >
                {/* Table Title */}
                <span className='text-2xl text-white'>{TableTitle}</span>
                {/* Add new */}
                {getTokenData?.PermissionLevel === "Administrator" || getTokenData?.PermissionLevel === "User"?
                    <Link to={NewItemUrl}>
                        <Button icon="pi pi-plus" severity='success'>
                            <span className='pl-2'>{TableHeaderNew}</span>
                        </Button>
                    </Link>
                    : null}
            </div>
        )
    }

    const handleSelectionChange = (e: { value: { id: number } }) => {
        const url = EditItemUrl.slice(0, EditItemUrl.length - 3) + e.value.id;
        navigate(url, { replace: true });
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
                    <Tooltip target=".ticketTooltip" />
                    <div className="card" style={{ backgroundColor: "#17212f5D" }}>
                        <DataTable value={Tickets}
                            paginator
                            rows={10}
                            dataKey="id"
                            filters={filters}
                            filterDisplay="row"
                            header={TableHeader}
                            loading={loadingGet}
                            emptyMessage="No customers found."
                            selectionMode="single"
                            onSelectionChange={(e) => handleSelectionChange(e)}>
                            <Column field="title" header={title} filter style={{ minWidth: '18rem', maxWidth: '350px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} />
                            <Column header={project} filterField="projectId" showFilterMenu={false} filterMenuStyle={{ width: '11rem' }} style={{ maxWidth: '11rem' }}
                                body={projectBodyTemplate} filter filterElement={projectRowFilterTemplate} />
                            <Column field="ticketTypeId" header={type} showFilterMenu={false} filterMenuStyle={{ width: '5rem' }} style={{ maxWidth: '11rem' }} body={typeBodyTemplate} filter filterElement={TypeRowFilterTemplate} />
                            <Column field="ticketPriorityId" header={priority} showFilterMenu={false} filterMenuStyle={{ width: '5rem' }} style={{ maxWidth: '11rem' }} body={priorityBodyTemplate} filter filterElement={priorityRowFilterTemplate} />
                            <Column field="ticketStatusId" header={status} showFilterMenu={false} filterMenuStyle={{ width: '5rem' }} style={{ maxWidth: '11rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
                            <Column field="dateCreated" dataType="date" header={dateCreated} showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ maxWidth: '11rem' }} body={dateCreatedBodyTemplate} filter filterElement={dateFilterTemplate} />
                            <Column field="dateUpdated" dataType="date" header={dateUpdated} showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ maxWidth: '11rem' }} body={dateUpdatedBodyTemplate} filter filterElement={dateFilterTemplate} />
                        </DataTable>
                    </div>
                </>
            }

        </>
    )
}
