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
import { Card } from 'primereact/card';
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
import { PermissionLevelResponse } from '../../models/responses/permissionLevel.response';
import { MenusResponse } from '../../models/responses/menus.response';

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
    const { SendGetRequest, loadingGet } = useGet<RolesResponse[]>();
    const [PermissionLevels, setPermissionLevels] = useState<PermissionLevelResponse[]>();
    const [roles, setRoles] = useState<RolesResponse[]>([]);
    const [Menus, setMenus] = useState<MenusResponse[]>([]);

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
    const PageName = t("navigation.Roles");

    //Links
    const NewItemUrl = paths.newRol;
    const EditItemUrl = paths.editRolWithId;

    //Send Request
    useEffect(() => {
        const requests = [
            SendGetRequest("v1/roles/PermissionLevels"),
            SendGetRequest("v1/roles"),
            SendGetRequest("v1/menus"),
        ];

        Promise.all(requests)
            .then((responses) => {
                responses.forEach((response) => {
                    switch (response.url) {
                        case "v1/roles/PermissionLevels":
                            setPermissionLevels(response.data as PermissionLevelResponse[]);
                            break;
                        case "v1/roles":
                            setRoles((response.data as RolesResponse[]));
                            break;
                        case "v1/menus":
                            setMenus(response.data as MenusResponse[]);
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
            setTimeout(() => SendGetRequest("v1/roles").then((value) => {
                setRoles((value.data as RolesResponse[]));
            }), 3000);
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

    const PermissionlevelsBody = (rowData: RolesResponse) => {
        const permissionLevel = PermissionLevels?.find(x => x.id === rowData.permissionLevelId);
        return <p>{permissionLevel?.name}</p>
    }

    const MenusBody = (RowData: RolesResponse) => {
        const menusId = RowData.menus.map(x => x.id);
        const MenusNames = Menus.filter(x => menusId.some(z => z === x.id))
            .map(x => " " + x.name)
            .toString();

        return < p >{MenusNames}</p>
    }

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

                    {/*Title*/}
                    <div className="flex justify-content-between align-items-center my-4">
                        <h2 className="my-0">{PageName}</h2>
                        {/* Add new */}
                        {getTokenData?.PermissionLevel === "Administrator"
                            ? <Link to={NewItemUrl}>
                                <Button icon="pi pi-plus" severity='success'>
                                    <span className='pl-2'>{RolesTableHeaderNewRol}</span>
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
                            value={roles}
                            header={TableHeader}
                            dataKey="id"
                            paginator
                            rows={10}
                            size='small'
                            filters={filters}
                            globalFilterFields={['id', 'name', 'permissionLevel', 'menus']}
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
                            <Column field="id" header={RolesTableHeaderId} sortable />
                            <Column field="name" header={RolesTableHeaderName} sortable />
                            <Column field="permissionLevelId" header={RolesTableHeaderPermissionLevel} sortable body={PermissionlevelsBody} />
                            <Column field="menus.id" header={RolesTableHeaderMenus} sortable body={MenusBody} />
                            {getTokenData?.PermissionLevel === "Administrator" ? <Column header={RolesTableHeaderActions} body={ActionsTableTemplate} sortable /> : <></>}
                        </DataTable>
                    </Card>
                </>
            }
        </>
    )
}
