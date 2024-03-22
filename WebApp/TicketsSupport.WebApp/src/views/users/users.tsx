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
import { Avatar } from 'primereact/avatar';
import { Link } from 'react-router-dom';
//hooks
import { useDelete, useGet } from "../../services/api_services";
import { useTranslation } from 'react-i18next';
//models
import { UserResponse } from '../../models/responses/users.response';
import { BasicResponse, ErrorResponse } from '../../models/responses/basic.response';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Users() {
    const { t } = useTranslation();
    const toast = useRef<Toast>(null);
    const { SendGetRequest, getResponse, loadingGet } = useGet<UserResponse[]>();
    const { SendDeleteRequest, deleteResponse, errorDelete, httpCodeDelete } = useDelete<BasicResponse>();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    //Accept Delete user
    let deleteUserId = "";
    function accept() {
        SendDeleteRequest("v1/users/" + deleteUserId);
    }

    useEffect(() => {
        //Delete user complete
        if (httpCodeDelete === 200) {
            toast?.current?.show({ severity: 'error', summary: t("UserTableDeleteTitle"), detail: deleteResponse?.message, life: 3000 });
        }
        //Bad Request
        else if (httpCodeDelete == 400) {
            const errorResponse: ErrorResponse = errorDelete?.response?.data as ErrorResponse;

            if (errorResponse) {
                const errorsJson: string[] = JSON.parse(errorResponse.details);
                //ErrorResponse with list errors
                if (errorsJson) {
                    const errorsHtml = Object.values(errorsJson).flat().map((error, index) => {
                        return <li>{index + 1}. {error}</li>;
                    });

                    toast?.current?.show({ severity: 'error', summary: t("UserCardTitleNewUser"), detail: <ul id='errors-toast'>{errorsHtml}</ul>, life: 3000 });
                } else {
                    toast?.current?.show({ severity: 'error', summary: t("UserCardTitleNewUser"), detail: errorResponse.details, life: 3000 });
                }
            }
        }
        else {
            const response = errorDelete?.response?.data as ErrorResponse;
            if (response) {
                toast?.current?.show({ severity: 'error', summary: t("UserCardTitleNewUser"), detail: response.details, life: 3000 });
            }
        }
    }, [deleteResponse, errorDelete, httpCodeDelete, t])

    //Confirm Delete User Dialog
    const confirm1 = (id: string) => {
        deleteUserId = id;
        confirmDialog({
            message: t("GlobalConfirmationDeleteText"),
            header: t("GlobalConfirmation"),
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
        });
    };

    //Send Request
    useEffect(() => {
        SendGetRequest("v1/users");
    }, [deleteResponse])

    //Get Response
    useEffect(() => {
        if (getResponse) {
            setUsers(getResponse);
        }
    }, [getResponse]);

    //Global Filter Table
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        const _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };


    const header = (
        <div className="flex flex-wrap justify-content-between align-items-center gap-2 p-2" >
            {/* Table Title */}
            <span className='text-2xl text-white'>{t("UserTableTitle")}</span>
            {/* Filter */}
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t("GlobalSearch")} />
            </span>
            {/* Add new */}
            <Link to={"/Users/New"}>
                <Button icon="pi pi-plus" severity='success'>
                    <span className='pl-2'>{t("UserTableHeaderNewUser")}</span>
                </Button>
            </Link>
        </div>
    );

    const imageBodyTemplate = (rowData: { photo: unknown; }) => {
        if (rowData.photo) {
            return <Avatar image="/images/avatar/amyelsner.png" size="normal" shape="circle" />;
        } else {
            return <Avatar icon="pi pi-user" size="large" shape="circle" />;
        }

    };

    const actionsBodyTemplate = (rowData: { id: string; }) => {
        const editUrlPath = paths.editUserWithId.slice(0, paths.editUserWithId.length - 3);
        return <>
            <div className='flex gap-2'>
                <Link to={editUrlPath + rowData.id}>
                    <Button icon="pi pi-pencil" severity='warning' aria-label="Bookmark"></Button>
                </Link>
                <Button icon="pi pi-trash" severity='danger' aria-label="Bookmark" onClick={() => { confirm1(rowData.id) }}></Button>
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
                            emptyMessage="No customers found."
                        >
                            <Column style={{ width: '5rem' }} />
                            <Column field="id" header={t("UserTableHeaderId")} sortable />
                            <Column body={imageBodyTemplate} header={t("UserTableHeaderPhoto")} />
                            <Column field="username" header={t("UserTableHeaderUsername")} sortable />
                            <Column field="firstName" header={t("UserTableHeaderFirstName")} sortable />
                            <Column field="lastName" header={t("UserTableHeaderLastName")} sortable />
                            <Column field="email" header={t("UserTableHeaderEmail")} sortable />
                            <Column field="rolId" header={t("UserTableHeaderRol")} sortable />
                            <Column header={t("UserTableHeaderActions")} body={actionsBodyTemplate} sortable />
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
                                        label="Delete"
                                        severity='danger'
                                        onClick={(event) => {
                                            hide(event);
                                            accept();
                                        }}
                                        className="w-8rem"
                                    ></Button>
                                    <Button
                                        label="Cancel"
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
