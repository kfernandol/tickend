//Components
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { addLocale } from 'primereact/api';
import { Sidebar } from "primereact/sidebar";
//hooks
import { useGet } from "../../services/api_services";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
//Redux
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
//models
import { AuditLogActionsResponse, AuditLogsResponse } from "../../models/responses/auditLog.response";
import { UserResponse } from "../../models/responses/users.response";
import { Button } from "primereact/button";

export default function AuditLog() {
    //Hooks
    const { t } = useTranslation();
    //Redux
    const language = useSelector((state: RootState) => state.language);
    //Api
    const { SendGetRequest } = useGet<AuditLogsResponse[]>();
    //Translation
    const TableNoElements = t("common.table.noElements");
    const titleTxt = t("auditLogs.title");
    const subTitleTxt = t("auditLogs.subTitle");
    const userTxt = t("auditLogs.user");
    const selectUserTxt = t("auditLogs.selectUser");
    const actionsTxt = t("auditLogs.actions");
    const selectedActionTxt = t("auditLogs.selectedAction");
    const dateTxt = t("auditLogs.date");
    const selectedDateTxt = t("auditLogs.selectedDate");
    const tableTxt = t("auditLogs.table");
    const selectedTableTxt = t("auditLogs.selectedTable");
    const elementIdTxt = t("auditLogs.elementId");
    const selectElementIdTxt = t("auditLogs.selectElementId");
    const auditLogDetailsTxt = t("auditLogs.auditLogDetails");
    const nameTxt = t("auditLogs.name");
    const oldValueTxt = t("auditLogs.oldValue");
    const newValueTxt = t("auditLogs.newValue");
    const registeredChangesTxt = t("auditLogs.registeredChanges");

    //Calendar Locales
    addLocale('es', {
        firstDayOfWeek: 1,
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        today: 'Hoy',
        clear: 'Limpiar',
        dateFormat: "dd/mm/yy"
    });
    //Variables
    const [sidebar, setSidebar] = useState<{ visible: boolean, auditLog: AuditLogsResponse | null }>({ visible: false, auditLog: null });
    //--Auditlogs
    const [auditLogs, setAuditLogs] = useState<AuditLogsResponse[]>([]);
    const [auditLogsFiltered, setAuditLogsFiltered] = useState<AuditLogsResponse[]>([]);
    //--AuditLogsActions
    const [auditLogsActions, setAuditLogsActions] = useState<AuditLogActionsResponse[]>([]);
    const [auditLogsActionsSelected, setAuditLogsActionsSelected] = useState<AuditLogActionsResponse[]>([]);
    //--Users
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [usersSelected, setUsersSelected] = useState<UserResponse[]>([]);
    //--Date
    const [DateSelected, setDateSelected] = useState<Nullable<Date>>(null);
    //--Tables
    const [TablesNames, setTablesName] = useState<string[]>([]);
    const [TablesNamesSelected, setTablesNameSelected] = useState<string[]>([]);
    //--Element Id
    const [elementsId, setElementsId] = useState<string[]>([]);
    const [elementsIdSelected, setElementsIdSelected] = useState<string[]>([]);

    useEffect(() => {
        const requests = [
            SendGetRequest("v1/audit-log"),
            SendGetRequest("v1/audit-log/actions"),
            SendGetRequest("v1/users"),

        ]

        Promise.all(requests).then((response) => {
            response.forEach((response) => {
                switch (response.url) {
                    case "v1/audit-log":
                        setAuditLogs((response.data as AuditLogsResponse[]).map((value) => ({
                            id: value.id,
                            action: value.action,
                            auditLogDetailResponses: value.auditLogDetailResponses,
                            date: new Date(value.date),
                            table: value.table,
                            userId: value.userId,
                            primaryId: value.primaryId
                        })));
                        setAuditLogsFiltered((response.data as AuditLogsResponse[]).map((value) => ({
                            id: value.id,
                            action: value.action,
                            auditLogDetailResponses: value.auditLogDetailResponses,
                            date: new Date(value.date),
                            table: value.table,
                            userId: value.userId,
                            primaryId: value.primaryId
                        })));
                        setTablesName([...new Set((response.data as AuditLogsResponse[]).map(x => x.table))]);
                        setElementsId([...new Set((response.data as AuditLogsResponse[]).map(x => x.primaryId))]);
                        break;
                    case "v1/audit-log/actions":
                        setAuditLogsActions(response.data as AuditLogActionsResponse[]);
                        break;
                    case "v1/users":
                        setUsers(response.data as UserResponse[]);
                        break;
                }
            })
        });

    }, []);

    //Filter Elements
    useEffect(() => {
        let AuditLogFiltered = auditLogs;

        if (usersSelected.length > 0)
            AuditLogFiltered = AuditLogFiltered.filter(x => usersSelected.some(user => user.id == x.userId))

        if (auditLogsActionsSelected.length > 0)
            AuditLogFiltered = AuditLogFiltered.filter(x => auditLogsActionsSelected.some(action => action.id == x.action))

        if (DateSelected != null)
            AuditLogFiltered = AuditLogFiltered.filter(x => new Date(x.date).toLocaleDateString() === DateSelected.toLocaleDateString());

        if (TablesNamesSelected.length > 0)
            AuditLogFiltered = AuditLogFiltered.filter(x => TablesNamesSelected.some(name => name == x.table));

        if (elementsIdSelected.length > 0)
            AuditLogFiltered = AuditLogFiltered.filter(x => elementsIdSelected.some(id => id == x.primaryId));

        setAuditLogsFiltered(AuditLogFiltered);
    }, [usersSelected, auditLogsActionsSelected, DateSelected, TablesNamesSelected, elementsIdSelected])

    const UserFilterTemplate = (user: UserResponse) => {
        return (
            <div className="flex align-items-center">
                {user?.photo != null && user?.photo != ''
                    ? <Avatar image={`data:image/*;base64,${user.photo}`} size="normal" shape="circle" />
                    : <Avatar image={'/src/assets/imgs/avatar-default.png'} size="normal" shape="circle" />}
                <p className="ml-2">{user.firstName} {user.lastName}</p>
            </div>
        );
    };

    const AuditLogActionFilterTemplate = (action: AuditLogActionsResponse) => {
        switch (action?.name) {
            case "Created": return <Badge value={"Creado"} severity={"success"}></Badge>
            case "Modified": return <Badge value={"Modificado"} severity={"warning"}></Badge>
            case "Delete": return <Badge value={"Eliminado"} severity={"danger"}></Badge>
            case "Unknown": return <Badge value={"Desconocido"} severity={"info"}></Badge>
        }
    };

    const userBodyTemplate = (rowDate: { userId: number }) => {
        const user = users.find(x => x.id == rowDate.userId);

        if (user?.photo)
            return <>
                <div className="flex align-items-center ">
                    <Avatar image={`data:image/*;base64,${user.photo}`} size="large" shape="circle" />
                    <p className="ml-4">{user?.firstName} {user?.lastName}</p>
                </div>
            </>;
        else
            return <>
                <div className="flex align-items-center ">
                    <Avatar icon="pi pi-user" size="large" shape="circle" image={'src/assets/imgs/avatar-default.png'} />
                    <p className="ml-4">{user?.firstName} {user?.lastName}</p>
                </div>
            </>;
    }

    const actionBodyTemplate = (rowDate: { action: number }) => {
        const action = auditLogsActions.find(x => x.id == rowDate.action);
        switch (action?.name) {
            case "Created": return <Badge value={"Creado"} severity={"success"}></Badge>
            case "Modified": return <Badge value={"Modificado"} severity={"warning"}></Badge>
            case "Delete": return <Badge value={"Eliminado"} severity={"danger"}></Badge>
            case "Unknown": return <Badge value={"Desconocido"} severity={"info"}></Badge>
        }
    }

    const dateBodyTemplate = (options: { date: string }) => {
        const date = new Date(options.date)

        if (date && options.date) {
            if (language.code === "en") {
                return `${date.toLocaleDateString("en-US", { day: '2-digit', month: '2-digit', year: 'numeric' })} ${date.toLocaleTimeString("en-US")}`;
            }
            else if (language.code === "es") {
                return `${date.toLocaleDateString("es-GT", { day: '2-digit', month: '2-digit', year: 'numeric' })} ${date.toLocaleTimeString("es-GT")}`;
            }
        }
    }

    const HandlerOnChangeAction = (e: AuditLogsResponse) => {
        setSidebar({ visible: true, auditLog: e });
    }

    const SidebarTemplate = () => {
        const user = users.find(user => user.id == sidebar.auditLog?.userId);
        let date;

        if (sidebar.auditLog?.date) {
            if (language.code === "en") {
                date = `${sidebar.auditLog?.date.toLocaleDateString("en-US", { day: '2-digit', month: "short", year: 'numeric' })} ${sidebar.auditLog?.date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
            }
            else if (language.code === "es") {
                date = `${sidebar.auditLog?.date.toLocaleDateString("es-GT", { day: '2-digit', month: "short", year: 'numeric' })} ${sidebar.auditLog?.date.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" })}`;
            }
        }
        return (
            <div className="px-3">
                <h2 className="text-center mb-0 relative">
                    {auditLogDetailsTxt}
                    <i className="pi pi-times absolute right-0 top-0 bottom-0 mr-3 cursor-pointer" onClick={() => setSidebar({ visible: false, auditLog: null })}></i>
                </h2>
                <div className="grid my-4">
                    <div className="col-12">
                        {nameTxt}: {user?.firstName} {user?.lastName}
                    </div>
                    <div className="col-12">
                        {tableTxt}: {sidebar.auditLog?.table}
                    </div>
                    <div className="col-12">
                        {dateTxt}: {date}
                    </div>
                </div>
                <h3 className="text-center">{registeredChangesTxt}</h3>
                <div className="flex justify-content-center">
                    <DataTable
                        value={sidebar.auditLog?.auditLogDetailResponses}
                        showGridlines
                        stripedRows
                        className="w-full">
                        <Column field="columnName" header={nameTxt}></Column>
                        <Column field="oldValue" header={oldValueTxt}></Column>
                        <Column field="newValue" header={newValueTxt}></Column>
                    </DataTable>
                </div>
            </div>
        )
    }

    return <>
        <h2 className="mb-0 mt-4">{titleTxt}</h2>
        <p className="mt-2 mb-0">{subTitleTxt}</p>
        {/*Filters*/}
        <Card className="mt-4" pt={{ content: { className: "my-0 py-0" }, body: { className: "my-0 py-0" } }}>
            <div className="grid">
                <div className="col-2 flex flex-column justify-content-center py-3">
                    <h5 className="mb-2 mt-0">{userTxt}</h5>
                    <MultiSelect
                        value={usersSelected}
                        options={users}
                        onChange={(e) => setUsersSelected(e.value)}
                        itemTemplate={UserFilterTemplate}
                        optionLabel="firstName"
                        placeholder={selectUserTxt}
                        className="w-full"
                        display="chip"
                        showClear
                        pt={{ item: { className: "py-0" }, header: { className: 'py-0' }, list: { className: 'py-1' } }} />
                </div>
                <div className="col-2 flex flex-column justify-content-center py-3">
                    <h5 className="mb-2 mt-0">{actionsTxt}</h5>
                    <MultiSelect
                        value={auditLogsActionsSelected}
                        options={auditLogsActions}
                        onChange={(e) => setAuditLogsActionsSelected(e.value)}
                        itemTemplate={AuditLogActionFilterTemplate}
                        optionLabel="name"
                        placeholder={selectedActionTxt}
                        className="w-full"
                        display="chip"
                        pt={{ item: { className: "py-2" }, header: { className: 'py-0' }, list: { className: 'py-1' } }} />
                </div>
                <div className="col-2 flex flex-column justify-content-center py-3">
                    <h5 className="mb-2 mt-0">{dateTxt}</h5>
                    <Calendar
                        value={DateSelected}
                        onChange={(e) => setDateSelected(e.value)}
                        locale={language.code}
                        placeholder={selectedDateTxt} />
                </div>
                <div className="col-2 flex flex-column justify-content-center py-3">
                    <h5 className="mb-2 mt-0">{tableTxt}</h5>
                    <MultiSelect
                        value={TablesNamesSelected}
                        options={TablesNames}
                        onChange={(e) => setTablesNameSelected(e.value)}
                        placeholder={selectedTableTxt}
                        className="w-full"
                        display="chip"
                        pt={{ item: { className: "py-2" }, header: { className: 'py-0' }, list: { className: 'py-1' } }} />
                </div>
                <div className="col-2 flex flex-column justify-content-center py-3">
                    <h5 className="mb-2 mt-0">{elementIdTxt}</h5>
                    <MultiSelect
                        value={elementsIdSelected}
                        options={elementsId}
                        onChange={(e) => setElementsIdSelected(e.value)}
                        placeholder={selectElementIdTxt}
                        className="w-full"
                        display="chip"
                        pt={{ item: { className: "py-2" }, header: { className: 'py-0' }, list: { className: 'py-1' } }} />
                </div>
            </div>
        </Card>
        {/*Table*/}
        <Card className="mt-4 mb-4" pt={{ content: { className: "my-0 py-0" }, body: { className: "m-0 p-0" } }}>
            <DataTable
                value={auditLogsFiltered}
                style={{ backgroundColor: "#17212f5D" }}
                dataKey="id"
                paginator
                rows={10}
                size='small'
                selectionMode="single"
                onSelectionChange={(e) => HandlerOnChangeAction(e.value)}
                emptyMessage={TableNoElements}
                stripedRows
                pt={{
                    root: { className: "h-full flex flex-column" },
                    header: { className: "bg-white border-0 mb-3" },
                    wrapper: { className: "h-full" },
                    column: { headerCell: { className: "bg-yellow-100" } }
                }}            >
                <Column field="userId" header={userTxt} body={userBodyTemplate}></Column>
                <Column field="action" header={actionsTxt} body={actionBodyTemplate}></Column>
                <Column field="date" dataType="date" header={dateTxt} body={dateBodyTemplate}></Column>
                <Column field="table" header={tableTxt}></Column>
                <Column field="primaryId" header={elementIdTxt}></Column>
            </DataTable>
        </Card>
        {/*SideBar Info*/}
        <Sidebar
            visible={sidebar.visible}
            position="right"
            onHide={() => setSidebar({ visible: false, auditLog: null })}
            content={SidebarTemplate}
            className="w-auto">
        </Sidebar>
    </>;
}