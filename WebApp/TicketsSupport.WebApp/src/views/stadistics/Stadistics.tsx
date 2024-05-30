//components
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
//hooks
import { useTranslation } from "react-i18next";
import { useGet } from "../../services/api_services";
import { Chart } from "primereact/chart";
import { ChartData } from "../../models/responses/stadistics.response";

function Stadistics() {

    //hooks
    const { SendGetRequest } = useGet();
    const { t } = useTranslation();
    const [totalTickets, setTotalTickets] = useState<number | null>(null);
    const [ticketsPending, setTicketsPending] = useState<number | null>(null);
    const [ticketsOpen, setTicketsOpen] = useState<number | null>(null);
    const [ticketsClosed, setTicketsClosed] = useState<number | null>(null);
    const [projectsAssigned, setProjectsAssigned] = useState<number | null>(null);
    const [ticketsClosedAVG, setTicketsClosedAVG] = useState<number | null>(null);
    const [chartTicketsClosedByMonthData, setChartTicketsClosedByMonthData] = useState({});
    const [chartTicketsClosedByMonthOptions, setChartTicketsClosedByMonthOptions] = useState({});

    //translations
    const TotalTxt = t("home.total");
    const TotalDescTxt = t("home.totalDesc");
    const OpenTxt = t("home.open");
    const OpenDescTxt = t("home.openDesc");
    const ClosedTxt = t("home.closed");
    const ClosedDescTxt = t("home.closedDesc");
    const PendingTxt = t("home.pending");
    const PendingDescTxt = t("home.pendingDesc");
    const ProjectsTxt = t("stadistics.projects");
    const ProjectsDescTxt = t("stadistics.projectDesc");
    const TicketClosedTimeTxt = t("stadistics.timeAVG");
    const TicketCloseTimeDescTxt = t("stadistics.timeAVGClose");
    const SatisfactionTxt = t("stadistics.satisfaction");
    const SatisfactionDescTxt = t("stadistics.satisfactionDesc");
    const TicketCloseByMonthTxt = t("stadistics.ticketCloseByMonth");
    const PageName = t("navigation.Stadistics");


    //Request
    useEffect(() => {
        const requests = [
            SendGetRequest("v1/stadistics/tickets/total"),
            SendGetRequest("v1/stadistics/tickets/pending"),
            SendGetRequest("v1/stadistics/tickets/open"),
            SendGetRequest("v1/stadistics/tickets/closed"),
            SendGetRequest("v1/stadistics/tickets/closed-average"),
            SendGetRequest("v1/stadistics/projects/total"),
            SendGetRequest("v1/stadistics/tickets/closed-month-chart"),
        ];

        requests.forEach((request) => {
            Promise.resolve(request)
                .then((response) => {
                    handleResponse(response);
                })
        })

        function handleResponse(response: { data: unknown, url: string }) {
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
                case "v1/stadistics/tickets/closed-average":
                    setTicketsClosedAVG(response.data as number);
                    break;
                case "v1/stadistics/projects/total":
                    setProjectsAssigned(response.data as number);
                    break;
                case "v1/stadistics/tickets/closed-month-chart":
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

                    setChartTicketsClosedByMonthData(ticketMonthChartData);
                    setChartTicketsClosedByMonthOptions(ticketMonthChartOptions);
                    break;
                default:
                    break;
            }
        }
    }, []);

    return (
        <div className="grid my-4">
            <div className="col-12 m-0 p-0">
                {/*Title*/}
                <div className="flex justify-content-between align-items-center mb-4">
                    <h2 className="my-0">{PageName}</h2>
                </div>
            </div>
            <div className="col-6">
                <div className="grid">
                    <div className="col-12 sm:col-6">
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
                    <div className="col-12 sm:col-6">
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
                    <div className="col-12 sm:col-6">
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
                    <div className="col-12 sm:col-6">
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
                    <div className="col-12 sm:col-6">
                        <Card
                            title={ProjectsTxt}
                            subTitle={ProjectsDescTxt}
                            pt={{ root: { className: "h-full" }, content: { className: "py-0" }, title: { className: "font-semibold mb-0" }, subTitle: { className: "mb-0" } }}>
                            <h1 className="m-0 text-center text-6xl">
                                {
                                    projectsAssigned != null
                                        ? projectsAssigned
                                        : <ProgressSpinner style={{ width: '30px', height: '30px' }} animationDuration=".5s" />
                                }
                            </h1>
                        </Card>
                    </div>
                    <div className="col-12 sm:col-6">
                        <Card
                            title={TicketClosedTimeTxt}
                            subTitle={TicketCloseTimeDescTxt}
                            pt={{ root: { className: "h-full" }, content: { className: "py-0" }, title: { className: "font-semibold mb-0" }, subTitle: { className: "mb-0" } }}>
                            <h1 className="m-0 text-center text-6xl">
                                {
                                    ticketsClosedAVG != null
                                        ? ticketsClosedAVG.toFixed(2) + " h"
                                        : <ProgressSpinner style={{ width: '30px', height: '30px' }} animationDuration=".5s" />
                                }
                            </h1>
                        </Card>
                    </div>

                    <div className="col-12">
                        <Card
                            title={SatisfactionTxt}
                            subTitle={SatisfactionDescTxt}
                            pt={{ root: { className: "h-full" }, content: { className: "py-0" }, title: { className: "font-semibold mb-0" }, subTitle: { className: "mb-0" } }}>
                            <h1 className="m-0 text-center text-6xl">
                                {
                                    ticketsClosedAVG != null
                                        ? ticketsClosedAVG.toFixed(2) + " h"
                                        : <ProgressSpinner style={{ width: '30px', height: '30px' }} animationDuration=".5s" />
                                }
                            </h1>
                        </Card>
                    </div>
                </div>
            </div>
            <div className="col-6">
                <Card title={TicketCloseByMonthTxt}>
                    <Chart type="line" data={chartTicketsClosedByMonthData} options={chartTicketsClosedByMonthOptions} />
                </Card>
            </div>

        </div>
    );
}

export default Stadistics;