import { useEffect, useRef, useState } from 'react'
import { paths } from '../../routes/paths';
//Components
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Tooltip } from 'primereact/tooltip';
import { Editor } from 'primereact/editor';
import { Chip } from 'primereact/chip';
import { Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Card } from 'primereact/card';
import { ScrollPanel } from 'primereact/scrollpanel';
import { InputText } from 'primereact/inputtext';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { InputSwitch } from 'primereact/inputswitch';
//Hooks
import { useGet, usePost, usePut } from '../../services/api_services';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useTokenData from '../../hooks/useTokenData';
import useCustomForm from '../../hooks/useCustomForm';
//Models
import { MenusResponse } from '../../models/responses/menus.response';
import { ProjectResponse } from '../../models/responses/project.response';
import { TicketStatusResponse } from '../../models/responses/ticketStatus.response';
import { TicketTypeResponse } from '../../models/responses/ticketType.response';
import { TicketPriorityResponse } from '../../models/responses/ticketPriority.response';
import { TicketResponse } from '../../models/responses/ticket.response';
import { RootState } from '../../redux/store';
import { AuthToken } from '../../models/tokens/token.model';
import { UserResponse } from '../../models/responses/users.response';
import { TicketForm } from '../../models/forms/ticket.form';
import { BasicResponse, ErrorResponse, ErrorsResponse } from '../../models/responses/basic.response';
import { TicketRequest } from '../../models/requests/ticket.request';

