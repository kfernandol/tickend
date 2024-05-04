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
//hooks
import { useDelete, useGet } from "../../services/api_services";
import { useTranslation } from 'react-i18next';
//models
import { UserResponse } from '../../models/responses/users.response';
import { BasicResponse, ErrorResponse, ErrorsResponse } from '../../models/responses/basic.response';

export default function Users() {
    const toast = useRef<Toast>(null);

    //Search Table Filters
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    //Api Request
    const { SendGetRequest, getResponse, loadingGet } = useGet<UserResponse[]>();
    const { SendDeleteRequest, deleteResponse, errorDelete, httpCodeDelete } = useDelete<BasicResponse>();
    const [users, setUsers] = useState<UserResponse[]>([]);

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

    //Links
    const NewItemUrl = paths.newUser;
    const EditItemUrl = paths.editUserWithId;

    //Notification delete
    useEffect(() => {
        if (httpCodeDelete === 200) {
            toast?.current?.show({ severity: 'success', summary: TableDeleteTitle, detail: deleteResponse?.message, life: 3000 });
            setTimeout(() => SendGetRequest("v1/users").then((response) => setUsers(response.data as UserResponse[])), 3000);
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

    //Send Request
    useEffect(() => {
        const requests = [
            SendGetRequest("v1/users")
        ];

        Promise.all(requests)
            .then((responses) => {
                responses.forEach((response) => {
                    switch (response.url) {
                        case "v1/users":
                            setUsers(response.data as UserResponse[]);
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

    const imageBodyTemplate = (rowData: { photo: unknown; }) => {
        if (rowData.photo)
            return <Avatar image={`data:image/*;base64,${rowData.photo}`} size="normal" shape="circle" />;
        else
            return <Avatar icon="pi pi-user" size="large" shape="circle" />;
    };

    const actionsBodyTemplate = (rowData: { id: string; }) => {
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
                            value={users}
                            header={header}
                            style={{ backgroundColor: "#17212f5D" }}
                            dataKey="id"
                            paginator
                            rows={10}
                            size='small'
                            filters={filters}
                            globalFilterFields={['id', 'username', 'firstName', 'lastName', 'email']}
                        >
                            <Column style={{ width: '5rem' }} />
                            <Column field="id" header={TableHeaderId} sortable />
                            <Column body={imageBodyTemplate} header={TableHeaderPhoto} />
                            <Column field="username" header={TableHeaderUsername} sortable />
                            <Column field="firstName" header={TableHeaderFirstName} sortable />
                            <Column field="lastName" header={TableHeaderLastName} sortable />
                            <Column field="email" header={TableHeaderEmail} sortable />
                            <Column field="rolId" header={TableHeaderRol} sortable />
                            <Column header={TableHeaderActions} body={actionsBodyTemplate} sortable />
                        </DataTable>
                    </div>
                </>
            }

        </>


    )
}
