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
import Swal from 'sweetalert2';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
//hooks
import { useDelete, useGet } from "../../services/api_services";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import useTokenData from '../../hooks/useTokenData';
//models
import { BasicResponse, ErrorResponse, ErrorsResponse } from '../../models/responses/basic.response';
import { RolesResponse } from '../../models/responses/roles.response';
import { RootState } from '../../redux/store';
import { AuthToken } from '../../models/tokens/token.model';

export default function Roles() {
    const toast = useRef<Toast>(null);
    //Redux
    const authenticated = useSelector((state: RootState) => state.auth);
    const getTokenData = useTokenData<AuthToken>(authenticated?.token);
    //Table Filterss
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    //Api Request
    const { SendDeleteRequest, deleteResponse, errorDelete, httpCodeDelete } = useDelete<BasicResponse>();
    const { SendGetRequest, getResponse, loadingGet } = useGet<RolesResponse[]>();
    const [roles, setRoles] = useState<{ id: number, name: string, permissionLevel: string, menus: string[] }[]>([]);

    //Translations
    const { t } = useTranslation();
    const GlobalConfirmationDeleteText = t("deleteConfirmation.description", { 0: t("element.Rol").toLowerCase() + "?" });
    const GlobalConfirmation = t("deleteConfirmation.title");
    const GlobalButtonDelete = t("buttons.delete");
    const GlobalButtonCancel = t("common.cardFormButtons.cancel");
    const GlobalSearch = t("placeholders.search");
    const TableDeleteTitle = t("deleteConfirmation.title");
    const TableTitle = t("roles.tableTitle");
    const RolesTableHeaderNewRol = t("roles.labels.new")
    const RolesTableHeaderId = t("common.labels.id");
    const RolesTableHeaderName = t("common.labels.name");
    const RolesTableHeaderPermissionLevel = t("roles.labels.permissionLevel");
    const RolesTableHeaderMenus = t("roles.labels.menus");
    const RolesTableHeaderActions = t("common.labels.actions");
    const TableNoElements = t("common.table.noElements");

    //Links
    const NewItemUrl = paths.newRol;
    const EditItemUrl = paths.editRolWithId;

    //Send Request
    useEffect(() => {
        SendGetRequest("v1/roles");
    }, [])

    //Get Response
    useEffect(() => {
        if (getResponse) {
            const rolesResponse = getResponse.map(x => ({
                id: x.id,
                name: x.name,
                permissionLevel: x.permissionLevel,
                menus: x.menus.map(x => x.name + ", ")
            }))
            setRoles(rolesResponse);
        }
    }, [getResponse]);

    //Notification delete
    useEffect(() => {
        if (httpCodeDelete === 200) {
            toast?.current?.show({ severity: 'success', summary: TableDeleteTitle, detail: deleteResponse?.message, life: 3000 });
            setTimeout(() => SendGetRequest("v1/roles"), 3000);
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
            <span className='text-2xl text-white'>{TableTitle}</span>
            {/* Filter */}
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search"> </InputIcon>
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={GlobalSearch} />
            </IconField>
            {/* Add new */}
            {getTokenData?.PermissionLevel === "Administrator" ?
                <Link to={NewItemUrl}>
                    <Button icon="pi pi-plus" severity='success'>
                        <span className='pl-2'>{RolesTableHeaderNewRol}</span>
                    </Button>
                </Link>
                : null}
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
                SendDeleteRequest("v1/roles/" + id)
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
                    <div className="card" style={{ backgroundColor: "#17212f5D" }}>
                        <DataTable
                            value={roles}
                            header={TableHeader}
                            style={{ backgroundColor: "#17212f5D" }}
                            dataKey="id"
                            paginator
                            rows={10}
                            size='small'
                            filters={filters}
                            globalFilterFields={['id', 'name', 'permissionLevel', 'menus']}
                            emptyMessage={TableNoElements}
                        >
                            <Column style={{ width: '5rem' }} />
                            <Column field="id" header={RolesTableHeaderId} sortable />
                            <Column field="name" header={RolesTableHeaderName} sortable />
                            <Column field="permissionLevel" header={RolesTableHeaderPermissionLevel} sortable />
                            <Column field="menus" header={RolesTableHeaderMenus} sortable />
                            {getTokenData?.PermissionLevel === "Administrator" ? <Column header={RolesTableHeaderActions} body={ActionsTableTemplate} sortable /> : <></>}
                        </DataTable>
                    </div>
                </>
            }
        </>
    )
}
