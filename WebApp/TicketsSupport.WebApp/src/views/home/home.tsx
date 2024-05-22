import { useEffect, useState } from "react";
import { paths } from "../../routes/paths";
//redux
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
//components
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Knob } from "primereact/knob";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "primereact/badge";
//hooks
import { useTranslation } from "react-i18next";
import { useGet } from "../../services/api_services";
import { useNavigate } from "react-router-dom";
//models
import { ChartData, TicketsByProjectResponse } from "../../models/responses/stadistics.response";
import { TicketResponse } from "../../models/responses/ticket.response";
import { UserResponse } from "../../models/responses/users.response";
import { TicketStatusResponse } from "../../models/responses/ticketStatus.response";
import { TicketPriorityResponse } from "../../models/responses/ticketPriority.response";


export default function Home() {
    //hooks
    const navigate = useNavigate();
    const { t } = useTranslation();
    //Api Request
    const { SendGetRequest } = useGet();
    //Redux
    const language = useSelector((state: RootState) => state.language);
    //translations
    const TotalTxt = t("home.total");
    const TotalDescTxt = t("home.totalDesc");
    const OpenTxt = t("home.open");
    const OpenDescTxt = t("home.openDesc");
    const ClosedTxt = t("home.closed");
    const ClosedDescTxt = t("home.closedDesc");
    const PendingTxt = t("home.pending");
    const PendingDescTxt = t("home.pendingDesc");
    const StatusOpenTxt = t("tickets.status.open");
    const PercentageResolutionTxt = t("home.percentageResolution");
    const TicketsByStatusTxt = t("home.ticketsByStatus");
    const TableNoElements = t("common.table.noElements");
    const title = t('tickets.labels.title');
    const priority = t('tickets.labels.priority');
    const status = t('tickets.labels.status');
    const createBy = t('tickets.labels.createdBy');
    const dateCreated = t('tickets.labels.dateCreated');
    const statusOpen = t('tickets.status.open');
    const statusClosed = t('tickets.status.closed');
    const LastTicketCreated = t('home.lastTicketsCreated');
    const project = t('tickets.labels.project');
    const ticketsByProjectTxt = t('home.ticketsByProject');
    //links
    const EditTicketItemUrl = paths.TicketsWithId;
    //variables
    const [totalTickets, setTotalTickets] = useState<number | null>(null);
    const [ticketsPending, setTicketsPending] = useState<number | null>(null);
    const [ticketsOpen, setTicketsOpen] = useState<number | null>(null);
    const [ticketsClosed, setTicketsClosed] = useState<number | null>(null);
    const [resolutionPersentaje, setResolutionPersentaje] = useState<number>(0);
    const [chartTicketsStatusData, setChartTicketsStatusData] = useState({});
    const [chartTicketsStatusOptions, setChartTicketsStatusOptions] = useState({});
    const [chartTicketsByMonthData, setChartTicketsByMonthData] = useState({});
    const [chartTicketsByMonthOptions, setChartTicketsByMonthOptions] = useState({});
    const [lastTicketsCreated, setLastTicketsCreated] = useState<TicketResponse[] | null>(null);
    const [users, setUsers] = useState<UserResponse[] | null>(null);
    const [ticketsStatus, setTicketsStatus] = useState<TicketStatusResponse[] | null>(null);
    const [ticketsPriorities, setTicketsPriorities] = useState<TicketPriorityResponse[] | null>(null);
    const [ticketsByProject, setTicketsByProject] = useState<TicketsByProjectResponse[] | null>(null);

    //Request
    useEffect(() => {
        const requests = [
            SendGetRequest("v1/stadistics/tickets/total"),
            SendGetRequest("v1/stadistics/tickets/pending"),
            SendGetRequest("v1/stadistics/tickets/open"),
            SendGetRequest("v1/stadistics/tickets/closed"),
            SendGetRequest("v1/stadistics/tickets/status-chart"),
            SendGetRequest("v1/stadistics/tickets/month-chart"),
            SendGetRequest("v1/stadistics/tickets/last-created"),
            SendGetRequest("v1/users"),
            SendGetRequest("v1/ticket/status"),
            SendGetRequest("v1/ticket/priorities"),
            SendGetRequest("v1/stadistics/tickets/byproject"),
        ];

        requests.forEach((request) => {
            Promise.resolve(request)
                .then((response) => {
                    handleResponse(response);
                })
        })

        function handleResponse(response: { data: unknown, url: string }) {
            let ticketStatusChartData, ticketStatusChartOptions;
            let ticketMonthChartData, ticketMonthChartOptions;

            switch (response.url) {
                case "v1/stadistics/tickets/total":
                    setTotalTickets(response.data as number);
                    break;
                case "v1/stadistics/tickets/pending":
                    setTicketsPending(response.data as number);
                    break;
                case "v1/stadistics/tickets/open":
                    setTicketsOpen(response.data as number);
                    break;
                case "v1/stadistics/tickets/closed":
                    setTicketsClosed(response.data as number);
                    break;
                case "v1/stadistics/tickets/status-chart":
                    ticketStatusChartData = {
                        labels: (response.data as ChartData).labels.map((x) => x != null ? x : StatusOpenTxt),
                        datasets: [
                            {
                                data: (response.data as ChartData).data,
                            }
                        ]
                    };
                    ticketStatusChartOptions = {
                        cutout: '60%',
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    };

                    setChartTicketsStatusData(ticketStatusChartData);
                    setChartTicketsStatusOptions(ticketStatusChartOptions);
                    break;
                case "v1/stadistics/tickets/month-chart":
                    ticketMonthChartData = (response.data as ChartData[]).map(chart => ({
                        labels: chart?.labels,
                        datasets: chart?.name
                    }))
                    ticketMonthChartData = {
                        labels: (response.data as ChartData[])[0]?.labels.map(x => t(`months.${x}`)),
                        datasets: (response.data as ChartData[]).map(chart => ({
                            label: chart.name,
                            data: chart.data,
                            fill: false,
                            tension: 0.4
                        }))
                    }
                    ticketMonthChartOptions = {
                        maintainAspectRatio: false,
                        aspectRatio: 0.6,
                    };

                    if (!ticketMonthChartData.labels && ticketMonthChartData.datasets.length <= 0) {
                        ticketMonthChartData.labels = [''];
                        ticketMonthChartData.datasets = [{
                            label: '',
                            data: [0, 0, 0, 0, 0, 0, 0],
                            fill: false,
                            tension: 0.4
                        }]
                    }

                    setChartTicketsByMonthData(ticketMonthChartData);
                    setChartTicketsByMonthOptions(ticketMonthChartOptions);
                    break;
                case "v1/stadistics/tickets/last-created":
                    setLastTicketsCreated(response.data as TicketResponse[]);
                    break;
                case "v1/users":
                    setUsers(response.data as UserResponse[]);
                    break;
                case "v1/ticket/status":
                    setTicketsStatus(response.data as TicketStatusResponse[]);
                    break;
                case "v1/ticket/priorities":
                    setTicketsPriorities(response.data as TicketPriorityResponse[]);
                    break;
                case "v1/stadistics/tickets/byproject":
                    setTicketsByProject(response.data as TicketsByProjectResponse[]);
                    break;
                default:
                    break;
            }
        }
    }, []);

    //Process Data
    useEffect(() => {
        //Calculate Resolution Persentaje
        if (ticketsClosed && totalTickets) {
            const resolutionPersentaje = ((ticketsClosed / totalTickets)) * 100
            setResolutionPersentaje(parseFloat(resolutionPersentaje.toFixed(2)));
        }
    }, [ticketsClosed, totalTickets])

    const headerLastTicketsTable = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2 py-2">
            <span className="text-xl text-900 font-bold">{LastTicketCreated}</span>
        </div>
    );

    const TicketsCreateByTableTemplate = (rowData: { createBy: number }) => {
        const user = users?.find(x => rowData.createBy == x.id);

        return `${user?.firstName} ${user?.lastName}`;
    }

    const TicketsStatusTableTemplate = (rowData: { id: number, ticketStatusId: number }) => {
        if (lastTicketsCreated !== null && ticketsStatus !== null) {
            const status = ticketsStatus.find(x => x.id === rowData.ticketStatusId);
            const ticket = lastTicketsCreated.find(x => x.id === rowData.id);
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
        }
    }

    const TicketsDateTableTemplate = (rowData: { dateCreated: string }) => {
        const date = new Date(rowData.dateCreated)

        if (date && rowData.dateCreated) {
            if (language.code === "en") {
                return `${date.toLocaleDateString("en-US", { day: '2-digit', month: '2-digit', year: 'numeric' })} ${date.toLocaleTimeString("en-US")}`;
            }
            else if (language.code === "es") {
                return `${date.toLocaleDateString("es-GT", { day: '2-digit', month: '2-digit', year: 'numeric' })} ${date.toLocaleTimeString("es-GT")}`;
            }
        }
    }

    const TicketsPriorityTableTemplate = (rowData: { ticketPriorityId: number }) => {
        if (ticketsPriorities) {
            const priority = ticketsPriorities.find(x => x.id === rowData.ticketPriorityId);
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
    }

    const handleSelectionChange = (e: { value: { id: number } }) => {
        const url = EditTicketItemUrl.slice(0, EditTicketItemUrl.length - 3) + e.value.id;
        navigate(url, { replace: true });
    };

    const headerTicketsByProjectTable = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2 py-2">
            <span className="text-xl text-900 font-bold">{ticketsByProjectTxt}</span>
        </div>
    );

    return (
        <>
            <div className="grid mt-3">
                <div className="col-12 sm:col-3 lg:col-2">
                    <Card
                        title={TotalTxt}
                        subTitle={TotalDescTxt}
                        pt={{ root: { className: "h-full" }, content: { className: "py-0" }, title: { className: "font-semibold mb-0" }, subTitle: { className: "mb-0" } }}>
                        <h1 className="m-0 text-center text-6xl">
                            {
                                totalTickets != null
                                    ? totalTickets
                                    : <ProgressSpinner style={{ width: '30px', height: '30px' }} animationDuration=".5s" />
                            }
                        </h1>
                    </Card>
                </div>
                <div className="col-12 sm:col-3 lg:col-2">
                    <Card
                        title={OpenTxt}
                        subTitle={OpenDescTxt}
                        pt={{ root: { className: "h-full" }, content: { className: "py-0" }, title: { className: "font-semibold mb-0" }, subTitle: { className: "mb-0" } }}>
                        <h1 className="m-0 text-center text-6xl">
                            {
                                ticketsOpen != null
                                    ? ticketsOpen
                                    : <ProgressSpinner style={{ width: '30px', height: '30px' }} animationDuration=".5s" />
                            }
                        </h1>
                    </Card>
                </div>
                <div className="col-12 sm:col-3 lg:col-2">
                    <Card
                        title={ClosedTxt}
                        subTitle={ClosedDescTxt}
                        pt={{ root: { className: "h-full" }, content: { className: "py-0" }, title: { className: "font-semibold mb-0" }, subTitle: { className: "mb-0" } }}>
                        <h1 className="m-0 text-center text-6xl">
                            {
                                ticketsClosed != null
                                    ? ticketsClosed
                                    : <ProgressSpinner style={{ width: '30px', height: '30px' }} animationDuration=".5s" />
                            }
                        </h1>
                    </Card>
                </div>
                <div className="col-12 sm:col-3 lg:col-2">
                    <Card
                        title={PendingTxt}
                        subTitle={PendingDescTxt}
                        pt={{ root: { className: "h-full" }, content: { className: "py-0" }, title: { className: "font-semibold mb-0" }, subTitle: { className: "mb-0" } }}>
                        <h1 className="m-0 text-center text-6xl">
                            {
                                ticketsPending != null
                                    ? ticketsPending
                                    : <ProgressSpinner style={{ width: '30px', height: '30px' }} animationDuration=".5s" />
                            }
                        </h1>
                    </Card>
                </div>
                <div className="col-12 lg:col-4">
                    <Card pt={{ root: { className: "h-full" }, content: { className: "pt-1 pb-0 h-full" }, body: { className: "p-0 h-full" } }}>
                        <div className="grid mt-0">
                            <div className="col-6 flex justify-content-center">
                                <div>
                                    <Knob value={resolutionPersentaje} min={0} max={100} className="flex justify-content-center" />
                                    <p className="my-0">{PercentageResolutionTxt}</p>
                                </div>
                            </div>
                            <div className="col-6 flex justify-content-center align-items-center">
                                <div>
                                    <Chart type="doughnut" data={chartTicketsStatusData} options={chartTicketsStatusOptions} className="w-full h-6rem flex justify-content-center" />
                                    <p className="my-0">{TicketsByStatusTxt}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-12">
                    <Card>
                        <Chart type="line" data={chartTicketsByMonthData} options={chartTicketsByMonthOptions} />
                    </Card>
                </div>
                <div className="col-12 md:col-8">
                    <div className="card" style={{ backgroundColor: "#17212f5D" }}>
                        <DataTable
                            value={lastTicketsCreated as TicketResponse[]}
                            className="w-full"
                            size={"small"}
                            emptyMessage={TableNoElements}
                            selectionMode="single"
                            onSelectionChange={(e) => handleSelectionChange(e)}
                            header={headerLastTicketsTable}>
                            <Column field="id" header="Id"></Column>
                            <Column field="title" header={title}></Column>
                            <Column field="dateCreated" header={dateCreated} body={TicketsDateTableTemplate}></Column>
                            <Column field="createBy" header={createBy} body={TicketsCreateByTableTemplate}></Column>
                            <Column field="ticketStatusId" header={status} body={TicketsStatusTableTemplate}></Column>
                            <Column field="ticketPriorityId" header={priority} body={TicketsPriorityTableTemplate}></Column>
                        </DataTable>
                    </div>
                </div>
                <div className="col-12 md:col-4">
                    <div className="card" style={{ backgroundColor: "#17212f5D" }}>
                        <DataTable
                            value={ticketsByProject as TicketsByProjectResponse[]}
                            className="w-full"
                            size={"small"}
                            emptyMessage={TableNoElements}
                            header={headerTicketsByProjectTable}>
                            <Column field="project.name" header={project}></Column>
                            <Column field="total" header={TotalTxt}></Column>
                            <Column field="open" header={OpenTxt}></Column>
                            <Column field="closed" header={ClosedTxt}></Column>
                            <Column field="pending" header={PendingTxt}></Column>
                        </DataTable>
                    </div>
                </div>
            </div >
        </>
    );
}