export default function Tickets() {
    const { id } = useParams();
    const [Tickets, setTickets] = useState<TicketResponse[]>([]);
    const [TicketsFiltered, setTicketsFiltered] = useState<TicketResponse[]>([]);
    const [Projects, setProjects] = useState<ProjectResponse[]>([]);
    const [TicketPriorities, setTicketPriorities] = useState<TicketPriorityResponse[]>([]);
    const [TicketStatus, setTicketStatus] = useState<TicketStatusResponse[]>([]);
    const [TicketType, setTicketType] = useState<TicketTypeResponse[]>([]);
    const [Users, setUsers] = useState<UserResponse[]>([]);
    const [TicketSelected, setTicketSelected] = useState<TicketResponse>();
    const [TicketReplySelected, setTicketReplySelected] = useState<TicketResponse[]>();
    const [TicketReplyDesc, setTicketReplyDesc] = useState<string>();
    const [TicketSearch, setTicketSearch] = useState<string>();
    //Form
    const { control, ErrorMessageHtml, errors, reset, setValue, getValues } = useCustomForm<TicketForm>({ Title: '', Description: '', Priority: null, Project: null, Status: null, Type: null, });
    //Redux
    const authenticated = useSelector((state: RootState) => state.auth);
    const language = useSelector((state: RootState) => state.language);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);
    //Hooks
    const toast = useRef<Toast>(null);
    const tooltipRef = useRef<Tooltip | null>(null);
    const { SendGetRequest } = useGet<MenusResponse[] | TicketResponse[]>();
    const { SendPutRequest, putResponse, loadingPut, errorPut, httpCodePut } = usePut<BasicResponse>();
    const { SendPostRequest, postResponse, errorPost, loadingPost, httpCodePost } = usePost<BasicResponse>();
    //Translate
    const { t } = useTranslation();
    const TableHeaderNew = t('tickets.labels.new');
    const dateCreated = t('tickets.labels.dateCreated');
    const dateUpdated = t('tickets.labels.dateUpdated');
    const statusOpen = t('tickets.status.open');
    const statusClosed = t('tickets.status.closed');
    const PageName = t("navigation.Tickets");
    const ErrorRequired = t('errors.required');
    const CardTitle = t("common.cardTitles.new", { 0: t("element.ticket") });
    const CardButtonUpdated = t('buttons.updated');
    const CardFormProject = t("tickets.labels.project");
    const CardFormType = t("tickets.labels.type");
    const CardFormPriority = t("tickets.labels.priority");
    const CardFormStatus = t("tickets.labels.status");
    const CardFormClosed = t("tickets.labels.closed");
    const replyTxt = t("tickets.labels.reply");
    const detailsTxt = t("tickets.labels.details");
    const createByTxt = t("tickets.labels.createdBy")
    const emailTxt = t("users.labels.email");
    const phoneTxt = t("users.labels.phone");
    const deviceInfoTxt = t("tickets.labels.deviceInfo");
    const browserTxt = t("tickets.labels.browser");
    const optionsTxt = t("tickets.labels.options");
    const replyToTxt = t("tickets.labels.replyTo");
    const replyTitleTxt = t("tickets.labels.replyTitle");
    const searchTxt = t("tickets.labels.search");

    //Links
    const NewItemUrl = paths.newTicket;

    //Send Request
    useEffect(() => {
        const requests = [
            SendGetRequest("v1/tickets"),
            SendGetRequest("v1/projects"),
            SendGetRequest("v1/ticket/priorities"),
            SendGetRequest("v1/ticket/status"),
            SendGetRequest("v1/ticket/types"),
            SendGetRequest("v1/ticket/types"),
            SendGetRequest("v1/users"),
        ];

        requests.forEach((request) => {
            Promise.resolve(request)
                .then((response) => {
                    let tickets;
                    switch (response.url) {
                        case "v1/tickets":
                            tickets = (response.data as TicketResponse[]).map((value) => (
                                {
                                    id: value.id,
                                    title: value.title,
                                    projectId: value.projectId,
                                    description: value.description,
                                    ticketPriorityId: value.ticketPriorityId,
                                    ticketStatusId: value.ticketStatusId,
                                    ticketTypeId: value.ticketTypeId,
                                    dateCreated: new Date(value.dateCreated),
                                    dateUpdated: new Date(value.dateUpdated),
                                    createBy: value.createBy,
                                    closedBy: value.closedBy,
                                    isClosed: value.isClosed,
                                    browser: value.browser,
                                    ip: value.ip,
                                    os: value.os,
                                    dateClosed: new Date(value.dateClosed),
                                    lastUpdatedBy: value.lastUpdatedBy,
                                    reply: value.reply
                                }
                            ));

                            setTickets(tickets);
                            setTicketsFiltered(tickets);
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
                        case "v1/users":
                            setUsers(response.data as UserResponse[]);
                            break;
                        default:
                            break;
                    }
                })
        })
    }, [])

    //Load ticket with id
    useEffect(() => {
        if (id) {
            const idNbr = parseInt(id);
            const ticketSelected = Tickets.find(x => x.id == idNbr);
            const ticketCards = document.querySelectorAll('.ticket-card');

            if (ticketSelected) {
                const ticketCard = Array.from(ticketCards).find(card => {
                    const paragraphs = card.querySelectorAll('p');
                    return Array.from(paragraphs).some(p => p.textContent?.trim() === `#${ticketSelected.id}`);
                });

                if (ticketCard)
                    handlerTicketClick(ticketCard, ticketSelected)
            }
        }
    }, [id, Tickets])

    //Update Ticket Toast
    useEffect(() => {
        if (httpCodePut === 200) {
            const { message } = putResponse as BasicResponse;
            toast?.current?.show({ severity: 'success', summary: CardTitle, detail: message, life: 3000 });
            reset();
            setTimeout(() => SendGetRequest("v1/tickets").then((response) => {
                setTickets((response.data as TicketResponse[]).map((value) => (
                    {
                        id: value.id,
                        title: value.title,
                        projectId: value.projectId,
                        description: value.description,
                        ticketPriorityId: value.ticketPriorityId,
                        ticketStatusId: value.ticketStatusId,
                        ticketTypeId: value.ticketTypeId,
                        dateCreated: new Date(value.dateCreated),
                        dateUpdated: new Date(value.dateUpdated),
                        createBy: value.createBy,
                        closedBy: value.closedBy,
                        isClosed: value.isClosed,
                        browser: value.browser,
                        ip: value.ip,
                        os: value.os,
                        dateClosed: new Date(value.dateClosed),
                        lastUpdatedBy: value.lastUpdatedBy,
                        reply: value.reply
                    }
                )));

                const TicketInfoContainer: HTMLDivElement | null = document.querySelector("#ticketInfo");
                const TicketDataContainer: HTMLDivElement | null = document.querySelector("#ticketData");
                const TicketsCard: NodeListOf<HTMLDivElement> = document.querySelectorAll(".ticket-card");

                if (TicketInfoContainer) {
                    TicketInfoContainer.style.setProperty("display", "none", "important");
                    TicketInfoContainer.style.setProperty("opacity", "0", "important");
                }

                if (TicketDataContainer) {
                    TicketDataContainer.style.setProperty("display", "none", "important");
                    TicketDataContainer.style.setProperty("opacity", "0", "important");
                }

                TicketsCard.forEach((card) => {
                    card.style.setProperty("background-color", "#fff");
                });

            }), 3000);
        } else {
            let errorResponse = errorPut;
            if (errorResponse) {
                if (typeof (errorResponse as ErrorResponse | ErrorsResponse).details === "string") // String Details
                {
                    errorResponse = errorResponse as ErrorResponse;
                    toast?.current?.show({
                        severity: 'error', summary: CardTitle, detail: errorResponse.details, life: 3000
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
                    toast?.current?.show({ severity: 'error', summary: CardTitle, detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
                }
            }
        }



    }, [errorPut, httpCodePut, putResponse])

    //Reply Ticket Toast
    useEffect(() => {
        let errorResponse = errorPost;
        if (httpCodePost !== 200) {
            if (errorResponse) {
                if (typeof (errorResponse as ErrorResponse | ErrorsResponse).details === "string") // String Details
                {
                    errorResponse = errorResponse as ErrorResponse;
                    toast?.current?.show({
                        severity: 'error', summary: CardTitle, detail: errorResponse.details, life: 3000
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
                    toast?.current?.show({ severity: 'error', summary: CardTitle, detail: <ul id='errors-toast' className='pl-0'>{errorsHtml}</ul>, life: 50000 });
                }
            }
        } else {
            const { message } = postResponse as BasicResponse;
            toast?.current?.show({ severity: 'success', summary: replyTitleTxt, detail: message, life: 3000 });
            reset();
        }

    }, [errorPost, httpCodePost, postResponse])

    useEffect(() => {
        const fetchReplies = async () => {
            const TicketsSelectedReplyIds = Tickets.filter(x => x.reply === TicketSelected?.id).map(x => x.id);
            const TicketSelectedReply: TicketResponse[] = [];

            // Crear un array de promesas de las solicitudes
            const promises = TicketsSelectedReplyIds.map(id =>
                SendGetRequest("v1/tickets/" + id).then(response => {
                    TicketSelectedReply.push({
                        id: response.data.id,
                        title: response.data.title,
                        projectId: response.data.projectId,
                        description: response.data.description,
                        ticketPriorityId: response.data.ticketPriorityId,
                        ticketStatusId: response.data.ticketStatusId,
                        ticketTypeId: response.data.ticketTypeId,
                        dateCreated: new Date(response.data.dateCreated),
                        dateUpdated: new Date(response.data.dateUpdated),
                        createBy: response.data.createBy,
                        closedBy: response.data.closedBy,
                        isClosed: response.data.isClosed,
                        browser: response.data.browser,
                        ip: response.data.ip,
                        os: response.data.os,
                        dateClosed: new Date(response.data.dateClosed),
                        lastUpdatedBy: response.data.lastUpdatedBy,
                        reply: response.data.reply
                    });
                })
            );

            await Promise.resolve(promises);

            const sortedReplies = TicketSelectedReply.sort((a, b) => a.id - b.id);

            // Actualizar el estado con la lista ordenada
            setTicketReplySelected(sortedReplies);
        };

        fetchReplies();
    }, [Tickets, TicketSelected]);

    //Search
    useEffect(() => {
        if (TicketSearch && TicketSearch !== "") {
            const ticketFiltered = Tickets.filter(x =>
                x.title.toLowerCase().includes(TicketSearch.toLowerCase()) ||
                x.id.toString().includes(TicketSearch)
            );
            setTicketsFiltered(ticketFiltered);
        } else {
            setTicketsFiltered(Tickets);
        }
    }, [TicketSearch, Tickets]);




    const GetTicketTypeIcon = (ticketTypeId: number | undefined) => {
        const type = TicketType.find(x => x.id === ticketTypeId);
        if (type) {
            return <>
                <i className={type?.icon + " tooltip"} style={{ color: type?.iconColor, fontSize: "1.25rem" }} data-pr-tooltip={type?.name} data-pr-position="right" />
            </>
        } else {
            return <>
                <Badge style={{ backgroundColor: '#bbb' }}></Badge>
            </>
        }
    };

    const GetTicketStatusBadge = (ticketStatusId: number | undefined, ticketId: number | undefined, size: "large" | "xlarge" | "normal" | null | undefined = "normal") => {
        const status = TicketStatus.find(x => x.id === ticketStatusId);
        const ticket = Tickets.find(x => x.id === ticketId);
        if (ticket?.isClosed === true) {
            return <>
                <Badge value={statusClosed} style={{ backgroundColor: '#808080' }} size={size}></Badge>
            </>
        }
        else if (status) {
            return <>
                <Badge value={status?.name} style={{ backgroundColor: status?.color }} size={size}></Badge>
            </>
        } else {
            return <>
                <Badge value={statusOpen} style={{ backgroundColor: '#008bff' }} size={size}></Badge>
            </>
        }

    };

    const GetTicketPriorityBadge = (ticketPriorityId: number | undefined) => {
        const priority = TicketPriorities.find(x => x.id === ticketPriorityId);
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

    const timeAgo = (date: string | Date) => {
        if (date instanceof Date) {
            const now = new Date();
            const secondsPast = (now.getTime() - date.getTime()) / 1000;

            if (secondsPast < 60) {
                return `${Math.floor(secondsPast)} s`;
            } else if (secondsPast < 3600) {
                return `${Math.floor(secondsPast / 60)} m`;
            } else if (secondsPast < 86400) {
                return `${Math.floor(secondsPast / 3600)} h`;
            } else if (secondsPast < 2592000) { // 30 días aproximadamente
                return `${Math.floor(secondsPast / 86400)} d`;
            } else if (secondsPast < 31536000) { // 12 meses aproximadamente
                return `${Math.floor(secondsPast / 2592000)} M`;
            } else {
                return `${Math.floor(secondsPast / 31536000)} y`;
            }
        } else
            return "";

    }

    const getPhotoUser = (users: UserResponse[], userId: number | undefined | null) => {
        const user = users.find(x => x.id === userId);
        return user?.photo ? user.photo : "/src/assets/imgs/avatar-default.png";
    };

    const getPhotoProject = (projects: ProjectResponse[], ProjectId: number | undefined | null) => {
        const user = projects.find(x => x.id === ProjectId);
        return user?.photo ? user.photo : "/src/assets/imgs/project-default.png";
    };

    const handlerTicketClick = (event: React.MouseEvent<HTMLDivElement> | Element | null, ticket: TicketResponse) => {
        const TicketInfoContainer: HTMLDivElement | null = document.querySelector("#ticketInfo");
        const TicketDataContainer: HTMLDivElement | null = document.querySelector("#ticketData");
        const TicketsCard: NodeListOf<HTMLDivElement> = document.querySelectorAll(".ticket-card");

        if (TicketInfoContainer) {
            TicketInfoContainer.style.setProperty("display", "flex", "important");
            TicketInfoContainer.style.setProperty("opacity", "1", "important");
        }

        if (TicketDataContainer && window.innerWidth > 1400) {
            TicketDataContainer.style.setProperty("display", "flex", "important");
            TicketDataContainer.style.setProperty("opacity", "1", "important");
        }

        const requests = [
            SendGetRequest("v1/tickets/" + ticket.id)
        ]

        requests.forEach((request) => {
            Promise.resolve(request)
                .then((response) => {
                    switch (response.url) {
                        case "v1/tickets/" + ticket.id:
                            setTicketSelected({
                                id: (response.data as TicketResponse).id,
                                title: (response.data as TicketResponse).title,
                                projectId: (response.data as TicketResponse).projectId,
                                description: (response.data as TicketResponse).description,
                                ticketPriorityId: (response.data as TicketResponse).ticketPriorityId,
                                ticketStatusId: (response.data as TicketResponse).ticketStatusId,
                                ticketTypeId: (response.data as TicketResponse).ticketTypeId,
                                dateCreated: new Date((response.data as TicketResponse).dateCreated),
                                dateUpdated: new Date((response.data as TicketResponse).dateUpdated),
                                dateClosed: new Date((response.data as TicketResponse).dateClosed),
                                createBy: (response.data as TicketResponse).createBy,
                                closedBy: (response.data as TicketResponse).closedBy,
                                lastUpdatedBy: (response.data as TicketResponse).lastUpdatedBy,
                                isClosed: (response.data as TicketResponse).isClosed,
                                ip: (response.data as TicketResponse).ip,
                                os: (response.data as TicketResponse).os,
                                browser: (response.data as TicketResponse).browser,
                                reply: (response.data as TicketResponse).reply
                            });

                            setValue("Project", (response.data as TicketResponse).projectId);
                            setValue("Type", (response.data as TicketResponse).ticketTypeId);
                            setValue("Priority", (response.data as TicketResponse).ticketPriorityId);
                            setValue("Status", (response.data as TicketResponse).ticketStatusId);
                            setValue("Closed", (response.data as TicketResponse).isClosed);
                            break;
                    }
                });
        });
        //Change background to white
        TicketsCard.forEach((card) => {
            card.style.setProperty("background-color", "#fff");
        });

        //Change background card clicked
        if (event)
            if (event instanceof Element) {
                const element = event as HTMLDivElement;
                element.style?.setProperty("background-color", "#e7fafd");
            }
            else
                event.currentTarget.style.setProperty("background-color", "#e7fafd");
    }

    const handlerReplyClick = () => {
        const replyEditor: HTMLDivElement | null = document.querySelector("#ticketReply");

        if (replyEditor)
            replyEditor.style.setProperty("display", "flex", "important");
    }

    const handlerReplyCancelClick = () => {
        const replyEditor: HTMLDivElement | null = document.querySelector("#ticketReply");

        if (replyEditor)
            replyEditor.style.setProperty("display", "none", "important");
    }

    const handlerReplySend = async () => {
        const replyEditor: HTMLDivElement | null = document.querySelector("#ticketReply");

        if (TicketSelected != null && TicketReplyDesc != null) {
            const ticketPriorityId = getValues("Priority");
            const ticketStatusId = getValues("Status");

            const TicketRequest: TicketRequest = {
                title: TicketSelected.title,
                description: TicketReplyDesc,
                projectId: TicketSelected.projectId,
                ticketTypeId: TicketSelected.ticketTypeId,
                ticketPriorityId: ticketPriorityId != null ? ticketPriorityId : undefined,
                ticketStatusId: ticketStatusId != null ? ticketStatusId : undefined,
                reply: TicketSelected?.id,
                isClosed: false
            };

            const TicketReplyResponse = await SendPostRequest("v1/tickets/reply", TicketRequest);


            if ((TicketReplyResponse.data as BasicResponse).success == true) {
                //Hide editor
                if (replyEditor)
                    replyEditor.style.setProperty("display", "none", "important");

                //Editor text clear
                setTicketReplyDesc("");

                //Refresh all tickets
                const tickets = await SendGetRequest("v1/tickets");

                setTickets((tickets.data as TicketResponse[]).map((value) => ({
                    id: value.id,
                    title: value.title,
                    projectId: value.projectId,
                    description: value.description,
                    ticketPriorityId: value.ticketPriorityId,
                    ticketStatusId: value.ticketStatusId,
                    ticketTypeId: value.ticketTypeId,
                    dateCreated: new Date(value.dateCreated),
                    dateUpdated: new Date(value.dateUpdated),
                    createBy: value.createBy,
                    closedBy: value.closedBy,
                    isClosed: value.isClosed,
                    browser: value.browser,
                    ip: value.ip,
                    os: value.os,
                    dateClosed: new Date(value.dateClosed),
                    lastUpdatedBy: value.lastUpdatedBy,
                    reply: value.reply
                })))
            }

        }
    }

    const handlerUpdatedValuesClick = () => {

        const ticketTypeId = getValues("Type");
        const projectId = getValues("Project");
        const ticketPriorityId = getValues("Priority");
        const ticketStatusId = getValues("Status");

        const TicketRequest: TicketRequest = {
            title: getValues("Title"),
            description: getValues("Description"),
            projectId: projectId ? projectId : 0,
            ticketTypeId: ticketTypeId ? ticketTypeId : 0,
            ticketPriorityId: ticketPriorityId ? ticketPriorityId : undefined,
            ticketStatusId: ticketStatusId ? ticketStatusId : undefined,
            isClosed: getValues("Closed")
        };

        SendPutRequest("v1/tickets/" + TicketSelected?.id, TicketRequest)
    }

    const handlerClosedTicketInfoMobile = () => {
        const ticketInfo: HTMLDivElement | null = document.querySelector("#ticketInfo");

        if (ticketInfo)
            ticketInfo.style.setProperty("display", "none", "important")
    }

    const handlerClosedTicketDataMobile = () => {
        const ticketData: HTMLDivElement | null = document.querySelector("#ticketData");

        if (ticketData)
            ticketData.style.setProperty("display", "none", "important")
    }

    const handlerShowTicketOptionsMobile = () => {
        const ticketData: HTMLDivElement | null = document.querySelector("#ticketData");

        if (ticketData)
            ticketData.style.setProperty("display", "flex", "important")
    }

    return (
        <>
            <>
                <Toast ref={toast} />
                <Tooltip ref={tooltipRef} target=".tooltip" position={'bottom'} />
                <div
                    className="grid mt-2"
                    style={{ height: "calc(100dvh - 80px)" }}>
                    <div className="col-12 xl:col-3 h-full">
                        <Card
                            pt={{
                                root: { className: "h-full" },
                                body: { className: "h-full px-0" },
                                content: { className: "h-full p-0" },
                            }}>
                            {/*Title*/}
                            <div className="flex justify-content-between mb-4 px-3">
                                <h2 className="my-0">{PageName}</h2>
                                {getTokenData?.permissionLevel === "Administrator" || getTokenData?.permissionLevel === "User"
                                    ? <Link to={NewItemUrl}>
                                        <Button icon="pi pi-plus" severity='success' size={'small'}>
                                            <span className='pl-2'>{TableHeaderNew}</span>
                                        </Button>
                                    </Link>
                                    : null}
                            </div>
                            {/*Ticket Search*/}
                            <div className="flex w-full px-3 border-bottom-1 border-gray-200 pb-3">
                                <div className="w-full">
                                    <IconField iconPosition="left">
                                        <InputIcon className="pi pi-search"> </InputIcon>
                                        <InputText
                                            value={TicketSearch}
                                            onChange={(e) => { setTicketSearch(e.currentTarget.value) }}
                                            className="w-full"
                                            placeholder={searchTxt} />
                                    </IconField>
                                </div>
                            </div>
                            {/*All Tickets Scroll*/}
                            <ScrollPanel
                                className="w-full"
                                style={{ width: '100%', height: 'calc(100% - 100px)' }}>
                                {TicketsFiltered.filter(x => x.reply == null).map((ticket, index) => {
                                    if (tooltipRef.current) {
                                        tooltipRef.current.updateTargetEvents();
                                    }
                                    return <div
                                        key={`${ticket.title}${index}`}
                                        className="ticket-card flex w-full px-3"
                                        onClick={(e) => handlerTicketClick(e, ticket)}>

                                        <div className="grid m-0 w-full border-bottom-1 border-gray-200 py-2">
                                            <div className="col-12 flex align-items-center p-0 pb-2 mt-1">
                                                <div className="w-11 flex align-items-center gap-3">
                                                    <Avatar image={getPhotoProject(Projects, ticket.projectId)} size={'normal'}></Avatar>
                                                    <p className="font-bold text-lg m-0">{(() => {
                                                        const user = Users.find(x => x.id == ticket.createBy)
                                                        return `${user?.firstName} ${user?.lastName}`
                                                    })()}</p>
                                                </div>
                                                <div className="w-1 flex align-items-center justify-content-end gap-3">
                                                    <p className="m-0">{timeAgo(ticket.dateCreated)}</p>
                                                </div>
                                            </div>
                                            <div className="col-12 flex align-items-center p-0 pb-2 mt-1">
                                                <div className="w-11 flex align-items-center">
                                                    <p className="text-lg m-0 white-space-nowrap overflow-hidden text-overflow-ellipsis">{ticket.title}</p>
                                                </div>
                                                <div className="w-1 flex justify-content-end align-items-center">
                                                    {GetTicketTypeIcon(ticket.ticketTypeId)}
                                                </div>
                                            </div>
                                            <div className="col-12 flex align-items-center p-0 mb-1">
                                                <div className="w-10 flex align-items-center gap-2">
                                                    {GetTicketStatusBadge(ticket.ticketStatusId, ticket.id)}
                                                    {GetTicketPriorityBadge(ticket.ticketPriorityId)}
                                                </div>
                                                <div className="w-2 flex justify-content-end align-items-center">
                                                    <p className="text-sm text-gray-400 font-semibold m-0">{`#${ticket.id}`}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                })}
                            </ScrollPanel>
                        </Card>
                    </div>
                    {/*Ticket Info*/}
                    <div
                        id="ticketInfo"
                        style={{ height: 'calc(100dvh - 80px)' }}
                        className="col-12 absolute z-1 right-0 top-0 h-full hidden opacity-0 xl:relative  xl:col-6 transition-duration-300">
                        <Card
                            pt={{
                                root: { className: "h-full w-full relative" },
                                body: { className: "h-full py-0" },
                                title: { className: "font-semibold" },
                                content: { className: "h-full pt-2 pb-0 px-2" },
                            }}>
                            {/*Header*/}
                            <div className="grid align-items-center border-bottom-1 border-gray-200 mt-2">
                                <div className="col-10">
                                    <p className="text-3xl font-bold m-0">{TicketSelected?.title}</p>
                                </div>
                                <div className="col-2 py-0 flex justify-content-end">
                                    {
                                        (() => {
                                            const badge = GetTicketStatusBadge(TicketSelected?.ticketStatusId, TicketSelected?.id, "large");
                                            return badge;
                                        })()
                                    }
                                </div>
                                <div className="col-12 flex pt-0 pb-2">
                                    <Button
                                        icon="pi pi-reply"
                                        className="text-xs"
                                        label={replyTxt}
                                        severity="info"
                                        size={'small'}
                                        outlined
                                        onClick={() => handlerReplyClick()} />
                                </div>
                            </div>
                            {/*Ticket*/}
                            <ScrollPanel className="w-full" style={{ height: 'calc(100% - 135px)' }}>
                                <div className="flex gap-2 my-2">
                                    {/*Avatar */}
                                    <div className="flex align-items-center">
                                        <Avatar
                                            image={getPhotoUser(Users, TicketSelected?.createBy)}
                                            size="large"
                                        />

                                    </div>
                                    {/*User and Date*/}
                                    <div className="flex flex-column justify-content-center">
                                        <p className="text-xl my-0">{`${Users.find(x => x.id == TicketSelected?.createBy)?.firstName} ${Users.find(x => x.id == TicketSelected?.createBy)?.lastName}`}</p>
                                        <p className="text-xs my-0">{TicketSelected?.dateCreated.toLocaleString(language.code, {
                                            day: 'numeric',
                                            month: 'long',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                        })
                                        }</p>
                                    </div>
                                </div>
                                {/*Description*/}
                                <div className="grid mx-0 px-0">
                                    <div className="col-12">
                                        <Editor
                                            value={TicketSelected?.description}
                                            readOnly
                                            className="w-full"
                                            showHeader={false}
                                            pt={{ content: { className: "border-0" } }} />
                                    </div>
                                </div>
                                {TicketReplySelected?.map((ticket, index) => {
                                    return <div key={`${ticket.id}${index}`}>
                                        <Divider />
                                        <div className="flex gap-2 my-2">
                                            {/*Avatar */}
                                            <div className="flex align-items-center">
                                                <Avatar image={getPhotoUser(Users, TicketSelected?.createBy)} size="large"></Avatar>
                                            </div>
                                            {/*User and Date*/}
                                            <div className="flex flex-column justify-content-center">
                                                <p className="text-xl my-0">{`${Users.find(x => x.id == ticket?.createBy)?.firstName} ${Users.find(x => x.id == ticket?.createBy)?.lastName}`}</p>
                                                <p className="text-xs my-0">{ticket?.dateCreated.toLocaleString(language.code, {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: true,
                                                })
                                                }</p>
                                            </div>
                                        </div>
                                        {/*Description*/}
                                        <div className="grid mx-0 px-0">
                                            <div className="col-12">
                                                <Editor
                                                    value={ticket?.description}
                                                    readOnly
                                                    className="w-full"
                                                    showHeader={false}
                                                    pt={{ content: { className: "border-0" } }} />
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </ScrollPanel>
                            {/*Ticket Reply*/}
                            <div
                                id="ticketReply"
                                className="hidden fixed lg:absolute z-5 bottom-0 left-0 bg-white flex-column align-items-center w-full" style={{ height: "45%" }}>
                                <Card
                                    className="h-full w-full"
                                    style={{ boxShadow: "0px -5px 13px -7px rgba(0,0,0,0.48)" }}
                                    pt={{
                                        body: { className: "h-full pt-0" },
                                        content: { className: "h-full pt-1 pb-8 lg:pb-6 relative" }
                                    }}>
                                    {/*To*/}
                                    <div className="flex align-items-center my-2 gap-3 relative">
                                        <Avatar image={getPhotoUser(Users, parseInt(getTokenData?.id ?? '0'))} size={'large'}></Avatar>
                                        <p>{replyToTxt}:</p>
                                        <Chip label={`${Users.find(x => x.id == TicketSelected?.createBy)?.firstName} ${Users.find(x => x.id == TicketSelected?.createBy)?.lastName} (${Users.find(x => x.id == TicketSelected?.createBy)?.email})`} />
                                        <Button
                                            className="absolute right-0"
                                            rounded
                                            text
                                            severity="danger"
                                            size={'small'}
                                            icon="pi pi-times"
                                            onClick={() => handlerReplyCancelClick()}
                                        />
                                    </div>
                                    {/*Editor*/}
                                    <div className="flex w-full" style={{ height: "calc(100% - 55px)" }}>
                                        <Editor
                                            value={TicketReplyDesc}
                                            id="replyEditor"
                                            className=" p-0 m-0 h-full w-full"
                                            onTextChange={(e) => setTicketReplyDesc(e.htmlValue != null ? e.htmlValue : "")} />
                                        <Button
                                            icon="pi pi-send"
                                            label="Send"
                                            severity={"success"}
                                            className="absolute bottom-0 right-0 mb-2 mr-4"
                                            loading={loadingPost}
                                            onClick={() => handlerReplySend()} />
                                    </div>

                                </Card>
                            </div>
                        </Card>
                        {/*Buton mobile close ticket info*/}
                        <Button
                            icon="pi pi-angle-double-left"
                            className="fixed z-1 left-0 bg-white lg:hidden"
                            size={"small"}
                            text
                            raised
                            style={{ top: "50%", transform: "translateY(-50%)" }}
                            onClick={() => handlerClosedTicketInfoMobile()} />
                        {/*Buton mobile show ticket options*/}
                        <Button
                            icon="pi pi-spin pi-cog"
                            className="fixed z-1 right-0 bg-white lg:hidden"
                            size={"small"}
                            text
                            raised
                            style={{ top: "50%", transform: "translateY(-50%)" }}
                            onClick={() => handlerShowTicketOptionsMobile()} />
                    </div>
                    {/*Ticket Details and Change*/}
                    <div
                        id="ticketData"
                        className="col-12  hidden absolute z-1 left-0 bg-white top-0 lg:col-3 lg:relative lg:surface-ground lg:flex flex-column opacity-0 transition-duration-300 justify-content-between">
                        <Card
                            pt={{
                                body: { className: "py-1" },
                                content: { className: "py-0" },
                            }}>
                            {/*Ticket Details*/}
                            <p className="text-xl font-bold">{detailsTxt}</p>
                            <div className="grid">
                                <div className="col-3">{createByTxt}</div>
                                <div className="col-9 text-right">{`${Users.find(x => x.id === TicketSelected?.createBy)?.firstName} ${Users.find(x => x.id === TicketSelected?.createBy)?.lastName}`}</div>
                                <div className="col-3">{emailTxt}</div>
                                <div className="col-9 text-right">{Users.find(x => x.id === TicketSelected?.createBy)?.email}</div>
                                <div className="col-3">{phoneTxt}</div>
                                <div className="col-9 text-right">{Users.find(x => x.id === TicketSelected?.createBy)?.phone}</div>
                                <div className="col-5">{dateCreated}</div>
                                <div className="col-7 text-right flex align-items-center justify-content-end">{TicketSelected?.dateCreated.toLocaleString(language.code)}</div>
                                <div className="col-5">{dateUpdated}</div>
                                <div className="col-7 text-right flex align-items-center justify-content-end">{(TicketSelected?.dateUpdated as Date)?.getTime() !== 0 ? TicketSelected?.dateUpdated.toLocaleString(language.code) : ''}</div>
                            </div>
                            <p className="text-xl font-bold mt-2">{deviceInfoTxt}</p>
                            <div className="grid">
                                <div className="col-3">IP</div>
                                <div className="col-9 text-right">{TicketSelected?.ip}</div>
                                <div className="col-3">OS</div>
                                <div className="col-9 text-right">{TicketSelected?.os}</div>
                                <div className="col-3">{browserTxt}</div>
                                <div className="col-9 text-right">{TicketSelected?.browser}</div>
                            </div>
                        </Card>
                        <Card
                            pt={{
                                root: { className: "mt-4" },
                                body: { className: "py-1" },
                                content: { className: "py-0" },
                            }}>
                            {/*Ticket Change Values*/}
                            <p className="text-xl font-bold my-3">{optionsTxt}</p>
                            <div className="grid">
                                <div className='col-12'>
                                    {/*Projectt*/}
                                    <Controller
                                        name="Project"
                                        control={control}
                                        rules={
                                            {
                                                required: ErrorRequired
                                            }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <label className="align-self-start block mb-1">{CardFormProject}</label>
                                                <Dropdown
                                                    id={field.name}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    options={Projects}
                                                    optionLabel="name"
                                                    optionValue='id'
                                                    showClear
                                                    disabled
                                                    className={classNames({ 'p-invalid': fieldState.error } + " w-full")} />
                                                {ErrorMessageHtml(field.name)}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Ticket Type */}
                                <div className='col-12'>
                                    <Controller
                                        name="Type"
                                        control={control}
                                        rules={
                                            {
                                                required: ErrorRequired
                                            }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <label className="align-self-start block mb-1">{CardFormType}</label>
                                                <Dropdown
                                                    id={field.name}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    options={TicketType}
                                                    optionLabel="name"
                                                    optionValue='id'
                                                    showClear
                                                    className={classNames({ 'p-invalid': fieldState.error } + " w-full")} />
                                                {ErrorMessageHtml(field.name)}
                                            </>
                                        )}
                                    />
                                </div>

                                {/* Ticket Priority */}
                                {getTokenData?.permissionLevel === "Administrator" ?
                                    <div className='col-12'>
                                        <Controller
                                            name="Priority"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <label className="align-self-start block mb-1">{CardFormPriority}</label>
                                                    <Dropdown
                                                        id={field.name}
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.value)}
                                                        options={TicketPriorities}
                                                        optionLabel="name"
                                                        optionValue='id'
                                                        showClear
                                                        className={classNames({ 'p-invalid': fieldState.error } + " w-full")} />
                                                    {ErrorMessageHtml(field.name)}
                                                </>
                                            )}
                                        />
                                    </div>
                                    :
                                    null
                                }

                                {/* Ticket Status */}
                                {getTokenData?.permissionLevel === "Administrator" || getTokenData?.permissionLevel === "Developer" ?
                                    <div className='col-12'>
                                        <Controller
                                            name="Status"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <label className="align-self-start block mb-1">{CardFormStatus}</label>
                                                    <Dropdown
                                                        id={field.name}
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.value)}
                                                        options={TicketStatus}
                                                        optionLabel="name"
                                                        optionValue='id'
                                                        showClear
                                                        className={classNames({ 'p-invalid': fieldState.error } + " w-full")} />
                                                    {ErrorMessageHtml(field.name)}
                                                </>
                                            )}
                                        />
                                    </div>
                                    :
                                    null
                                }

                                {/* Ticket Closed */}
                                {getTokenData?.permissionLevel === "Administrator" || getTokenData?.permissionLevel === "Developer" ?
                                    <div className='col-12'>
                                        <Controller
                                            name="Closed"
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <div className='flex align-items-center'>
                                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.Closed })}></label>
                                                        <label className='mr-2' htmlFor={field.name}>{CardFormClosed}</label>
                                                        <InputSwitch checked={field.value} onChange={(e) => field.onChange(e.value)} />

                                                        {ErrorMessageHtml(field.name)}
                                                    </div>
                                                </>
                                            )}
                                        />
                                    </div>
                                    :
                                    null
                                }

                                <div className='col-12'>
                                    <div className='flex justify-content-center align-items-center'>
                                        <Button
                                            icon="pi pi-sync"
                                            label={CardButtonUpdated}
                                            className='mr-3'
                                            type='submit'
                                            loading={loadingPut}
                                            outlined
                                            onClick={() => handlerUpdatedValuesClick()} />
                                    </div>
                                </div>

                            </div>
                        </Card>
                        {/*Buton mobile close ticket info*/}
                        <Button
                            icon="pi pi-angle-double-left"
                            className="fixed z-1 left-0 bg-white lg:hidden"
                            size={"small"}
                            text
                            raised
                            style={{ top: "50%", transform: "translateY(-50%)" }}
                            onClick={() => handlerClosedTicketDataMobile()} />
                    </div>
                </div >

            </>

        </>
    )
}
