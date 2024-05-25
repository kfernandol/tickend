import { useEffect, useRef, useState } from 'react'
import { FilterMatchMode } from 'primereact/api';
import { paths } from '../../routes/paths';
//components
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Link } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import Swal from 'sweetalert2';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
//hooks
import { useDelete, useGet } from "../../services/api_services";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import useTokenData from '../../hooks/useTokenData';
//models
import { UserResponse } from '../../models/responses/users.response';
import { BasicResponse, ErrorResponse, ErrorsResponse } from '../../models/responses/basic.response';
import { RolesResponse } from '../../models/responses/roles.response';
import { RootState } from '../../redux/store';
import { AuthToken } from '../../models/tokens/token.model';
import { Card } from 'primereact/card';

export default function Users() {
    const toast = useRef<Toast>(null);

    //Redux
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);

    //Search Table Filters
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    //Api Request
    const { SendGetRequest, loadingGet } = useGet<UserResponse[]>();
    const { SendDeleteRequest, deleteResponse, errorDelete, httpCodeDelete } = useDelete<BasicResponse>();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [roles, setRoles] = useState<RolesResponse[]>([]);

    //Translation
    const { t } = useTranslation();
    const GlobalConfirmationDeleteText = t("deleteConfirmation.description", { 0: t("element.User").toLowerCase() + "?" });
    const GlobalConfirmation = t("deleteConfirmation.title");
    const GlobalButtonDelete = t("buttons.delete");
    const GlobalButtonCancel = t("common.cardFormButtons.cancel");
    const GlobalSearch = t("placeholders.search");
    const TableDeleteTitle = t("deleteConfirmation.title");
    const TableTitle = t("users.tableTitle");
    const TableHeaderNew = t("users.labels.new");
    const TableHeaderId = t("common.labels.id");
    const TableHeaderPhoto = t("users.labels.photo");
    const TableHeaderUsername = t("users.labels.username");
    const TableHeaderFirstName = t("users.labels.firstName");
    const TableHeaderLastName = t("users.labels.lastName");
    const TableHeaderEmail = t("users.labels.email");
    const TableHeaderRol = t("users.labels.role");
    const TableHeaderActions = t("common.labels.actions");
    const TableNoElements = t("common.table.noElements");
    const PageName = t("navigation.Users");

    //Links
    const NewItemUrl = paths.newUser;
    const EditItemUrl = paths.editUserWithId;

    const [TableData, setTableData] = useState<{
        id: number,
        photo: string,
        username: string,
        firstname: string,
        lastname: string,
        email: string,
        rol: string | undefined,
    }[]>();

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
            setTimeout(() => SendGetRequest("v1/users").then((response) => setUsers(response.data as UserResponse[])), 3000);
        }

    }, [errorDelete, httpCodeDelete, deleteResponse])

    //Send Request
    useEffect(() => {
        const requests = [
            SendGetRequest("v1/users"),
            SendGetRequest("v1/roles")
        ];

        Promise.all(requests)
            .then((responses) => {
                responses.forEach((response) => {
                    switch (response.url) {
                        case "v1/users":
                            setUsers(response.data as UserResponse[]);
                            break;
                        case "v1/roles":
                            setRoles(response.data as RolesResponse[]);
                            break;
                        default:
                            break;
                    }
                });
            })
            .catch((error) => {
                console.error("Error:", error);
            });

    }, [])

    //Process Request
    useEffect(() => {
        const tableData = users.map((user) => ({
            id: user.id,
            photo: user.photo,
            username: user.username,
            firstname: user.firstName,
            lastname: user.lastName,
            email: user.email,
            rol: roles.find(x => x.id == user.rolId)?.name
        }))

        setTableData(tableData);
    }, [users, roles])


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
                SendDeleteRequest("v1/users/" + id)
            }
        })
    };


    //Global Filter Table
    const onGlobalFilterChange = (e: { target: { value: string | null } }) => {
        const value = e.target.value;
        const _filters = { ...filters };

        _filters['global'].value = value as null;

        setFilters(_filters);
        setGlobalFilterValue(value !== null ? value : '');
    };


    const header = (
        <div className="flex flex-wrap justify-content-between align-items-center gap-2 p-2" >
            {/* Table Title */}
            <span className='text-xl text-gray-900'>{TableTitle}</span>
            {/* Filter */}
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search"> </InputIcon>
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={GlobalSearch} className="h-3rem" />
            </IconField>
        </div>
    );

    const imageBodyTemplate = (rowData: { photo: string | undefined; }) => {
        if (rowData.photo && rowData.photo !== '')
            return <Avatar image={rowData.photo} size="large" shape="circle" />;
        else
            return <Avatar icon="pi pi-user" size="large" shape="circle" />;
    };

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
                    {/*Table*/}
                    <Card
                        style={{ height: "calc(100% - 125px)" }}
                        pt={{
                            body: { className: "h-full pb-0" },
                            content: { className: "h-full py-0" },
                        }}>
                        <DataTable
                            value={TableData}
                            header={header}
                            dataKey="id"
                            paginator
                            rows={10}
                            size='small'
                            stripedRows
                            filters={filters}
                            globalFilterFields={['id', 'username', 'firstName', 'lastName', 'email']}
                            emptyMessage={TableNoElements}
                            pt={{
                                root: { className: "h-full flex flex-column" },
                                header: { className: "bg-white border-0 mb-3" },
                                wrapper: { className: "h-full" },
                                column: { headerCell: { className: "bg-yellow-100" } }
                            }}
                        >
                            <Column field="id" header={TableHeaderId} sortable />
                            <Column body={imageBodyTemplate} header={TableHeaderPhoto} />
                            <Column field="username" header={TableHeaderUsername} sortable />
                            <Column field="firstname" header={TableHeaderFirstName} sortable />
                            <Column field="lastname" header={TableHeaderLastName} sortable />
                            <Column field="email" header={TableHeaderEmail} sortable />
                            <Column field="rol" header={TableHeaderRol} sortable />
                            {getTokenData?.PermissionLevel === "Administrator" ? <Column header={TableHeaderActions} body={ActionsTableTemplate} sortable /> : <></>}
                        </DataTable>
                    </Card>
                </>
            }

        </>


    )
}
